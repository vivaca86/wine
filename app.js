/* =========================================================
   와인 셀러 — app logic
   Vanilla JS + localStorage. No build step, no network.
   ========================================================= */

(function () {
  "use strict";

  const STORE_KEY = "wine-cellar-v1";
  const FIREBASE_EMAIL_KEY = "wine-cellar-firebase-email";
  const FIREBASE_LOGIN_SESSION_KEY = "wine-cellar-login-audit-uid";
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDPmWSZIIO-yDtnwfCBFFIzmvx_8njtHMs",
    authDomain: "wine-974c5.firebaseapp.com",
    projectId: "wine-974c5",
    storageBucket: "wine-974c5.firebasestorage.app",
    messagingSenderId: "1008470593815",
    appId: "1:1008470593815:web:878804c525301fb1e72752",
  };
  const FIREBASE_SDK_VERSION = "10.12.5";
  const FIRESTORE_COLLECTION = "cellars";
  const FIRESTORE_DOC_ID = "main";
  const FIRESTORE_LOGS_COLLECTION = "logs";

  /* Wine types: id, label, emoji swatch, icon color */
  const TYPES = [
    { id: "red", label: "레드", emoji: "🍷", color: "#8f2634" },
    { id: "white", label: "화이트", emoji: "🥂", color: "#f6df9a" },
    { id: "rose", label: "로제", emoji: "🌸", color: "#ef86a3" },
    { id: "sparkling", label: "스파클링", emoji: "🍾", color: "#f1c84e" },
    { id: "dessert", label: "디저트", emoji: "🍯", color: "#d98712" },
    { id: "etc", label: "기타", emoji: "🍇", color: "#6a5577" },
  ];
  const TYPE_ORDER = ["red", "sparkling", "white", "rose", "dessert", "etc"];
  const FORM_TYPE_IDS = ["red", "white", "rose", "sparkling", "dessert"];

  /* Wine-producing countries: code, name (ko), flag emoji */
  const COUNTRIES = [
    { code: "FR", name: "프랑스", flag: "🇫🇷" },
    { code: "IT", name: "이탈리아", flag: "🇮🇹" },
    { code: "ES", name: "스페인", flag: "🇪🇸" },
    { code: "US", name: "미국", flag: "🇺🇸" },
    { code: "CL", name: "칠레", flag: "🇨🇱" },
    { code: "AR", name: "아르헨티나", flag: "🇦🇷" },
    { code: "AU", name: "호주", flag: "🇦🇺" },
    { code: "NZ", name: "뉴질랜드", flag: "🇳🇿" },
    { code: "DE", name: "독일", flag: "🇩🇪" },
    { code: "PT", name: "포르투갈", flag: "🇵🇹" },
    { code: "ZA", name: "남아공", flag: "🇿🇦" },
    { code: "AT", name: "오스트리아", flag: "🇦🇹" },
    { code: "GR", name: "그리스", flag: "🇬🇷" },
    { code: "HU", name: "헝가리", flag: "🇭🇺" },
    { code: "GE", name: "조지아", flag: "🇬🇪" },
    { code: "KR", name: "한국", flag: "🇰🇷" },
    { code: "JP", name: "일본", flag: "🇯🇵" },
    { code: "CN", name: "중국", flag: "🇨🇳" },
    { code: "ETC", name: "기타", flag: "🏳️" },
  ];

  const PREF_KEY = "wine-cellar-pref";
  const SEED_KEY = "wine-cellar-seed-version";
  const SEED_VERSION = "user-wine-list-2026-06-23-add-sparkling-records";
  const SEED_TSV = `status	type	country_code	country_name	name	vintage
cellar	red	FR	프랑스	프리에르 로크, 르 끌라우드	2019
cellar	red	FR	프랑스	모알라 제브리 샹베르땅	2018
cellar	red	FR	프랑스	알렉스 감발 제브리 샹베르땅	2019
drunk	red	FR	프랑스	앙또네 귀용 알렉스 꼬르동 1CRU 레 푸르니에	2017
cellar	red	FR	프랑스	죠셉 드루앵 제브리 샹베르땅	2017
cellar	red	FR	프랑스	루이 라투르 제브리 샹베르땅	2018
cellar	red	FR	프랑스	본 트롱 1CRU	2020
drunk	red	FR	프랑스	A.F. GROS 브르고뉴	2019
drunk	red	FR	프랑스	샤또 딸보	2014
drunk	red	FR	프랑스	샤또 딸보 하프보틀	2019
drunk	red	FR	프랑스	꼬네따블 딸보	2018
cellar	red	FR	프랑스	부샤 제브리 샹베르땅	2018
drunk	red	FR	프랑스	부샤 뽀마르	2019
cellar	red	FR	프랑스	앙또네 귀용 꼬르똥 브레상드 그랑크뤼	2014
drunk	red	FR	프랑스	앙또네 귀용 꼬뜨 드본 빌라쥐	2017
drunk	red	FR	프랑스	샤또 르 퓌 에밀리앙	2018
drunk	red	FR	프랑스	죠셉 드루앵 라포레 브르고뉴	2019
drunk	red	FR	프랑스	필립 리베라 꼬뜨 드 뉘 빌라쥬	2019
cellar	red	FR	프랑스	샤또 레오빌 라즈까즈	2018
drunk	red	FR	프랑스	샤를 에네 꼬뜨 뒤 론
drunk	red	US	미국	패너 애쉬	2018
drunk	red	US	미국	덕혼 디코이	2019
cellar	red	US	미국	덕혼 디코이 멜롯
cellar	red	US	미국	덕혼 디코이 멜롯
cellar	red	US	미국	칼레라 피노누아
drunk	red	US	미국	텍스트북	2020
drunk	red	US	미국	텍스트북	2020
drunk	red	US	미국	텍스트북	2020
cellar	red	US	미국	오퍼스원	2019
cellar	red	US	미국	오퍼스원	2019
cellar	red	US	미국	오퍼스원	2018
cellar	red	US	미국	오버츄어
cellar	red	US	미국	힐트	2018
drunk	red	US	미국	힐트	2018
drunk	red	US	미국	힐트	2018
drunk	red	AU	호주	투핸즈 벨라스 가든	2019
drunk	red	AU	호주	투핸즈 벨라스 가든	2019
drunk	red	AU	호주	투핸즈 릴리스 가든	2019
drunk	red	AU	호주	투핸즈 릴리스 가든	2019
drunk	red	AU	호주	투핸즈 릴리스 가든	2019
drunk	red	AU	호주	투핸즈 찰리스 가든
cellar	red	AU	호주	투핸즈 찰리스 가든
drunk	red	AU	호주	킬리카눈 오라클	2016
drunk	red	AU	호주	킬리카눈 오라클	2016
drunk	red	AU	호주	킬리카눈 오라클	2016
drunk	red	AU	호주	블루 아이드 보이	2021
drunk	red	AU	호주	더 복서	2021
drunk	red	AR	아르헨티나	이스까이	2019
drunk	red	AR	아르헨티나	이스까이	2020
drunk	red	AR	아르헨티나	이스까이	2020
drunk	red	AR	아르헨티나	이스까이	2020
cellar	red	CL	칠레	세냐	2017
cellar	red	CL	칠레	세냐	2020
cellar	red	CL	칠레	돈 멜쵸	2020
cellar	red	IT	이탈리아	사시까이아	2019
cellar	red	IT	이탈리아	라 스피네따 바르바레스코 스타데리	2014
drunk	red	NZ	뉴질랜드	클라우디베이 피노누아	2018
drunk	red	NZ	뉴질랜드	맨패밀리 피노타쥐
cellar	sparkling	FR	프랑스	크리스탈	2012
cellar	sparkling	FR	프랑스	크리스탈	2014
cellar	sparkling	FR	프랑스	크리스탈	2015
cellar	sparkling	FR	프랑스	자크셀로스 V.O
cellar	sparkling	FR	프랑스	자크셀로스 V.O
cellar	sparkling	FR	프랑스	크룩 170
cellar	sparkling	FR	프랑스	크룩 170
cellar	sparkling	FR	프랑스	크룩 171
cellar	sparkling	FR	프랑스	크룩 171
cellar	sparkling	FR	프랑스	크룩 171
cellar	sparkling	FR	프랑스	크룩 172
cellar	sparkling	FR	프랑스	돔페르뇽	2012
cellar	sparkling	FR	프랑스	돔페르뇽	2013
cellar	sparkling	FR	프랑스	돔페르뇽	2013
cellar	sparkling	FR	프랑스	돔페르뇽	2013
drunk	sparkling	FR	프랑스	돔페르뇽	2013
cellar	sparkling	FR	프랑스	앙리지로 MV17
cellar	sparkling	FR	프랑스	레어 08
drunk	sparkling	FR	프랑스	떼땅져
drunk	sparkling	FR	프랑스	떼땅져
cellar	sparkling	FR	프랑스	떼땅져
drunk	sparkling	FR	프랑스	떼땅져
drunk	sparkling	FR	프랑스	필리조 에피스
cellar	sparkling	FR	프랑스	뽀므리
drunk	sparkling	FR	프랑스	플뢰리
drunk	sparkling	FR	프랑스	파이퍼 하이직
cellar	sparkling	FR	프랑스	파이퍼하이직	2014
drunk	sparkling	FR	프랑스	폴로져
drunk	sparkling	FR	프랑스	뵈브 끌레꼬
drunk	sparkling	FR	프랑스	뵈브 끌레꼬
drunk	sparkling	FR	프랑스	뵈브 끌레꼬
cellar	sparkling	FR	프랑스	뵈브 끌레꼬 로제
drunk	sparkling	FR	프랑스	빌까르 살몽 드미섹
cellar	sparkling	FR	프랑스	볼랭져
drunk	sparkling	FR	프랑스	멈 그랑 꼬르똥
drunk	sparkling	FR	프랑스	페리에 주에
drunk	sparkling	FR	프랑스	앙드레 끌루에
drunk	sparkling	FR	프랑스	도츠
drunk	white	FR	프랑스	게뷔르츠트라미너 그로씨 로에	2011
cellar	white	FR	프랑스	휘겔 게뷔리츠트라미너
drunk	white	DE	독일	스모켓 리슬링
drunk	white	ZA	남아공	맨패밀리 슈냉블랑
drunk	white	DE	독일	군트럼 카비넷
drunk	white	CL	칠레	도스코파스
drunk	white	NZ	뉴질랜드	브레이크 포인트 소비뇽블랑
drunk	white	NZ	뉴질랜드	브레이크 포인트 소비뇽블랑
drunk	white	NZ	뉴질랜드	래빗 아일랜드 소비뇽블랑
drunk	white	NZ	뉴질랜드	베비치 블랙 소비뇽블랑
cellar	white	NZ	뉴질랜드	더 패스 소비뇽블랑
cellar	white	NZ	뉴질랜드	셀락 오리진 소비뇽블랑
cellar	white	NZ	뉴질랜드	셀락 오리진 소비뇽블랑
drunk	white	DE	독일	마르쿠스 몰리터 젤팅거 아우스레제	2018
cellar	white	DE	독일	로버트 바일 리슬링	2021
drunk	white	DE	독일	로버트 바일 리슬링	2021
drunk	white	DE	독일	로버트 바일 리슬링	2021
drunk	white	DE	독일	로버트 바일 리슬링	2021
drunk	white	DE	독일	로버트 바일 리슬링 스파클링
drunk	white	FR	프랑스	루이자도 샤블리	2021
drunk	white	FR	프랑스	샤블리 생마르땡	2021
drunk	white	FR	프랑스	바이용 샤블리 1CRU	2018
cellar	white	FR	프랑스	조셉드루앙 샤블리 1CRU	2018
drunk	white	FR	프랑스	메종 니꼴라 뽀뗄 샤블리 1er 발롱
drunk	white	FR	프랑스	샤블리. 15000원 뽑기로 뽑은거
drunk	white	HU	헝가리	로얄토카이
drunk	white	HU	헝가리	로얄 토카이 블루라벨
cellar	white	HU	헝가리	로얄 토카이 블루라벨
cellar	white	FR	프랑스	샤또 꾸떼	2016
cellar	white	FR	프랑스	샤또 꾸떼	2016
cellar	white	FR	프랑스	샤또 기로	2016
drunk	white	NZ	뉴질랜드	클라우디베이	2021
drunk	white	NZ	뉴질랜드	클라우디베이	2022
drunk	white	NZ	뉴질랜드	클라우디베이	2022
drunk	white	NZ	뉴질랜드	클라우디베이	2022
drunk	white	NZ	뉴질랜드	클라우디베이	2023
cellar	white	NZ	뉴질랜드	클라우디베이	2024
drunk	white	NZ	뉴질랜드	클라우디베이	2024
drunk	white	NZ	뉴질랜드	오이스터베이
drunk	white	NZ	뉴질랜드	도그포인트	2018
drunk	white	NZ	뉴질랜드	도그포인트	2020
drunk	white	NZ	뉴질랜드	도그포인트	2021
drunk	white	NZ	뉴질랜드	화이트헤븐	2021
drunk	white	NZ	뉴질랜드	머드하우스	2021
drunk	white	NZ	뉴질랜드	펄리셔	2022
drunk	white	NZ	뉴질랜드	인비보	2022
drunk	white	NZ	뉴질랜드	토후	2022
drunk	white	IT	이탈리아	시라꼬	2021
cellar	white	IT	이탈리아	브리꼬 꽐리아	2021
drunk	white	IT	이탈리아	브리꼬 꽐리아	2022
drunk	white	IT	이탈리아	브리꼬 꽐리아	2022
drunk	white	FR	프랑스	오렌지 카틴 피노 그리
drunk	red	US	미국	브레드 앤 버터 피노 누아
drunk	red	CL	칠레	몬테스 클래식 시리즈 카베르네 소비뇽
drunk	red	IT	이탈리아	브라이다 일 바치알레
drunk	red	FR	프랑스	루이 자도 부르고뉴 피노 누아
drunk	red	AU	호주	체라볼로 프티 베르도
drunk	white	DE	독일	조머 리슬링 트로켄
drunk	red	FR	프랑스	기갈 지공다스
drunk	red	FR	프랑스	도멘 페블리 마르사네
drunk	red	ES	스페인	칼라미티 리오하
drunk	sparkling	FR	프랑스	샤를 에드시크 브뤼 레제르브
drunk	sparkling	FR	프랑스	클레망 페르스발 레 루로 블랑 드 블랑
drunk	sparkling	FR	프랑스	클레망 페르스발 르 뤼 블랑 드 누아
drunk	red	FR	프랑스	마르크 소야르 크라 2022 부르고뉴
drunk	sparkling	FR	프랑스	마리 노엘 르드뤼 퀴베 뒤 굴테 그랑 크뤼
drunk	white	NZ	뉴질랜드	머드하우스 소비뇽 블랑
drunk	white	NZ	뉴질랜드	머드하우스 소비뇽 블랑
drunk	white	NZ	뉴질랜드	코노 소비뇽 블랑
drunk	white	NZ	뉴질랜드	코노 소비뇽 블랑
drunk	white	NZ	뉴질랜드	코노 소비뇽 블랑
drunk	white	NZ	뉴질랜드	베비치 블랙라벨 소비뇽 블랑
drunk	white	NZ	뉴질랜드	베비치 블랙라벨 소비뇽 블랑
drunk	white	NZ	뉴질랜드	킴 크로포드 소비뇽 블랑
drunk	white	NZ	뉴질랜드	킴 크로포드 소비뇽 블랑
drunk	white	NZ	뉴질랜드	오이스터 베이 소비뇽 블랑
drunk	white	NZ	뉴질랜드	오이스터 베이 소비뇽 블랑
drunk	white	NZ	뉴질랜드	펄리셔 소비뇽 블랑
drunk	white	NZ	뉴질랜드	펄리셔 소비뇽 블랑
drunk	sparkling	FR	프랑스	페리에 주에
drunk	sparkling	FR	프랑스	파이퍼하이직
drunk	sparkling	FR	프랑스	파이퍼하이직
drunk	sparkling	FR	프랑스	파이퍼하이직
drunk	sparkling	FR	프랑스	도츠`;

  /* ---------- State ---------- */
  let state = {
    wines: [],
    tab: "cellar",
    typeFilter: "all",
    countryFilter: "all",
    filterPanel: null,
    searchOpen: false,
    searchQuery: "",
    sortBy: "name",
    sortDir: "asc",
    lastViewedId: null,
    syncStatus: "local",
    syncMessage: "",
    lastSyncedAt: "",
  };

  let syncDebounce = null;
  let applyingRemote = false;
  let auth = null;
  let db = null;
  let firebaseApi = null;
  let firebaseReady = false;
  let unsubscribeCellar = null;
  let currentUser = null;
  let pendingAuditLogs = [];

  function seedWines() {
    return SEED_TSV.trim()
      .split(/\r?\n/)
      .slice(1)
      .map((line, idx) => {
        const [status, type, country, , name, vintage] = line.split("\t");
        const wine = {
          id: `seed-${String(idx + 1).padStart(3, "0")}`,
          status,
          name: name.trim(),
          country: country || "",
          type,
          vintage: (vintage || "").trim(),
          price: null,
          purchaseDate: "",
          photo: null,
        };
        if (status === "drunk") {
          wine.rating = null;
          wine.drunkDate = "";
          wine.note = "";
        }
        return wine;
      });
  }

  function applySeedIfNeeded() {
    const raw = localStorage.getItem(STORE_KEY);
    const currentSeed = localStorage.getItem(SEED_KEY);
    if (raw && currentSeed === SEED_VERSION) return false;

    const seeds = seedWines();
    if (raw) {
      const existing = JSON.parse(raw) || [];
      const existingIds = new Set(existing.map((w) => w.id));
      seeds.forEach((seed) => {
        if (!existingIds.has(seed.id)) {
          existing.push(seed);
        }
      });
      state.wines = existing;
    } else {
      state.wines = seeds;
    }

    localStorage.setItem(STORE_KEY, JSON.stringify(state.wines));
    localStorage.setItem(SEED_KEY, SEED_VERSION);
    return true;
  }

  function load() {
    try {
      if (!applySeedIfNeeded()) {
        const raw = localStorage.getItem(STORE_KEY);
        if (raw) state.wines = JSON.parse(raw) || [];
      }
      const pref = JSON.parse(localStorage.getItem(PREF_KEY) || "{}");
      if (["name", "price", "rating"].includes(pref.sortBy)) {
        state.sortBy = pref.sortBy;
        if (pref.sortDir === "asc" || pref.sortDir === "desc") {
          state.sortDir = pref.sortDir;
        }
      }
    } catch (e) {
      state.wines = seedWines();
    }
  }
  function savePref() {
    try {
      localStorage.setItem(
        PREF_KEY,
        JSON.stringify({ sortBy: state.sortBy, sortDir: state.sortDir })
      );
    } catch (e) {}
  }
  /* Persist locally; returns false if storage quota is exceeded. */
  function persistLocalOnly() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state.wines));
      return true;
    } catch (e) {
      return false;
    }
  }

  function queueAuditLog(auditLog) {
    if (auditLog) pendingAuditLogs.push(auditLog);
  }

  function persist(auditLog) {
    const saved = persistLocalOnly();
    if (saved && !applyingRemote) {
      queueAuditLog(auditLog);
      queueSyncPush();
    }
    return saved;
  }

  /* ---------- Helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const view = $("#view");
  const sheet = $("#sheet");
  const backdrop = $("#backdrop");

  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const typeOf = (id) =>
    TYPES.find((t) => t.id === id) || TYPES[TYPES.length - 1];
  const formTypes = () => FORM_TYPE_IDS.map(typeOf);
  const formTypeLabel = (id) => (id === "sparkling" ? "스파클링" : typeOf(id).label);
  const typeRank = (id) => {
    const rank = TYPE_ORDER.indexOf(id || "etc");
    return rank === -1 ? TYPE_ORDER.length : rank;
  };
  const countryOf = (code) => COUNTRIES.find((c) => c.code === code) || null;

  const esc = (s) =>
    String(s == null ? "" : s).replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
          c
        ])
    );

  /* Circular flag badge (SVG image) for a country code ("" when unknown).
     Uses local circle-flag SVGs so it renders identically on every device. */
  function flagBadge(code, big) {
    const c = countryOf(code);
    if (!c) return "";
    const file = c.code === "ETC" ? "xx" : c.code.toLowerCase();
    return `<img class="flag-img ${
      big ? "flag-img--lg" : ""
    }" src="flags/${file}.svg" alt="${c.name}" title="${c.name}" />`;
  }

  function won(n) {
    if (n == null || n === "" || isNaN(n)) return "—";
    return "₩" + Number(n).toLocaleString("ko-KR");
  }

  function fmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return "—";
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(d.getDate()).padStart(2, "0")}`;
  }

  const today = () => new Date().toISOString().slice(0, 10);

  function daysBetween(a, b) {
    if (!a || !b) return null;
    const d1 = new Date(a + "T00:00:00");
    const d2 = new Date(b + "T00:00:00");
    if (isNaN(d1) || isNaN(d2)) return null;
    return Math.round((d2 - d1) / 86400000);
  }

  function starsHTML(rating) {
    const value = Number(rating) || 0;
    let out = '<span class="stars">';
    for (let i = 1; i <= 5; i++) {
      const cls =
        i <= value ? "on" : value >= i - 0.5 ? "half" : "";
      out += `<span class="s ${cls}">★</span>`;
    }
    return out + "</span>";
  }

  function typeIconHTML(typeId, variant) {
    const t = typeOf(typeId);
    const label = esc(t.label);
    const cls = variant ? ` type-icon--${variant}` : "";
    const fill = t.color;
    const isFlute = t.id === "rose" || t.id === "sparkling";
    if (isFlute) {
      const bubbles =
        t.id === "sparkling"
          ? `<circle class="type-icon__bubble" cx="11" cy="8" r=".65" />
             <circle class="type-icon__bubble" cx="12.8" cy="10.6" r=".52" />`
          : "";
      return `<span class="type-icon${cls}" title="${label}" aria-label="${label}" role="img">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path class="type-icon__glass" d="M8.2 2.4h7.6L14.6 15.1a2.65 2.65 0 0 1-5.2 0L8.2 2.4Z" />
          <path d="M9.1 4.8h5.8L14 14.2a2 2 0 0 1-4 0L9.1 4.8Z" fill="${fill}" />
          ${bubbles}
          <path class="type-icon__outline" d="M8.2 2.4h7.6L14.6 15.1a2.65 2.65 0 0 1-5.2 0L8.2 2.4Z" />
          <path class="type-icon__outline" d="M12 17v3.1M8.9 21h6.2" />
        </svg>
      </span>`;
    }
    return `<span class="type-icon${cls}" title="${label}" aria-label="${label}" role="img">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path class="type-icon__glass" d="M6.3 2.4h11.4c-.25 7.65-2 12.8-5.7 12.8S6.55 10.05 6.3 2.4Z" />
        <path d="M7.25 4.8h9.5c-.48 6.5-1.98 9.25-4.75 9.25S7.73 11.3 7.25 4.8Z" fill="${fill}" />
        <path class="type-icon__shine" d="M8.8 4.1c-.28 2.25-.08 5 .72 7.3" />
        <path class="type-icon__outline" d="M6.3 2.4h11.4c-.25 7.65-2 12.8-5.7 12.8S6.55 10.05 6.3 2.4Z" />
        <path class="type-icon__outline" d="M12 15v5.1M8.7 21h6.6" />
      </svg>
    </span>`;
  }

  function starInputHTML() {
    return `<div class="star-input" id="starInput">
      ${[1, 2, 3, 4, 5]
        .map(
          (i) =>
            `<button type="button" class="s" data-v="${i}" aria-label="${i}점">★</button>`
        )
        .join("")}
    </div>`;
  }

  function bindStarInput(root, initialRating) {
    let picked = Number(initialRating) || 0;
    const stars = () => root.querySelectorAll("#starInput .s");
    const pickValue = (star) => {
      const value = Number(star.dataset.v);
      const half = value - 0.5;
      return picked === half ? value : half;
    };
    const paint = () => {
      stars().forEach((s) => {
        const value = Number(s.dataset.v);
        s.classList.toggle("on", value <= picked);
        s.classList.toggle("half", picked >= value - 0.5 && picked < value);
        s.setAttribute("aria-pressed", value <= Math.ceil(picked) ? "true" : "false");
      });
    };

    let lastPointerAt = 0;
    stars().forEach((s) => {
      const select = () => {
        picked = pickValue(s);
        paint();
      };
      s.addEventListener("pointerdown", (e) => {
        lastPointerAt = Date.now();
        select();
        e.preventDefault();
      });
      s.addEventListener("click", () => {
        if (Date.now() - lastPointerAt < 350) return;
        select();
      });
    });
    paint();
    return () => picked;
  }

  /* Image: read a file, downscale, return JPEG data URL via callback */
  function processImage(file, cb) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const max = 760;
        let w = img.width;
        let h = img.height;
        if (w > h && w > max) {
          h = Math.round((h * max) / w);
          w = max;
        } else if (h >= w && h > max) {
          w = Math.round((w * max) / h);
          h = max;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        cb(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function wineSnapshot(w) {
    if (!w) return null;
    return {
      id: w.id || "",
      status: w.status || "",
      name: w.name || "",
      country: w.country || "",
      type: w.type || "",
      vintage: w.vintage || "",
      price: w.price == null ? null : String(w.price),
      purchaseDate: w.purchaseDate || "",
      rating: w.rating == null ? null : Number(w.rating),
      drunkDate: w.drunkDate || "",
      note: w.note || "",
      hasPhoto: !!w.photo,
    };
  }

  const AUDIT_LABELS = {
    login: "로그인",
    logout: "로그아웃",
    create: "와인 등록",
    update: "와인 수정",
    markDrunk: "마신 기록",
    undoDrunk: "셀러로 되돌리기",
    delete: "와인 삭제",
  };

  const AUDIT_FIELD_LABELS = {
    status: "상태",
    name: "와인 이름",
    country: "국가",
    type: "종류",
    vintage: "빈티지",
    price: "구입 가격",
    purchaseDate: "구입일",
    rating: "별점",
    drunkDate: "마신 날",
    note: "시음 노트",
    hasPhoto: "사진",
  };

  function wineChanges(before, after) {
    if (!before || !after) return [];
    return Object.keys(AUDIT_FIELD_LABELS)
      .filter((field) => before[field] !== after[field])
      .map((field) => ({
        field,
        label: AUDIT_FIELD_LABELS[field],
        before: before[field] == null ? "" : before[field],
        after: after[field] == null ? "" : after[field],
      }));
  }

  function makeAuditLog(action, beforeWine, afterWine) {
    if (!currentUser) return null;
    const before = wineSnapshot(beforeWine);
    const after = wineSnapshot(afterWine);
    const changes = wineChanges(before, after);
    if (before && after && !changes.length) return null;
    const wine = after || before || {};
    return {
      action,
      actionLabel: AUDIT_LABELS[action] || action,
      actorUid: currentUser.uid,
      actorEmail: currentUser.email || "",
      wineId: wine.id || "",
      wineName: wine.name || "",
      before,
      after,
      changes,
      clientCreatedAt: new Date().toISOString(),
    };
  }

  function makeSessionAuditLog(action, user) {
    const actor = user || currentUser;
    if (!actor) return null;
    return {
      action,
      actionLabel: AUDIT_LABELS[action] || action,
      actorUid: actor.uid,
      actorEmail: actor.email || "",
      wineId: "",
      wineName: "",
      before: null,
      after: null,
      changes: [],
      clientCreatedAt: new Date().toISOString(),
    };
  }

  function shouldLogLogin(user) {
    try {
      if (sessionStorage.getItem(FIREBASE_LOGIN_SESSION_KEY) === user.uid) return false;
      sessionStorage.setItem(FIREBASE_LOGIN_SESSION_KEY, user.uid);
    } catch (e) {}
    return true;
  }

  function clearLoginAuditMarker() {
    try {
      sessionStorage.removeItem(FIREBASE_LOGIN_SESSION_KEY);
    } catch (e) {}
  }

  /* ---------- Cloud sync (Firebase Auth + Firestore) ---------- */
  function formatSyncTime() {
    return new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function setSyncStatus(status, message) {
    state.syncStatus = status;
    state.syncMessage = message || "";
    if (status === "synced") state.lastSyncedAt = formatSyncTime();
    updateSyncButton();
  }

  function updateSyncButton() {
    const btn = $("#syncBtn");
    const label = $("#syncText");
    if (!btn || !label) return;
    const status = currentUser ? state.syncStatus : "local";
    btn.className = `sync-pill sync-pill--${status}`;
    label.textContent =
      status === "syncing"
        ? "동기화"
        : status === "synced"
        ? "동기화됨"
        : status === "error"
        ? "오류"
        : "로컬";
    btn.title = state.syncMessage || (currentUser ? "Firebase 동기화" : "로그인 필요");
  }

  async function loadFirebase() {
    if (firebaseApi) return firebaseApi;
    const base = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}`;
    const [appMod, authMod, firestoreMod] = await Promise.all([
      import(`${base}/firebase-app.js`),
      import(`${base}/firebase-auth.js`),
      import(`${base}/firebase-firestore.js`),
    ]);
    const app = appMod.initializeApp(FIREBASE_CONFIG);
    auth = authMod.getAuth(app);
    db = firestoreMod.getFirestore(app);
    firebaseApi = {
      signInWithEmailAndPassword: authMod.signInWithEmailAndPassword,
      onAuthStateChanged: authMod.onAuthStateChanged,
      signOut: authMod.signOut,
      doc: firestoreMod.doc,
      collection: firestoreMod.collection,
      getDoc: firestoreMod.getDoc,
      setDoc: firestoreMod.setDoc,
      onSnapshot: firestoreMod.onSnapshot,
      serverTimestamp: firestoreMod.serverTimestamp,
      writeBatch: firestoreMod.writeBatch,
    };
    firebaseReady = true;
    return firebaseApi;
  }

  function cellarDocRef() {
    return firebaseApi.doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
  }

  function logsCollectionRef() {
    return firebaseApi.collection(
      db,
      FIRESTORE_COLLECTION,
      FIRESTORE_DOC_ID,
      FIRESTORE_LOGS_COLLECTION
    );
  }

  function queueSyncPush(delay) {
    if (!currentUser || !firebaseReady) {
      updateSyncButton();
      return;
    }
    if (syncDebounce) clearTimeout(syncDebounce);
    syncDebounce = setTimeout(() => {
      syncDebounce = null;
      syncPush();
    }, delay == null ? 350 : delay);
  }

  function handleSyncError(error) {
    const message = error && error.message ? error.message : "동기화에 실패했어요.";
    console.warn(message);
    setSyncStatus("error", message);
  }

  async function flushAuditLogs() {
    if (!pendingAuditLogs.length || !currentUser || !firebaseReady) return true;
    const logs = pendingAuditLogs.slice(0, 20);
    const batch = firebaseApi.writeBatch(db);
    logs.forEach((log) => {
      const ref = firebaseApi.doc(logsCollectionRef());
      batch.set(ref, Object.assign({}, log, { createdAt: firebaseApi.serverTimestamp() }));
    });
    try {
      await batch.commit();
      pendingAuditLogs.splice(0, logs.length);
      return true;
    } catch (error) {
      console.warn("행동 로그 저장 실패", error);
      return false;
    }
  }

  async function writeCloudWines() {
    if (!currentUser || !firebaseReady) return false;
    await firebaseApi.setDoc(
      cellarDocRef(),
      {
        version: 1,
        seedVersion: SEED_VERSION,
        updatedAt: firebaseApi.serverTimestamp(),
        updatedBy: currentUser.uid,
        wines: state.wines,
      },
      { merge: true }
    );
    await flushAuditLogs();
    return true;
  }

  async function syncPush() {
    if (!currentUser || !firebaseReady) return false;
    try {
      setSyncStatus("syncing", "Firebase에 저장하는 중");
      await writeCloudWines();
      setSyncStatus(
        "synced",
        pendingAuditLogs.length
          ? "와인은 저장됨, 로그 저장 권한 확인 필요"
          : "클라우드에 저장했어요."
      );
      return true;
    } catch (e) {
      handleSyncError(e);
      return false;
    }
  }

  async function signInToFirebase(email, password) {
    const api = await loadFirebase();
    const result = await api.signInWithEmailAndPassword(auth, email, password);
    try {
      localStorage.setItem(FIREBASE_EMAIL_KEY, email);
    } catch (e) {}
    return result.user;
  }

  async function signOutOfFirebase() {
    if (!auth || !firebaseApi) return;
    if (currentUser) {
      queueAuditLog(makeSessionAuditLog("logout", currentUser));
      await flushAuditLogs();
      clearLoginAuditMarker();
    }
    await firebaseApi.signOut(auth);
  }

  async function startCellarListener(user) {
    const api = await loadFirebase();
    if (unsubscribeCellar) unsubscribeCellar();
    unsubscribeCellar = api.onSnapshot(
      cellarDocRef(),
      (snapshot) => {
        if (!snapshot.exists()) {
          setSyncStatus("synced", "클라우드 데이터가 아직 없어요.");
          return;
        }
        const data = snapshot.data() || {};
        if (!Array.isArray(data.wines)) {
          setSyncStatus("error", "클라우드 데이터 형식이 올바르지 않아요.");
          return;
        }
        applyingRemote = true;
        state.wines = data.wines;
        if (!persistLocalOnly()) quotaAlert();
        applyingRemote = false;
        render();
        setSyncStatus("synced", "실시간 동기화 중");
      },
      (error) => {
        applyingRemote = false;
        handleSyncError(error);
      }
    );
    const snapshot = await api.getDoc(cellarDocRef());
    if (!snapshot.exists()) {
      setSyncStatus("synced", "클라우드 데이터가 아직 없어요.");
    }
  }

  function stopCellarListener() {
    if (unsubscribeCellar) unsubscribeCellar();
    unsubscribeCellar = null;
  }

  async function setupSync() {
    updateSyncButton();
    $("#syncBtn")?.addEventListener("click", openSyncSheet);
    try {
      await loadFirebase();
      firebaseApi.onAuthStateChanged(auth, async (user) => {
        currentUser = user || null;
        stopCellarListener();
        if (!user) {
          setSyncStatus("local", "");
          return;
        }
        setSyncStatus("syncing", "Firebase 연결 중");
        try {
          if (shouldLogLogin(user)) queueAuditLog(makeSessionAuditLog("login", user));
          await startCellarListener(user);
          if (pendingAuditLogs.length) {
            const logsOk = await flushAuditLogs();
            if (!logsOk) {
              setSyncStatus("synced", "실시간 동기화 중, 로그 저장 권한 확인 필요");
            }
          }
        } catch (e) {
          handleSyncError(e);
        }
      });
    } catch (e) {
      handleSyncError(e);
    }
  }

  /* ---------- Tabs ---------- */
  function setTab(tab) {
    state.tab = tab;
    state.typeFilter = "all";
    state.countryFilter = "all";
    state.filterPanel = null;
    state.searchOpen = false;
    state.searchQuery = "";
    document.querySelectorAll(".tab").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.tab === tab);
    });
    savePref();
    render();
  }

  function render() {
    if (state.tab === "cellar") renderCellar();
    else if (state.tab === "drunk") renderDrunk();
    else renderStats();
    $("#addBtn").hidden = state.tab === "stats";
    updateHeaderSub();
  }

  function markViewedCard() {
    view.querySelectorAll(".card[data-id]").forEach((card) => {
      card.classList.toggle("is-viewed", card.dataset.id === state.lastViewedId);
    });
  }

  function updateHeaderSub() {
    const cellar = state.wines.filter((w) => w.status === "cellar").length;
    const drunk = state.wines.filter((w) => w.status === "drunk").length;
    $("#headerSub").textContent = `보유 ${cellar}병 · 마심 ${drunk}병`;
  }

  /* ---------- Filtering + sorting ---------- */
  function sortArrow(key) {
    if (state.sortBy !== key) return "";
    return `<span class="chip__sort" aria-hidden="true">${
      state.sortDir === "asc" ? "&uarr;" : "&darr;"
    }</span>`;
  }

  function searchIconHTML() {
    return `<svg class="chip__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="10.5" cy="10.5" r="5.5"></circle>
      <path d="M15 15l4 4"></path>
    </svg>`;
  }

  function sortDefaultDir(key) {
    return key === "name" ? "asc" : "desc";
  }

  function sortOptionsFor(kind) {
    return kind === "drunk"
      ? [
          ["name", "이름순"],
          ["rating", "별점순"],
        ]
      : [
          ["name", "이름순"],
          ["price", "금액순"],
        ];
  }

  function normalizeSortForKind(kind) {
    const valid = sortOptionsFor(kind).map((o) => o[0]);
    if (valid.includes(state.sortBy)) return;
    state.sortBy = kind === "drunk" ? "rating" : "price";
    state.sortDir = sortDefaultDir(state.sortBy);
  }

  function countBy(wines, keyFn) {
    return wines.reduce((acc, w) => {
      const key = keyFn(w) || "all";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  function optionBaseWines(wines, skip) {
    return wines.filter((w) => {
      if (skip !== "type" && state.typeFilter !== "all" && w.type !== state.typeFilter) {
        return false;
      }
      if (
        skip !== "country" &&
        state.countryFilter !== "all" &&
        (w.country || "ETC") !== state.countryFilter
      ) {
        return false;
      }
      return true;
    });
  }

  function applyListFilters(wines) {
    const q = state.searchQuery.trim().toLocaleLowerCase("ko");
    return optionBaseWines(wines, null).filter((w) => {
      if (!q) return true;
      const country = countryOf(w.country);
      const haystack = [
        w.name,
        w.vintage,
        w.note,
        typeOf(w.type).label,
        country ? country.name : "",
      ]
        .join(" ")
        .toLocaleLowerCase("ko");
      return haystack.includes(q);
    });
  }

  function typeOptionsHTML(wines) {
    const base = optionBaseWines(wines, "type");
    const counts = countBy(base, (w) => w.type || "etc");
    const ids = Object.keys(counts).sort((a, b) => typeRank(a) - typeRank(b));
    return filterOptionButton("type", "all", "전체", state.typeFilter === "all", base.length)
      + ids
        .map((id) => {
          const t = typeOf(id);
          return filterOptionButton(
            "type",
            id,
            `${typeIconHTML(id, "option")}<span>${t.label}</span>`,
            state.typeFilter === id,
            counts[id]
          );
        })
        .join("");
  }

  function countryOptionsHTML(wines) {
    const base = optionBaseWines(wines, "country");
    const counts = countBy(base, (w) => w.country || "ETC");
    const codes = Object.keys(counts).sort((a, b) => {
      const ac = countryOf(a);
      const bc = countryOf(b);
      return (ac ? ac.name : "기타").localeCompare(bc ? bc.name : "기타", "ko");
    });
    return filterOptionButton("country", "all", "전체", state.countryFilter === "all", base.length)
      + codes
        .map((code) => {
          const c = countryOf(code);
          const label = `${flagBadge(code)}<span>${c ? esc(c.name) : "기타"}</span>`;
          return filterOptionButton(
            "country",
            code,
            label,
            state.countryFilter === code,
            counts[code]
          );
        })
        .join("");
  }

  function filterOptionButton(kind, value, labelHTML, active, count) {
    const attr = kind === "type" ? "data-type-filter" : "data-country-filter";
    return `<button class="filter-option ${active ? "is-active" : ""}" ${attr}="${esc(
      value
    )}">${labelHTML}<span class="filter-option__count">${count}</span></button>`;
  }

  function filterPanelHTML(wines) {
    if (!state.filterPanel) return "";
    const options =
      state.filterPanel === "type"
        ? typeOptionsHTML(wines)
        : countryOptionsHTML(wines);
    return `<div class="filter-options">${options}</div>`;
  }

  function searchPanelHTML() {
    if (!state.searchOpen && !state.searchQuery.trim()) return "";
    return `<div class="searchbar" role="search">
      <input class="searchbar__input" data-search-input type="search" value="${esc(
        state.searchQuery
      )}" placeholder="와인 이름 검색" autocomplete="off" />
      <button class="searchbar__clear" type="button" data-search-clear aria-label="검색어 지우기" ${
        state.searchQuery ? "" : "hidden"
      }>×</button>
    </div>`;
  }

  function listControlsHTML(wines, kind) {
    const activeType = state.typeFilter !== "all";
    const activeCountry = state.countryFilter !== "all";
    const activeSearch = !!state.searchQuery.trim();
    const typeLabel = activeType ? typeOf(state.typeFilter).label : "종류";
    const c = activeCountry ? countryOf(state.countryFilter) : null;
    const countryLabel = activeCountry ? (c ? c.name : "기타") : "국가";
    const sortButtons = sortOptionsFor(kind)
      .map(
        ([key, label]) => `<button class="chip ${
          state.sortBy === key ? "is-active" : ""
        }" data-sort="${key}">${label}${sortArrow(key)}</button>`
      )
      .join("");
    return `
      <div class="filterbar">
        <button class="chip ${
          !activeType && !activeCountry && !activeSearch ? "is-active" : ""
        }" data-filter-reset>전체</button>
        <button class="chip chip--search ${
          state.searchOpen || activeSearch ? "is-active" : ""
        }" data-search-toggle aria-label="와인 검색" aria-pressed="${
          state.searchOpen || activeSearch ? "true" : "false"
        }">${searchIconHTML()}</button>
        <button class="chip ${
          state.filterPanel === "type" || activeType ? "is-active" : ""
        }" data-filter-panel="type">${typeLabel}</button>
        <button class="chip ${
          state.filterPanel === "country" || activeCountry ? "is-active" : ""
        }" data-filter-panel="country">${countryLabel}</button>
        ${sortButtons}
      </div>
      ${searchPanelHTML()}
      ${filterPanelHTML(wines)}`;
  }

  function compareWineList(a, b) {
    const typeSort = typeRank(a.type) - typeRank(b.type);
    if (typeSort) return typeSort;
    const dir = state.sortDir === "asc" ? 1 : -1;
    if (state.sortBy === "price") {
      const ap = a.price == null || a.price === "" || isNaN(a.price) ? null : Number(a.price);
      const bp = b.price == null || b.price === "" || isNaN(b.price) ? null : Number(b.price);
      if (ap == null && bp == null) return a.name.localeCompare(b.name, "ko");
      if (ap == null) return 1;
      if (bp == null) return -1;
      return (ap - bp) * dir || a.name.localeCompare(b.name, "ko");
    }
    if (state.sortBy === "rating") {
      const ar = Number(a.rating) > 0 ? Number(a.rating) : null;
      const br = Number(b.rating) > 0 ? Number(b.rating) : null;
      if (ar == null && br == null) return a.name.localeCompare(b.name, "ko");
      if (ar == null) return 1;
      if (br == null) return -1;
      return (ar - br) * dir || a.name.localeCompare(b.name, "ko");
    }
    return a.name.localeCompare(b.name, "ko") * dir;
  }

  function listResultsHTML(wines, kind) {
    const filtered = applyListFilters(wines).sort(compareWineList);
    return filtered.length
      ? '<div class="list">' + filtered.map((w) => wineRow(w, kind)).join("") + "</div>"
      : `<div class="filtered-empty">조건에 맞는 와인이 없어요.</div>`;
  }

  function refreshListResults(wines, kind) {
    const results = $("#wineListResults", view);
    if (!results) return;
    results.innerHTML = listResultsHTML(wines, kind);
    bindCards();
  }

  /* shared list renderer for cellar / drunk tabs */
  function renderList(wines, kind) {
    normalizeSortForKind(kind);
    let html = listControlsHTML(wines, kind);
    html += `<div id="wineListResults">${listResultsHTML(wines, kind)}</div>`;
    view.innerHTML = html;
    bindListControls(wines, kind);
    bindCards();
  }

  function wineRow(w, kind) {
    const t = typeOf(w.type);
    const vint = w.vintage
      ? `<span class="card__vint">· ${esc(w.vintage)}</span>`
      : "";
    const typeMark = typeIconHTML(w.type);
    const viewed = w.id === state.lastViewedId ? " is-viewed" : "";
    const right =
      kind === "drunk"
        ? `<span class="card__rating">${starsHTML(w.rating || 0)}</span>`
        : `<span class="card__price">${won(w.price)}</span>`;
    return `
      <button class="card card--${kind}${viewed}" data-id="${w.id}">
        <span class="card__main">
          <span class="card__name-wrap">${flagBadge(
            w.country
          )}<span class="card__name-vintage"><span class="card__name">${esc(
            w.name
          )}</span>${vint}</span></span>
          <span class="card__right">${typeMark}${right}</span>
        </span>
      </button>`;
  }

  function bindListControls(wines, kind) {
    view.querySelector("[data-filter-reset]")?.addEventListener("click", () => {
      state.typeFilter = "all";
      state.countryFilter = "all";
      state.filterPanel = null;
      state.searchOpen = false;
      state.searchQuery = "";
      render();
    });
    view.querySelector("[data-search-toggle]")?.addEventListener("click", () => {
      state.searchOpen = !state.searchOpen;
      state.filterPanel = null;
      render();
      if (state.searchOpen) {
        requestAnimationFrame(() => {
          $("#view [data-search-input]")?.focus();
        });
      }
    });
    view.querySelector("[data-search-input]")?.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      const clear = view.querySelector("[data-search-clear]");
      if (clear) clear.hidden = !state.searchQuery.trim();
      refreshListResults(wines, kind);
    });
    view.querySelector("[data-search-clear]")?.addEventListener("click", () => {
      state.searchQuery = "";
      const clear = view.querySelector("[data-search-clear]");
      if (clear) clear.hidden = true;
      const input = view.querySelector("[data-search-input]");
      if (input) {
        input.value = "";
        input.focus();
      }
      refreshListResults(wines, kind);
    });
    view.querySelectorAll("[data-filter-panel]").forEach((b) => {
      b.addEventListener("click", () => {
        state.filterPanel =
          state.filterPanel === b.dataset.filterPanel ? null : b.dataset.filterPanel;
        render();
      });
    });
    view.querySelectorAll("[data-type-filter]").forEach((b) => {
      b.addEventListener("click", () => {
        state.typeFilter = b.dataset.typeFilter;
        state.filterPanel = null;
        render();
      });
    });
    view.querySelectorAll("[data-country-filter]").forEach((b) => {
      b.addEventListener("click", () => {
        state.countryFilter = b.dataset.countryFilter;
        state.filterPanel = null;
        render();
      });
    });
    view.querySelectorAll("[data-sort]").forEach((b) => {
      b.addEventListener("click", () => {
        if (state.sortBy === b.dataset.sort) {
          state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
        } else {
          state.sortBy = b.dataset.sort;
          state.sortDir = sortDefaultDir(state.sortBy);
        }
        savePref();
        render();
      });
    });
  }

  /* ---------- Cellar tab ---------- */
  function renderCellar() {
    const wines = state.wines
      .filter((w) => w.status === "cellar");
    if (!wines.length) {
      view.innerHTML = emptyState(
        "🍇",
        "셀러가 비어 있어요",
        "아래 ‘와인 추가’ 버튼으로 보유한 와인을 등록해 보세요."
      );
      return;
    }
    renderList(wines, "cellar");
  }

  /* ---------- Drunk tab ---------- */
  function renderDrunk() {
    const wines = state.wines
      .filter((w) => w.status === "drunk");
    if (!wines.length) {
      view.innerHTML = emptyState(
        "🍷",
        "아직 마신 와인이 없어요",
        "셀러에서 와인을 열고 ‘마셨어요’를 누르면 여기에 기록돼요."
      );
      return;
    }
    renderList(wines, "drunk");
  }

  /* ---------- Stats tab ---------- */
  function renderStats() {
    const cellar = state.wines.filter((w) => w.status === "cellar");
    const drunk = state.wines.filter((w) => w.status === "drunk");

    const cellarValue = cellar.reduce((s, w) => s + (Number(w.price) || 0), 0);
    const spentTotal = state.wines.reduce(
      (s, w) => s + (Number(w.price) || 0),
      0
    );
    const rated = drunk.filter((w) => w.rating);
    const hasRatings = rated.length > 0;
    const avg = hasRatings
      ? (rated.reduce((s, w) => s + w.rating, 0) / rated.length).toFixed(1)
      : null;
    const avgDisplay = hasRatings ? avg : "없음";
    const avgHint = hasRatings
      ? `${rated.length}개 기록 기준`
      : "마신 기록에서 별점을 남기면 표시돼요";

    // Favourite type by count among drunk
    const counts = {};
    drunk.forEach((w) => (counts[w.type] = (counts[w.type] || 0) + 1));
    let favType = "—";
    let favN = 0;
    Object.keys(counts).forEach((k) => {
      if (counts[k] > favN) {
        favN = counts[k];
        favType = typeOf(k).label;
      }
    });

    // Top rated wine
    let best = null;
    rated.forEach((w) => {
      if (!best || w.rating > best.rating) best = w;
    });
    const total = state.wines.length;
    const cellarPct = total ? Math.round((cellar.length / total) * 100) : 0;
    const drunkPct = total ? 100 - cellarPct : 0;
    const avgText = hasRatings ? `${avg}점 평균` : "별점 기록 없음";

    if (!state.wines.length) {
      view.innerHTML = emptyState(
        "📖",
        "기록이 없어요",
        "와인을 추가하면 컬렉션 통계가 여기에 모여요."
      );
      return;
    }

    view.innerHTML = `
      <section class="stats-hero">
        <div>
          <div class="stats-hero__label">전체 기록</div>
          <div class="stats-hero__num">${total}<span>병</span></div>
        </div>
        <div class="stats-hero__rating">
          ${starsHTML(hasRatings ? Number(avg) : 0)}
          <span>${avgText}</span>
        </div>
        <div class="stats-balance" aria-label="보유 ${cellar.length}병, 마심 ${drunk.length}병">
          <span class="stats-balance__cellar" style="width:${cellarPct}%"></span>
          <span class="stats-balance__drunk" style="width:${drunkPct}%"></span>
        </div>
        <div class="stats-hero__split">
          <span>보유 ${cellar.length}병</span>
          <span>마심 ${drunk.length}병</span>
        </div>
      </section>

      <div class="stat-grid">
        <div class="stat stat--wide stat--money">
          <div class="stat__icon">₩</div>
          <div class="stat__body">
            <div class="stat__label">셀러 보유 가치</div>
            <div class="stat__num">${won(cellarValue)}</div>
            <div class="stat__hint">지금 보유 중인 와인의 구입가 합계</div>
          </div>
        </div>
        <div class="stat">
          <div class="stat__icon">★</div>
          <div class="stat__body">
            <div class="stat__label">평균 별점</div>
            <div class="stat__num stat__num--text">${avgDisplay}</div>
            <div class="stat__hint">${avgHint}</div>
          </div>
        </div>
        <div class="stat">
          <div class="stat__icon">🍷</div>
          <div class="stat__body">
            <div class="stat__label">자주 마신 종류</div>
            <div class="stat__num stat__num--text">${favType}</div>
            <div class="stat__hint">${favN ? favN + "병" : "기록 없음"}</div>
          </div>
        </div>
        <div class="stat stat--wide stat--spent">
          <div class="stat__icon">Σ</div>
          <div class="stat__body">
            <div class="stat__label">총 구입 금액</div>
            <div class="stat__num">${won(spentTotal)}</div>
            <div class="stat__hint">마신 와인까지 포함한 누적 금액</div>
          </div>
        </div>
      </div>
      ${
        best
          ? `<section class="best-stat">
              <div class="best-stat__head">
                <span>최고 평점 와인</span>
                ${starsHTML(best.rating)}
              </div>
              <div class="best-stat__wine">
                ${flagBadge(best.country)}
                <span class="best-stat__name">${esc(best.name)}</span>
                ${
                  best.vintage
                    ? `<span class="best-stat__vintage">· ${esc(
                        best.vintage
                      )}</span>`
                    : ""
                }
              </div>
            </section>`
          : ""
      }`;
  }

  function emptyState(icon, title, text) {
    return `<div class="empty">
      <div class="empty__icon">${icon}</div>
      <h2 class="empty__title">${title}</h2>
      <p class="empty__text">${text}</p>
    </div>`;
  }

  /* ---------- Sheet (bottom modal) ---------- */
  let sheetOpen = false;
  let lockedScrollY = 0;

  function lockPageScroll() {
    if (document.body.classList.contains("is-sheet-locked")) return;
    lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.classList.add("is-sheet-locked");
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  }

  function unlockPageScroll() {
    if (!document.body.classList.contains("is-sheet-locked")) return;
    document.body.classList.remove("is-sheet-locked");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    window.scrollTo(0, lockedScrollY);
  }

  function openSheet(html) {
    lockPageScroll();
    sheet.innerHTML = '<div class="sheet__handle"></div>' + html;
    sheet.hidden = false;
    backdrop.hidden = false;
    void sheet.offsetWidth; // force reflow for transition
    requestAnimationFrame(() => {
      sheet.classList.add("is-open");
      backdrop.classList.add("is-open");
    });
    sheetOpen = true;
  }
  function closeSheet() {
    if (!sheetOpen) return;
    sheet.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    sheetOpen = false;
    unlockPageScroll();
    setTimeout(() => {
      sheet.hidden = true;
      backdrop.hidden = true;
      sheet.innerHTML = "";
    }, 260);
  }

  function quotaAlert() {
    alert(
      "저장 공간이 부족해요. 사진 용량이 큰 편이라면 일부 기록이나 사진을 지운 뒤 다시 시도해 주세요."
    );
  }

  function setSheetBusy(busy) {
    sheet.querySelectorAll("button, input").forEach((el) => {
      el.disabled = busy;
    });
  }

  function savedFirebaseEmail() {
    try {
      return localStorage.getItem(FIREBASE_EMAIL_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function openSyncSheet() {
    if (!currentUser) {
      openSheet(`
        <h2 class="sheet__title">Firebase 로그인</h2>
        <p class="sheet__subtitle">로그인하면 와인 목록이 실시간으로 공유돼요.</p>

        <form id="syncForm">
          <div class="sync-card">
            <div class="field">
              <label class="field__label">이메일</label>
              <input class="input" name="email" type="email" autocomplete="username" value="${esc(
                savedFirebaseEmail()
              )}" required />
            </div>
            <div class="field">
              <label class="field__label">비밀번호</label>
              <input class="input" name="password" type="password" autocomplete="current-password" required />
            </div>
            <div class="sync-note">비밀번호는 Firebase 로그인에만 사용되고 앱 코드에는 저장하지 않아요.</div>
          </div>

          <div class="btn-stack">
            <button type="button" class="btn btn--quiet" data-close>취소</button>
            <button type="submit" class="btn btn--dark">로그인</button>
          </div>
        </form>
      `);

      $("#syncForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;
        if (!email || !password) return;
        try {
          setSheetBusy(true);
          await signInToFirebase(email, password);
          closeSheet();
        } catch (error) {
          handleSyncError(error);
          setSheetBusy(false);
          alert("로그인에 실패했어요. 이메일과 비밀번호를 확인해 주세요.");
        }
      });
      return;
    }

    openSheet(`
      <h2 class="sheet__title">Firebase 동기화</h2>
      <p class="sheet__subtitle">${
        state.lastSyncedAt ? `마지막 동기화 ${state.lastSyncedAt}` : currentUser.email
      }</p>
      <div class="sync-card">
        <div class="sync-target">
          <span>${esc(currentUser.email || "Firebase 사용자")}</span>
          <span>${esc(FIRESTORE_COLLECTION)}/${esc(FIRESTORE_DOC_ID)}</span>
        </div>
        <div class="sync-note">${esc(
          state.syncMessage || "Firestore 실시간 동기화가 연결되어 있어요."
        )}</div>
      </div>
      <div class="btn-stack">
        <button type="button" class="btn btn--dark" data-sync-action="push">현재 기기 데이터 올리기</button>
        <button type="button" class="btn btn--quiet" data-sync-action="logout">로그아웃</button>
      </div>
    `);

    sheet.querySelectorAll("[data-sync-action]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const action = btn.dataset.syncAction;
        if (action === "logout") {
          if (confirm("이 기기에서 Firebase 로그아웃할까요?")) {
            await signOutOfFirebase();
            closeSheet();
          }
          return;
        }
        setSheetBusy(true);
        const ok = await syncPush();
        if (ok) closeSheet();
        else {
          setSheetBusy(false);
          alert(state.syncMessage || "동기화에 실패했어요.");
        }
      });
    });
  }

  /* ---------- Add / Edit form ---------- */
  function openForm(existing) {
    const w = existing || { type: "red", purchaseDate: today() };
    const isEdit = !!existing;
    const isDrunkEdit = isEdit && existing.status === "drunk";
    const selectedType = FORM_TYPE_IDS.includes(w.type) ? w.type : "red";
    let photo = (existing && existing.photo) || null;

    openSheet(`
      <h2 class="sheet__title">${
        isDrunkEdit ? "마신 와인 수정" : isEdit ? "와인 수정" : "와인 추가"
      }</h2>
      <p class="sheet__subtitle">${
        isDrunkEdit
          ? "기본 정보와 시음 기록을 함께 고칠 수 있어요."
          : isEdit
          ? "정보를 고쳐서 저장하세요."
          : "보유한 와인을 셀러에 등록해요."
      }</p>

      <form id="wineForm">
        <div class="form-section">
          <div class="form-section__title">와인 정보</div>
        <div class="field">
          <label class="field__label">와인 이름</label>
          <input class="input" name="name" placeholder="예: Château Margaux" value="${esc(
            w.name || ""
          )}" required />
        </div>

        <div class="field">
          <label class="field__label">와인 사진 <span class="opt">(선택 · 병 사진)</span></label>
          <label class="photo-drop" id="photoDrop"></label>
        </div>

        <div class="field">
          <label class="field__label">국가</label>
          <select class="select" name="country">
            <option value="">국가 선택</option>
            ${COUNTRIES.map(
              (c) =>
                `<option value="${c.code}" ${
                  w.country === c.code ? "selected" : ""
                }>${c.name}</option>`
            ).join("")}
          </select>
        </div>

        <div class="field">
          <label class="field__label">종류</label>
          <div class="choices" id="typeChoices">
            ${formTypes().map(
              (t) =>
                `<button type="button" class="choice ${
                  selectedType === t.id ? "is-active" : ""
                }" data-type="${t.id}">${formTypeLabel(t.id)}</button>`
            ).join("")}
          </div>
          <input type="hidden" name="type" value="${selectedType}" />
        </div>

        <div class="row-2">
          <div class="field">
            <label class="field__label">빈티지 <span class="opt">(선택)</span></label>
            <input class="input" name="vintage" inputmode="numeric" placeholder="예: 2018" value="${esc(
              w.vintage || ""
            )}" />
          </div>
          <div class="field">
            <label class="field__label">구입 가격 <span class="opt">(원)</span></label>
            <input class="input" name="price" inputmode="numeric" placeholder="예: 85000" value="${
              w.price != null ? esc(w.price) : ""
            }" />
          </div>
        </div>

        <div class="field">
          <label class="field__label">구입일</label>
          <input class="input" name="purchaseDate" type="date" value="${esc(
            w.purchaseDate || ""
          )}" />
        </div>
        </div>

        ${
          isDrunkEdit
            ? `<div class="form-section form-section--drink">
                <div class="form-section__title">시음 기록</div>
                <div class="field">
                  <label class="field__label">별점</label>
                  ${starInputHTML()}
                </div>

                <div class="field">
                  <label class="field__label">마신 날</label>
                  <input class="input" name="drunkDate" type="date" value="${esc(
                    w.drunkDate || ""
                  )}" />
                </div>

                <div class="field">
                  <label class="field__label">시음 노트 <span class="opt">(어땠는지 자유롭게)</span></label>
                  <textarea class="textarea textarea--note" name="note" placeholder="향, 맛, 함께한 음식, 분위기…">${esc(
                    w.note || ""
                  )}</textarea>
                </div>
              </div>`
            : ""
        }

        <div class="btn-stack">
          <button type="button" class="btn btn--quiet" data-close>취소</button>
          <button type="submit" class="btn btn--dark">${
            isEdit ? "저장" : "셀러에 추가"
          }</button>
        </div>
      </form>
    `);

    const getRating = isDrunkEdit
      ? bindStarInput(sheet, existing.rating || 0)
      : null;

    // ----- photo drop rendering / wiring -----
    function renderPhoto() {
      const drop = sheet.querySelector("#photoDrop");
      drop.classList.toggle("has-photo", !!photo);
      drop.innerHTML = photo
        ? `<input type="file" accept="image/*" capture="environment" id="photoInput" hidden />
           <img src="${photo}" alt="와인 사진" />
           <button type="button" class="photo-remove" id="photoRemove" aria-label="사진 삭제">✕</button>`
        : `<input type="file" accept="image/*" capture="environment" id="photoInput" hidden />
           <span>📷 와인 병 사진 찍기 / 선택</span>`;
      drop.querySelector("#photoInput").addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        processImage(file, (url) => {
          photo = url;
          renderPhoto();
        });
      });
      const rm = drop.querySelector("#photoRemove");
      if (rm)
        rm.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          photo = null;
          renderPhoto();
        });
    }
    renderPhoto();

    // ----- type picker -----
    sheet.querySelectorAll("[data-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sheet
          .querySelectorAll("[data-type]")
          .forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        sheet.querySelector('[name="type"]').value = btn.dataset.type;
      });
    });

    // ----- submit -----
    $("#wineForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const name = f.name.value.trim();
      if (!name) return;
      const data = {
        name,
        country: f.country.value,
        type: f.type.value,
        vintage: f.vintage.value.trim(),
        price: f.price.value.replace(/[^\d]/g, "") || null,
        purchaseDate: f.purchaseDate.value || (isEdit ? "" : today()),
        photo: photo || null,
      };
      if (isDrunkEdit) {
        data.rating = getRating();
        data.drunkDate = f.drunkDate.value || "";
        data.note = f.note.value.trim();
      }

      if (isEdit) {
        const backup = Object.assign({}, existing);
        Object.assign(existing, data);
        if (!persist(makeAuditLog("update", backup, existing))) {
          Object.assign(existing, backup);
          quotaAlert();
          return;
        }
      } else {
        const wine = Object.assign({ id: uid(), status: "cellar" }, data);
        state.wines.push(wine);
        if (!persist(makeAuditLog("create", null, wine))) {
          state.wines.pop();
          quotaAlert();
          return;
        }
        state.tab = "cellar";
        document.querySelectorAll(".tab").forEach((b) => {
          b.classList.toggle("is-active", b.dataset.tab === "cellar");
        });
      }
      closeSheet();
      render();
    });
  }

  /* ---------- Detail view ---------- */
  function openDetail(id) {
    const w = state.wines.find((x) => x.id === id);
    if (!w) return;
    const t = typeOf(w.type);
    const isDrunk = w.status === "drunk";
    const typeValue = `${typeIconHTML(w.type, "detail")}<span>${t.label}</span>`;
    const titleRow = isDrunk
      ? `<span class="detail__title-side detail__title-side--type">${typeValue}</span>
         <span class="detail__name">${esc(w.name)}</span>
         <span class="detail__title-side detail__title-side--vintage">${
           w.vintage ? esc(w.vintage) : ""
         }</span>`
      : `${flagBadge(w.country, true)}<span class="detail__name">${esc(
          w.name
        )}</span>`;

    const cells = [];
    if (isDrunk) {
      cells.push(cell("구입일", fmtDate(w.purchaseDate)));
      cells.push(cell("마신 날", fmtDate(w.drunkDate)));
      cells.push(cell("구입 가격", won(w.price)));
      const held = daysBetween(w.purchaseDate, w.drunkDate);
      cells.push(
        cell("보관 기간", held != null && held >= 0 ? held + "일" : "—")
      );
    } else {
      if (w.vintage) {
        cells.push(cell("종류", typeValue));
        cells.push(cell("빈티지", esc(w.vintage)));
      } else {
        cells.push(cell("종류", typeValue, true));
      }
      cells.push(cell("구입일", fmtDate(w.purchaseDate)));
      cells.push(cell("구입 가격", won(w.price)));
    }
    const grid = `<div class="dgrid ${
      isDrunk ? "dgrid--compact" : ""
    }">${cells.join("")}</div>`;

    openSheet(`
      ${
        isDrunk
          ? `<div class="detail__rating-top" aria-label="별점 ${
              w.rating || 0
            }점">${starsHTML(w.rating || 0)}</div>`
          : ""
      }
      ${w.photo ? `<img class="detail__photo" src="${w.photo}" alt="와인 사진" />` : ""}
      <div class="detail__head ${isDrunk ? "detail__head--compact" : ""}">
        <div class="detail__name-row ${
          isDrunk ? "detail__name-row--center" : ""
        }">${titleRow}</div>
      </div>

      ${grid}

      ${
        isDrunk && w.note
          ? `<div class="note-block note-block--focus">
               <div class="note-block__label">시음 노트</div>
               <div class="note-block__text">${esc(w.note)}</div>
             </div>`
          : ""
      }

      <div class="detail-actions">
        <div class="detail-actions__bar">
        ${
          isDrunk
            ? `<button class="detail-action detail-action--secondary" data-action="undo">셀러로 되돌리기</button>
               <button class="detail-action detail-action--primary" data-action="edit">수정</button>`
            : `<button class="detail-action detail-action--secondary" data-action="edit">수정</button>
               <button class="detail-action detail-action--primary" data-action="drink">🍷 마셨어요</button>`
        }
        </div>
        <button class="detail-actions__delete" data-action="delete">삭제</button>
      </div>
    `);

    sheet
      .querySelector('[data-action="drink"]')
      ?.addEventListener("click", () => {
        closeSheet();
        setTimeout(() => openDrinkForm(w), 280);
      });
    sheet.querySelector('[data-action="edit"]')?.addEventListener("click", () => {
      closeSheet();
      setTimeout(() => openForm(w), 280);
    });
    sheet.querySelector('[data-action="undo"]')?.addEventListener("click", () => {
      const backup = Object.assign({}, w);
      w.status = "cellar";
      delete w.rating;
      delete w.note;
      delete w.drunkDate;
      persist(makeAuditLog("undoDrunk", backup, w));
      closeSheet();
      render();
    });
    sheet
      .querySelector('[data-action="delete"]')
      ?.addEventListener("click", () => {
        if (confirm(`'${w.name}'을(를) 삭제할까요?`)) {
          const backup = Object.assign({}, w);
          state.wines = state.wines.filter((x) => x.id !== w.id);
          persist(makeAuditLog("delete", backup, null));
          closeSheet();
          render();
        }
      });
  }

  function cell(label, val, full) {
    return `<div class="dcell ${
      full ? "dcell--full" : ""
    }"><div class="dlabel">${label}</div><div class="dvalue">${val}</div></div>`;
  }

  /* ---------- Drink form (mark as drunk) ---------- */
  function openDrinkForm(w) {
    let picked = w.rating || 0;

    openSheet(`
      <h2 class="sheet__title">마신 기록</h2>
      <p class="sheet__subtitle">${esc(w.name)}, 어땠나요?</p>

      <form id="drinkForm">
        <div class="field">
          <label class="field__label">별점</label>
          ${starInputHTML()}
        </div>

        <div class="field">
          <label class="field__label">마신 날</label>
          <input class="input" name="drunkDate" type="date" value="${esc(
            w.drunkDate || today()
          )}" />
        </div>

        <div class="field">
          <label class="field__label">시음 노트 <span class="opt">(어땠는지 자유롭게)</span></label>
          <textarea class="textarea textarea--note" name="note" placeholder="향, 맛, 함께한 음식, 분위기…">${esc(
            w.note || ""
          )}</textarea>
        </div>

        <div class="btn-stack">
          <button type="button" class="btn btn--quiet" data-close>취소</button>
          <button type="submit" class="btn btn--dark">기록 저장</button>
        </div>
      </form>
    `);

    const getRating = bindStarInput(sheet, picked);

    $("#drinkForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const backup = Object.assign({}, w);
      w.status = "drunk";
      w.rating = getRating();
      w.drunkDate = f.drunkDate.value || today();
      w.note = f.note.value.trim();
      if (!persist(makeAuditLog("markDrunk", backup, w))) {
        Object.assign(w, backup);
        quotaAlert();
        return;
      }
      closeSheet();
      setTab("drunk");
    });
  }

  /* ---------- Wiring ---------- */
  function bindCards() {
    view.querySelectorAll(".card[data-id]").forEach((c) => {
      c.addEventListener("click", () => {
        state.lastViewedId = c.dataset.id;
        markViewedCard();
        openDetail(c.dataset.id);
      });
    });
  }

  document.querySelectorAll(".tab").forEach((b) => {
    b.addEventListener("click", () => setTab(b.dataset.tab));
  });
  $("#addBtn").addEventListener("click", () => openForm(null));
  backdrop.addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeSheet();
  });

  function setupPullToRefresh() {
    const indicator = document.createElement("div");
    indicator.className = "pull-refresh";
    indicator.setAttribute("aria-hidden", "true");
    indicator.innerHTML = '<span class="pull-refresh__ring"></span>';
    document.body.appendChild(indicator);

    const threshold = 82;
    const maxPull = 92;
    let startY = 0;
    let pull = 0;
    let tracking = false;
    let refreshing = false;

    const atTop = () => {
      const scroller = document.scrollingElement || document.documentElement;
      return window.scrollY <= 0 && scroller.scrollTop <= 0;
    };

    const setPull = (value, pulling = true) => {
      pull = value;
      document.documentElement.style.setProperty("--pull-refresh-y", `${value}px`);
      document.body.classList.toggle("is-pulling-refresh", pulling && value > 0);
      indicator.classList.toggle("is-ready", value >= threshold);
    };

    const resetPull = () => {
      pull = 0;
      document.documentElement.style.setProperty("--pull-refresh-y", "0px");
      document.body.classList.remove("is-pulling-refresh");
      indicator.classList.remove("is-ready");
    };

    document.addEventListener(
      "touchstart",
      (e) => {
        if (refreshing || sheetOpen || e.touches.length !== 1 || !atTop()) return;
        if (e.target.closest(".sheet")) return;
        tracking = true;
        startY = e.touches[0].clientY;
        pull = 0;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchmove",
      (e) => {
        if (!tracking || refreshing || e.touches.length !== 1) return;
        const delta = e.touches[0].clientY - startY;
        if (delta <= 0) {
          resetPull();
          return;
        }
        if (!atTop()) {
          resetPull();
          tracking = false;
          return;
        }
        if (delta > 6) {
          e.preventDefault();
          setPull(Math.min(maxPull, delta * 0.55));
        }
      },
      { passive: false }
    );

    const finishPull = () => {
      if (!tracking || refreshing) return;
      tracking = false;
      if (pull >= threshold) {
        refreshing = true;
        setPull(76, false);
        document.body.classList.add("is-refreshing");
        setTimeout(() => window.location.reload(), 240);
        return;
      }
      resetPull();
    };

    document.addEventListener("touchend", finishPull, { passive: true });
    document.addEventListener(
      "touchcancel",
      () => {
        tracking = false;
        if (!refreshing) resetPull();
      },
      { passive: true }
    );
  }

  /* ---------- Boot ---------- */
  load();
  render();
  setupSync();
  setupPullToRefresh();
})();
