"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const APP_PATH = path.join(__dirname, "..", "app.js");
const BOOTSTRAP_MARKER = '\n  document.querySelectorAll(".tab").forEach((b) => {';

class MemoryStorage {
  constructor(entries = {}) {
    this.values = new Map(Object.entries(entries));
  }

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

function createHarness(entries = {}) {
  const source = fs.readFileSync(APP_PATH, "utf8");
  const markerIndex = source.indexOf(BOOTSTRAP_MARKER);
  assert.notEqual(markerIndex, -1, "app bootstrap marker should remain discoverable");

  const testSource = `${source.slice(0, markerIndex)}
    globalThis.__wineTests = {
      getState: () => JSON.parse(JSON.stringify(state)),
      load,
      seedWines,
      normalizeWines,
      mergeInitialCloudWines,
      pickInitialSyncConflict,
      persistLocalOnly,
      backupLocalBeforeFirstSync,
      isServerConfirmedSnapshot,
      markWineModified,
      setState: (next) => {
        state.wines = JSON.parse(JSON.stringify(next.wines || []));
        state.deletedSeedIds = (next.deletedSeedIds || []).slice();
      },
      localCalendarDate,
      starRatingFromPointer,
      cloudDataSizeBytes,
      firestoreSafeMaxBytes: FIRESTORE_SAFE_MAX_BYTES,
    };
  })();`;

  const localStorage = new MemoryStorage(entries);
  const context = {
    console: { warn() {}, log() {}, error() {} },
    Date,
    JSON,
    Map,
    Set,
    Math,
    Number,
    Object,
    Array,
    String,
    RegExp,
    TextEncoder,
    encodeURIComponent,
    localStorage,
    sessionStorage: new MemoryStorage(),
    document: {
      querySelector() {
        return null;
      },
    },
  };
  context.globalThis = context;
  vm.runInNewContext(testSource, context, { filename: APP_PATH });
  return { hooks: context.__wineTests, localStorage };
}

function basicWine(id, name) {
  return {
    id,
    status: "cellar",
    name,
    country: "",
    type: "red",
    vintage: "",
    variety: "",
    price: null,
    purchaseDate: "",
    photo: null,
  };
}

{
  const storedWine = basicWine("custom-1", "지켜야 할 와인");
  const { hooks } = createHarness({
    "wine-cellar-v1": JSON.stringify([storedWine]),
    "wine-cellar-seed-version": "user-wine-list-2026-06-29-english-wine-names",
    "wine-cellar-pref": "{broken-json",
  });
  hooks.load();
  const state = hooks.getState();
  assert.equal(state.wines.length, 1);
  assert.equal(state.wines[0].name, "지켜야 할 와인");
}

{
  const { hooks, localStorage } = createHarness();
  const editedSeed = hooks.seedWines()[0];
  editedSeed.name = "내가 수정한 이름";
  editedSeed.photo = null;
  localStorage.setItem("wine-cellar-v1", JSON.stringify([editedSeed]));
  localStorage.setItem(
    "wine-cellar-seed-version",
    "user-wine-list-2026-06-29-english-wine-names"
  );
  hooks.load();
  const loaded = hooks.getState().wines[0];
  assert.equal(loaded.name, "내가 수정한 이름");
  assert.equal(loaded.photo, null);
  assert.ok(
    JSON.parse(localStorage.getItem("wine-cellar-deleted-seeds-v1")).includes("seed-002")
  );
}

{
  const { hooks, localStorage } = createHarness();
  const seeds = hooks.seedWines();
  localStorage.setItem("wine-cellar-v1", JSON.stringify(seeds.slice(1)));
  localStorage.setItem("wine-cellar-seed-version", "older-seed-version");
  localStorage.setItem("wine-cellar-deleted-seeds-v1", JSON.stringify(["seed-001"]));
  hooks.load();
  const ids = hooks.getState().wines.map((wine) => wine.id);
  assert.equal(ids.includes("seed-001"), false);
  assert.equal(ids.includes("seed-180"), true);
}

{
  const { hooks } = createHarness();
  const localSeed = hooks.seedWines()[0];
  const cloudSeed = Object.assign({}, localSeed, {
    name: "클라우드에서 수정한 이름",
    userModified: true,
  });
  const localOnly = basicWine("local-only", "로컬 전용");
  const cloudOnly = basicWine("cloud-only", "클라우드 전용");
  const merged = hooks.mergeInitialCloudWines(
    [localSeed, localOnly],
    [cloudSeed, cloudOnly]
  );
  assert.equal(merged.find((wine) => wine.id === "seed-001").name, "클라우드에서 수정한 이름");
  assert.ok(merged.some((wine) => wine.id === "local-only"));
  assert.ok(merged.some((wine) => wine.id === "cloud-only"));
}

{
  const { hooks } = createHarness();
  const local = Object.assign(basicWine("same", "로컬 수정"), { userModified: true });
  const cloud = Object.assign(basicWine("same", "클라우드 수정"), { userModified: true });
  const merged = hooks.mergeInitialCloudWines([local], [cloud]);
  assert.equal(merged[0].name, "로컬 수정");
}

{
  const { hooks } = createHarness();
  const localWithoutTime = Object.assign(basicWine("same", "오래된 로컬"), {
    userModified: true,
  });
  const cloudWithTime = Object.assign(basicWine("same", "최신 클라우드"), {
    userModified: true,
    clientUpdatedAt: "2026-07-14T01:00:00.000Z",
  });
  assert.equal(
    hooks.pickInitialSyncConflict(localWithoutTime, cloudWithTime).name,
    "최신 클라우드"
  );
  assert.equal(
    hooks.pickInitialSyncConflict(
      Object.assign({}, localWithoutTime, { clientUpdatedAt: "2026-07-14T02:00:00.000Z" }),
      Object.assign({}, cloudWithTime, { clientUpdatedAt: undefined })
    ).name,
    "오래된 로컬"
  );
}

{
  const oldWines = JSON.stringify([basicWine("old", "기존 와인")]);
  const oldDeleted = JSON.stringify(["seed-001"]);
  const { hooks, localStorage } = createHarness({
    "wine-cellar-v1": oldWines,
    "wine-cellar-deleted-seeds-v1": oldDeleted,
  });
  hooks.setState({
    wines: [basicWine("new", "새 와인")],
    deletedSeedIds: ["seed-002"],
  });
  const originalSetItem = localStorage.setItem.bind(localStorage);
  let failed = false;
  localStorage.setItem = (key, value) => {
    if (key === "wine-cellar-v1" && !failed) {
      failed = true;
      throw new Error("quota");
    }
    originalSetItem(key, value);
  };
  assert.equal(hooks.persistLocalOnly(), false);
  assert.equal(localStorage.getItem("wine-cellar-v1"), oldWines);
  assert.equal(localStorage.getItem("wine-cellar-deleted-seeds-v1"), oldDeleted);
}

{
  const { hooks, localStorage } = createHarness();
  const localWine = basicWine("local", "로컬");
  const cloudWine = basicWine("cloud", "클라우드");
  hooks.setState({ wines: [localWine], deletedSeedIds: [] });
  assert.equal(hooks.backupLocalBeforeFirstSync([cloudWine]), true);
  const backup = JSON.parse(localStorage.getItem("wine-cellar-pre-sync-backup-v1"));
  assert.equal(backup.wines[0].name, "로컬");
  assert.equal(backup.cloudWines[0].name, "클라우드");
  assert.equal(hooks.isServerConfirmedSnapshot({ metadata: { fromCache: true } }), false);
  assert.equal(
    hooks.isServerConfirmedSnapshot({ metadata: { fromCache: false, hasPendingWrites: true } }),
    false
  );
  assert.equal(hooks.isServerConfirmedSnapshot({ metadata: { fromCache: false } }), true);
  hooks.markWineModified(localWine);
  assert.equal(localWine.userModified, true);
  assert.ok(Date.parse(localWine.clientUpdatedAt) > 0);
}

{
  const { hooks } = createHarness();
  assert.equal(hooks.localCalendarDate(new Date(2026, 6, 14, 0, 30)), "2026-07-14");
  assert.equal(hooks.starRatingFromPointer(3, 110, 100, 40), 2.5);
  assert.equal(hooks.starRatingFromPointer(3, 121, 100, 40), 3);
  const oversized = hooks.cloudDataSizeBytes([
    Object.assign(basicWine("large", "큰 사진"), { photo: "x".repeat(950 * 1024) }),
  ]);
  assert.ok(oversized > hooks.firestoreSafeMaxBytes);
}

console.log("wine regression tests passed");
