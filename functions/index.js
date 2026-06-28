"use strict";

const { initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");
const { defineSecret } = require("firebase-functions/params");
const { HttpsError, onCall } = require("firebase-functions/v2/https");

initializeApp();

const db = getFirestore();
const openaiApiKey = defineSecret("OPENAI_API_KEY");

const REGION = "asia-northeast3";
const DAILY_LIMIT = 8;
const MAX_IMAGE_CHARS = 4_000_000;
const DEFAULT_MODEL = "gpt-4o-mini";
const VALID_TYPES = new Set(["red", "white", "rose", "sparkling", "dessert", "etc", ""]);
const VALID_COUNTRY_RE = /^[A-Z]{2}$|^$/;
const DATA_URL_RE = /^data:image\/(?:jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=\r\n]+$/;

function kstDayKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

async function reserveDailyUsage(uid) {
  const dayKey = kstDayKey();
  const ref = db.collection("aiUsage").doc(uid).collection("wineLabelAnalysis").doc(dayKey);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = snap.exists ? Number(snap.data().count || 0) : 0;
    if (count >= DAILY_LIMIT) {
      throw new HttpsError(
        "resource-exhausted",
        `오늘 사진 자동 입력은 ${DAILY_LIMIT}회까지 사용할 수 있어요.`
      );
    }
    tx.set(
      ref,
      {
        count: count + 1,
        limit: DAILY_LIMIT,
        dayKey,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
}

function cleanString(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function cleanVintage(value) {
  const match = cleanString(value, 16).match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : "";
}

function cleanType(value) {
  const type = cleanString(value, 24).toLowerCase();
  return VALID_TYPES.has(type) ? type : "";
}

function cleanCountry(value) {
  const country = cleanString(value, 8).toUpperCase();
  return VALID_COUNTRY_RE.test(country) ? country : "";
}

function cleanConfidence(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function normalizeSuggestion(raw) {
  const suggestion = raw && typeof raw === "object" ? raw : {};
  return {
    name: cleanString(suggestion.name, 120),
    vintage: cleanVintage(suggestion.vintage),
    type: cleanType(suggestion.type),
    country: cleanCountry(suggestion.country),
    variety: cleanString(suggestion.variety, 120),
    confidence: cleanConfidence(suggestion.confidence),
    notes: cleanString(suggestion.notes, 180),
  };
}

function extractOutputText(payload) {
  if (payload && typeof payload.output_text === "string") return payload.output_text;
  const output = Array.isArray(payload && payload.output) ? payload.output : [];
  for (const item of output) {
    const content = Array.isArray(item && item.content) ? item.content : [];
    for (const part of content) {
      if (part && part.type === "output_text" && typeof part.text === "string") {
        return part.text;
      }
    }
  }
  return "";
}

async function analyzeWithOpenAI(image) {
  const apiKey = openaiApiKey.value();
  if (!apiKey) {
    throw new HttpsError("failed-precondition", "OPENAI_API_KEY secret이 아직 설정되지 않았어요.");
  }

  const model = process.env.OPENAI_VISION_MODEL || DEFAULT_MODEL;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Analyze this wine bottle label. Return only fields visible or strongly inferable from the label. " +
                "Use the original producer/cuvee wording for name. Vintage must be a 4-digit year only. " +
                "type must be one of red, white, rose, sparkling, dessert, etc, or empty. " +
                "country must be a 2-letter ISO code like FR, US, NZ, IT, DE, CL, AU, ES, AR, ZA, HU, or empty. " +
                "variety should be comma-separated grape names when visible or highly likely. " +
                "If uncertain, leave the field empty and lower confidence.",
            },
            {
              type: "input_image",
              image_url: image,
              detail: "low",
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "wine_label_analysis",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: ["name", "vintage", "type", "country", "variety", "confidence", "notes"],
            properties: {
              name: { type: "string" },
              vintage: { type: "string" },
              type: {
                type: "string",
                enum: ["red", "white", "rose", "sparkling", "dessert", "etc", ""],
              },
              country: { type: "string" },
              variety: { type: "string" },
              confidence: { type: "number", minimum: 0, maximum: 1 },
              notes: { type: "string" },
            },
          },
        },
      },
      max_output_tokens: 420,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    logger.warn("OpenAI wine label analysis failed", {
      status: response.status,
      code: payload && payload.error && payload.error.code,
      type: payload && payload.error && payload.error.type,
    });
    throw new HttpsError("internal", "사진 분석에 실패했어요. 잠시 후 다시 시도하세요.");
  }

  const outputText = extractOutputText(payload);
  if (!outputText) {
    throw new HttpsError("internal", "사진 분석 결과가 비어 있어요.");
  }

  let parsed;
  try {
    parsed = JSON.parse(outputText);
  } catch (error) {
    logger.warn("OpenAI returned non-JSON wine label analysis");
    throw new HttpsError("internal", "사진 분석 결과를 읽지 못했어요.");
  }

  return normalizeSuggestion(parsed);
}

exports.analyzeWineLabel = onCall(
  {
    region: REGION,
    secrets: [openaiApiKey],
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    const uid = request.auth && request.auth.uid;
    if (!uid) {
      throw new HttpsError("unauthenticated", "로그인 후 사진 자동 입력을 사용할 수 있어요.");
    }

    const rawImage = request.data && request.data.image;
    if (typeof rawImage !== "string" || rawImage.length > MAX_IMAGE_CHARS) {
      throw new HttpsError("invalid-argument", "분석할 와인 병 사진이 올바르지 않아요.");
    }
    const image = rawImage.trim();
    if (!image || !DATA_URL_RE.test(image)) {
      throw new HttpsError("invalid-argument", "분석할 와인 병 사진이 올바르지 않아요.");
    }

    await reserveDailyUsage(uid);
    const suggestion = await analyzeWithOpenAI(image);
    logger.info("Wine label analyzed", {
      uid,
      hasName: !!suggestion.name,
      hasVintage: !!suggestion.vintage,
      type: suggestion.type,
      confidence: suggestion.confidence,
    });

    return { suggestion };
  }
);
