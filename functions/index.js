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
const MONTHLY_LIMIT = 300;
const MAX_IMAGE_CHARS = 4_000_000;
const DEFAULT_MODEL = "gpt-4o-mini";
const VALID_TYPES = new Set(["red", "white", "rose", "sparkling", "dessert", "etc", ""]);
const VALID_COUNTRY_RE = /^[A-Z]{2}$|^$/;
const DATA_URL_RE = /^data:image\/(?:jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=\r\n]+$/;

function kstMonthKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year").value;
  const month = parts.find((part) => part.type === "month").value;
  return `${year}-${month}`;
}

async function reserveMonthlyUsage(uid) {
  const monthKey = kstMonthKey();
  const ref = db.collection("aiUsage").doc(uid).collection("wineLabelAnalysisMonthly").doc(monthKey);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = snap.exists ? Number(snap.data().count || 0) : 0;
    if (count >= MONTHLY_LIMIT) {
      throw new HttpsError(
        "resource-exhausted",
        `이번 달 사진 자동 입력은 ${MONTHLY_LIMIT}회까지 사용할 수 있어요.`
      );
    }
    tx.set(
      ref,
      {
        count: count + 1,
        limit: MONTHLY_LIMIT,
        monthKey,
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

function normalizedLookupName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function representativeVarietyForType(type = "", country = "") {
  const wineType = (type || "").toLowerCase();
  const countryCode = (country || "").toUpperCase();
  if (wineType === "sparkling") return "샤르도네, 피노 누아, 피노 뮈니에";
  if (wineType === "white" && countryCode === "NZ") return "소비뇽 블랑";
  if (wineType === "red" && countryCode === "AU") return "시라즈";
  if (wineType === "red" && countryCode === "AR") return "말벡";
  if (wineType === "dessert" && countryCode === "HU") return "푸르민트";
  if (wineType === "dessert" && countryCode === "FR") return "세미용, 소비뇽 블랑";
  return "";
}

function inferVarietyFromSuggestion(name, type = "", country = "") {
  const n = normalizedLookupName(name);
  if (!n) return representativeVarietyForType(type, country);

  if (n.includes("blanc de blancs")) return "샤르도네";
  if (n.includes("marie-noelle ledru")) return "피노 누아";
  if (n.includes("blanc de noirs")) return "피노 누아, 피노 뮈니에";
  if (n.includes("sauvignon blanc") || n.includes("sancerre")) return "소비뇽 블랑";
  if (n.includes("chablis") || n.includes("chardonnay")) return "샤르도네";
  if (n.includes("chenin blanc")) return "슈냉 블랑";
  if (n.includes("gewurztraminer")) return "게뷔르츠트라미너";
  if (n.includes("riesling")) return "리슬링";
  if (n.includes("moscato")) return "모스카토";
  if (n.includes("pinot gris") || n.includes("pinot grigio")) return "피노 그리";
  if (n.includes("furmint") || n.includes("tokaji")) return "푸르민트";
  if (n.includes("barsac") || n.includes("sauternes")) return "세미용, 소비뇽 블랑";
  if (n.includes("malbec") && n.includes("cabernet franc")) return "말벡, 카베르네 프랑";
  if (n.includes("syrah") && n.includes("viognier")) return "시라, 비오니에";
  if (n.includes("shiraz")) return "시라즈";
  if (n.includes("syrah")) return "시라";
  if (n.includes("pinotage")) return "피노타주";
  if (n.includes("petit verdot")) return "쁘띠 베르도";
  if (n.includes("merlot")) return "메를로";
  if (n.includes("opus one") || n.includes("overture")) {
    return "카베르네 소비뇽, 메를로, 카베르네 프랑, 쁘띠 베르도, 말벡";
  }
  if (n.includes("sassicaia")) return "카베르네 소비뇽, 카베르네 프랑";
  if (n.includes("sena")) return "카베르네 소비뇽, 까르메네르, 말벡, 메를로, 쁘띠 베르도";
  if (n.includes("talbot") || n.includes("leoville las cases")) {
    return "카베르네 소비뇽, 메를로, 카베르네 프랑, 쁘띠 베르도";
  }
  if (n.includes("cabernet sauvignon") || n.includes("don melchor")) {
    return "카베르네 소비뇽";
  }
  if (n.includes("barbaresco")) return "네비올로";
  if (
    n.includes("pinot noir") ||
    n.includes("gevrey-chambertin") ||
    n.includes("pommard") ||
    n.includes("corton") ||
    n.includes("aloxe-corton") ||
    n.includes("cote de beaune") ||
    n.includes("cote de nuits") ||
    n.includes("marsannay") ||
    n.includes("ladoix") ||
    n.includes("le cloud")
  ) {
    return "피노 누아";
  }
  if (n.includes("gigondas") || n.includes("cotes du rhone")) return "그르나슈, 시라";
  if (n.includes("rioja") || n.includes("kalamity")) return "템프라니요";
  if (n.includes("braida") || n.includes("monferrato")) return "바르베라";
  if (n.includes("jacques selosse")) return "샤르도네";
  if (n.includes("andre clouet")) return "피노 누아";
  if (n.includes("cristal") || n.includes("dom perignon") || n.includes("rare 2008")) {
    return "샤르도네, 피노 누아";
  }

  return representativeVarietyForType(type, country);
}

function normalizeSuggestion(raw) {
  const suggestion = raw && typeof raw === "object" ? raw : {};
  const normalized = {
    name: cleanString(suggestion.name, 120),
    vintage: cleanVintage(suggestion.vintage),
    type: cleanType(suggestion.type),
    country: cleanCountry(suggestion.country),
    variety: cleanString(suggestion.variety, 120),
    confidence: cleanConfidence(suggestion.confidence),
    notes: cleanString(suggestion.notes, 180),
  };
  if (!normalized.variety) {
    normalized.variety = inferVarietyFromSuggestion(
      normalized.name,
      normalized.type,
      normalized.country
    );
  }
  return normalized;
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

const GENERIC_WINE_NAMES = new Set([
  "alsace",
  "barbaresco",
  "barolo",
  "bordeaux",
  "bourgogne",
  "bourgogne chardonnay",
  "bourgogne pinot noir",
  "burgundy",
  "chablis",
  "champagne",
  "chianti",
  "cotes du rhone",
  "gigondas",
  "margaux",
  "marsannay",
  "moscato d'asti",
  "pauillac",
  "pommard",
  "rioja",
  "sancerre",
  "sauternes",
]);

function isGenericWineName(name) {
  const normalized = normalizedLookupName(name)
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return GENERIC_WINE_NAMES.has(normalized);
}

function shouldRetryWithHighDetail(suggestion) {
  if (!suggestion || typeof suggestion !== "object") return true;
  if (!suggestion.name) return true;
  if (isGenericWineName(suggestion.name)) return true;
  return Number(suggestion.confidence || 0) < 0.55;
}

async function analyzeWithOpenAI(image, detail = "low") {
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
                "Use the original Latin-script producer/cuvee wording for name; do not translate the wine name into Korean. " +
                "The name must identify the bottle, not just the broad region or appellation. " +
                "Do not return only generic names like Bourgogne, Chablis, Champagne, Bordeaux, or Sancerre when producer, brand, cuvee, grape, or style text is visible. " +
                "For example, return Les Domaines de la Taste d'Or Bourgogne Chardonnay, not Bourgogne. " +
                "If only appellation and grape/style are readable, return Bourgogne Chardonnay rather than Bourgogne. " +
                "Vintage must be a 4-digit year only. " +
                "type must be one of red, white, rose, sparkling, dessert, etc, or empty. " +
                "country must be a 2-letter ISO code like FR, US, NZ, IT, DE, CL, AU, ES, AR, ZA, HU, or empty. " +
                "variety should be comma-separated Korean grape names when visible or highly likely. " +
                "If the exact blend is not visible but the wine name, region, or style has a standard representative grape, return that representative grape or blend. " +
                "You may infer variety from strong wine-region or cuvee cues: Chablis=샤르도네, " +
                "Sancerre or Sauvignon Blanc=소비뇽 블랑, Riesling=리슬링, Pinot Noir/Burgundy red=피노 누아, " +
                "Syrah/Shiraz=시라 or 시라즈, Moscato d'Asti=모스카토, Sauternes/Barsac=세미용, 소비뇽 블랑, " +
                "Blanc de Blancs=샤르도네, Blanc de Noirs=피노 누아 or 피노 뮈니에. " +
                "If uncertain, leave the field empty and lower confidence.",
            },
            {
              type: "input_image",
              image_url: image,
              detail,
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

    await reserveMonthlyUsage(uid);
    let detail = "low";
    let suggestion = await analyzeWithOpenAI(image, detail);
    let retriedHighDetail = false;
    if (shouldRetryWithHighDetail(suggestion)) {
      detail = "high";
      retriedHighDetail = true;
      suggestion = await analyzeWithOpenAI(image, detail);
    }
    logger.info("Wine label analyzed", {
      uid,
      hasName: !!suggestion.name,
      hasVintage: !!suggestion.vintage,
      type: suggestion.type,
      confidence: suggestion.confidence,
      detail,
      retriedHighDetail,
    });

    return { suggestion, detail, retriedHighDetail };
  }
);
