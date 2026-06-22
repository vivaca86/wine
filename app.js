/* =========================================================
   와인 셀러 — app logic
   Vanilla JS + localStorage. No build step, no network.
   ========================================================= */

(function () {
  "use strict";

  const STORE_KEY = "wine-cellar-v1";

  /* Wine types: id, label, emoji swatch, dot color */
  const TYPES = [
    { id: "red", label: "레드", emoji: "🍷", color: "#7a2e35" },
    { id: "white", label: "화이트", emoji: "🥂", color: "#cbb56b" },
    { id: "rose", label: "로제", emoji: "🌸", color: "#d68a9a" },
    { id: "sparkling", label: "스파클링", emoji: "🍾", color: "#b59b5e" },
    { id: "dessert", label: "디저트", emoji: "🍯", color: "#a9743b" },
    { id: "etc", label: "기타", emoji: "🍇", color: "#6a5577" },
  ];

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
  const SEED_VERSION = "user-wine-list-2026-06-23-fr-champagne";
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
cellar	white	FR	프랑스	크리스탈	2012
cellar	white	FR	프랑스	크리스탈	2014
cellar	white	FR	프랑스	크리스탈	2015
cellar	white	FR	프랑스	자크셀로스 V.O
cellar	white	FR	프랑스	자크셀로스 V.O
cellar	white	FR	프랑스	크룩 170
cellar	white	FR	프랑스	크룩 170
cellar	white	FR	프랑스	크룩 171
cellar	white	FR	프랑스	크룩 171
cellar	white	FR	프랑스	크룩 171
cellar	white	FR	프랑스	크룩 172
cellar	white	FR	프랑스	돔페르뇽	2012
cellar	white	FR	프랑스	돔페르뇽	2013
cellar	white	FR	프랑스	돔페르뇽	2013
cellar	white	FR	프랑스	돔페르뇽	2013
drunk	white	FR	프랑스	돔페르뇽	2013
cellar	white	FR	프랑스	앙리지로 MV17
cellar	white	FR	프랑스	레어 08
drunk	white	FR	프랑스	떼땅져
drunk	white	FR	프랑스	떼땅져
cellar	white	FR	프랑스	떼땅져
drunk	white	FR	프랑스	떼땅져
drunk	white	FR	프랑스	필리조 에피스
cellar	white	FR	프랑스	뽀므리
drunk	white	FR	프랑스	플뢰리
drunk	white	FR	프랑스	파이퍼 하이직
cellar	white	FR	프랑스	파이퍼하이직	2014
drunk	white	FR	프랑스	폴로져
drunk	white	FR	프랑스	뵈브 끌레꼬
drunk	white	FR	프랑스	뵈브 끌레꼬
drunk	white	FR	프랑스	뵈브 끌레꼬
cellar	white	FR	프랑스	뵈브 끌레꼬 로제
drunk	white	FR	프랑스	빌까르 살몽 드미섹
cellar	white	FR	프랑스	볼랭져
drunk	white	FR	프랑스	멈 그랑 꼬르똥
drunk	white	FR	프랑스	페리에 주에
drunk	white	FR	프랑스	앙드레 끌루에
drunk	white	FR	프랑스	도츠
drunk	white			게뷔르츠트라미너 그로씨 로에	2011
cellar	white			휘겔 게뷔리츠트라미너
drunk	white			스모켓 리슬링
drunk	white			맨패밀리 슈냉블랑
drunk	white			군트럼 카비넷
drunk	white			도스코파스
drunk	white			브레이크 포인트 소비뇽블랑
drunk	white			브레이크 포인트 소비뇽블랑
drunk	white			래빗 아일랜드 소비뇽블랑
drunk	white			베비치 블랙 소비뇽블랑
cellar	white			더 패스 소비뇽블랑
cellar	white			셀락 오리진 소비뇽블랑
cellar	white			셀락 오리진 소비뇽블랑
drunk	white			마르쿠스 몰리터 젤팅거 아우스레제	2018
cellar	white			로버트 바일 리슬링	2021
drunk	white			로버트 바일 리슬링	2021
drunk	white			로버트 바일 리슬링	2021
drunk	white			로버트 바일 리슬링	2021
drunk	white			로버트 바일 리슬링 스파클링
drunk	white			루이자도 샤블리	2021
drunk	white			샤블리 생마르땡	2021
drunk	white			바이용 샤블리 1CRU	2018
cellar	white			조셉드루앙 샤블리 1CRU	2018
drunk	white			메종 니꼴라 뽀뗄 샤블리 1er 발롱
drunk	white			샤블리. 15000원 뽑기로 뽑은거
drunk	white			로얄토카이
drunk	white			로얄 토카이 블루라벨
cellar	white			로얄 토카이 블루라벨
cellar	white			샤또 꾸떼	2016
cellar	white			샤또 꾸떼	2016
cellar	white			샤또 기로	2016
drunk	white			클라우디베이	2021
drunk	white			클라우디베이	2022
drunk	white			클라우디베이	2022
drunk	white			클라우디베이	2022
drunk	white			클라우디베이	2023
cellar	white			클라우디베이	2024
drunk	white			클라우디베이	2024
drunk	white			오이스터베이
drunk	white			도그포인트	2018
drunk	white			도그포인트	2020
drunk	white			도그포인트	2021
drunk	white			화이트헤븐	2021
drunk	white			머드하우스	2021
drunk	white			펄리셔	2022
drunk	white			인비보	2022
drunk	white			토후	2022
drunk	white			시라꼬	2021
cellar	white			브리꼬 꽐리아	2021
drunk	white			브리꼬 꽐리아	2022
drunk	white			브리꼬 꽐리아	2022`;

  /* ---------- State ---------- */
  let state = { wines: [], tab: "cellar", groupBy: "none" };

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

    state.wines = seedWines();
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
      if (pref.groupBy) state.groupBy = pref.groupBy;
    } catch (e) {
      state.wines = seedWines();
    }
  }
  function savePref() {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify({ groupBy: state.groupBy }));
    } catch (e) {}
  }
  /* Persist; returns false if storage quota is exceeded. */
  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state.wines));
      return true;
    } catch (e) {
      return false;
    }
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

  function starInputHTML() {
    return `<div class="star-input" id="starInput">
      ${[1, 2, 3, 4, 5]
        .map((i) => `<span class="s" data-v="${i}">★</span>`)
        .join("")}
    </div>`;
  }

  function bindStarInput(root, initialRating) {
    let picked = Number(initialRating) || 0;
    const paint = () => {
      root.querySelectorAll("#starInput .s").forEach((s) => {
        const value = Number(s.dataset.v);
        s.classList.toggle("on", value <= picked);
        s.classList.toggle("half", picked >= value - 0.5 && picked < value);
      });
    };

    root.querySelectorAll("#starInput .s").forEach((s) => {
      s.addEventListener("click", (e) => {
        const value = Number(s.dataset.v);
        const rect = s.getBoundingClientRect();
        const isHalf = e.clientX - rect.left < rect.width / 2;
        picked = isHalf ? value - 0.5 : value;
        paint();
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

  /* ---------- Tabs ---------- */
  function setTab(tab) {
    state.tab = tab;
    document.querySelectorAll(".tab").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.tab === tab);
    });
    render();
  }

  function render() {
    if (state.tab === "cellar") renderCellar();
    else if (state.tab === "drunk") renderDrunk();
    else renderStats();
    $("#addBtn").hidden = state.tab === "stats";
    updateHeaderSub();
  }

  function updateHeaderSub() {
    const cellar = state.wines.filter((w) => w.status === "cellar").length;
    const drunk = state.wines.filter((w) => w.status === "drunk").length;
    $("#headerSub").textContent = `보유 ${cellar}병 · 마심 ${drunk}병`;
  }

  /* ---------- Grouping ---------- */
  function groupWines(wines, by) {
    if (by === "none") return [{ key: null, wines: wines }];
    const map = {};
    wines.forEach((w) => {
      const k = by === "type" ? w.type || "etc" : w.country || "ETC";
      (map[k] = map[k] || []).push(w);
    });
    return Object.keys(map)
      .sort((a, b) => map[b].length - map[a].length || a.localeCompare(b))
      .map((k) => ({
        key: k,
        by: by,
        wines: map[k].slice().sort((x, y) => x.name.localeCompare(y.name, "ko")),
      }));
  }

  function groupBarHTML() {
    const opts = [
      ["none", "전체"],
      ["type", "종류별"],
      ["country", "국가별"],
    ];
    return `<div class="groupbar">${opts
      .map(
        (o) =>
          `<button class="chip ${
            state.groupBy === o[0] ? "is-active" : ""
          }" data-group="${o[0]}">${o[1]}</button>`
      )
      .join("")}</div>`;
  }

  function groupHeaderHTML(g) {
    if (g.by === "type") {
      const t = typeOf(g.key);
      return `<div class="group-h"><span class="group-h__left"><span class="dot" style="background:${t.color}"></span>${t.label}</span><span class="group-h__n">${g.wines.length}</span></div>`;
    }
    const c = countryOf(g.key);
    return `<div class="group-h"><span class="group-h__left">${flagBadge(
      g.key
    )}${c ? esc(c.name) : "기타"}</span><span class="group-h__n">${
      g.wines.length
    }</span></div>`;
  }

  /* shared list renderer for cellar / drunk tabs */
  function renderList(wines, kind) {
    const groups = groupWines(wines, state.groupBy);
    let html = groupBarHTML();
    groups.forEach((g) => {
      if (g.key !== null) html += groupHeaderHTML(g);
      html +=
        '<div class="list">' +
        g.wines.map((w) => wineRow(w, kind)).join("") +
        "</div>";
    });
    view.innerHTML = html;
    bindGroupBar();
    bindCards();
  }

  function wineRow(w, kind) {
    const t = typeOf(w.type);
    const vint = w.vintage
      ? `<span class="card__vint">· ${esc(w.vintage)}</span>`
      : "";
    const dot =
      kind !== "drunk" && state.groupBy === "type"
        ? ""
        : `<span class="type-dot" style="background:${t.color}" title="${t.label}"></span>`;
    const right =
      kind === "drunk"
        ? `<span class="card__rating">${starsHTML(w.rating || 0)}</span>`
        : `<span class="card__price">${won(w.price)}</span>`;
    return `
      <button class="card card--${kind}" data-id="${w.id}">
        <span class="card__main">
          <span class="card__name-wrap">${flagBadge(
            w.country
          )}<span class="card__name-vintage"><span class="card__name">${esc(
            w.name
          )}</span>${vint}</span></span>
          <span class="card__right">${dot}${right}</span>
        </span>
      </button>`;
  }

  function bindGroupBar() {
    view.querySelectorAll(".chip[data-group]").forEach((b) => {
      b.addEventListener("click", () => {
        state.groupBy = b.dataset.group;
        savePref();
        render();
      });
    });
  }

  /* ---------- Cellar tab ---------- */
  function renderCellar() {
    const wines = state.wines
      .filter((w) => w.status === "cellar")
      .sort((a, b) =>
        (b.purchaseDate || "").localeCompare(a.purchaseDate || "")
      );
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
      .filter((w) => w.status === "drunk")
      .sort((a, b) => (b.drunkDate || "").localeCompare(a.drunkDate || ""));
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
    const avg = rated.length
      ? (rated.reduce((s, w) => s + w.rating, 0) / rated.length).toFixed(1)
      : "—";

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
    const avgText = avg === "—" ? "아직 별점 없음" : `${avg}점 평균`;

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
          ${starsHTML(avg === "—" ? 0 : Number(avg))}
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
            <div class="stat__num">${avg}</div>
            <div class="stat__hint">${rated.length}개 기록 기준</div>
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
  function openSheet(html) {
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

  /* ---------- Add / Edit form ---------- */
  function openForm(existing) {
    const w = existing || { type: "red", purchaseDate: today() };
    const isEdit = !!existing;
    const isDrunkEdit = isEdit && existing.status === "drunk";
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
            ${TYPES.map(
              (t) =>
                `<button type="button" class="choice ${
                  w.type === t.id ? "is-active" : ""
                }" data-type="${t.id}">${t.emoji} ${t.label}</button>`
            ).join("")}
          </div>
          <input type="hidden" name="type" value="${w.type || "red"}" />
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
            w.purchaseDate || today()
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
                    w.drunkDate || today()
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
          <button type="submit" class="btn btn--dark">${
            isEdit ? "저장" : "셀러에 추가"
          }</button>
          <button type="button" class="btn btn--quiet" data-close>취소</button>
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
        purchaseDate: f.purchaseDate.value || today(),
        photo: photo || null,
      };
      if (isDrunkEdit) {
        data.rating = getRating();
        data.drunkDate = f.drunkDate.value || today();
        data.note = f.note.value.trim();
      }

      if (isEdit) {
        const backup = Object.assign({}, existing);
        Object.assign(existing, data);
        if (!persist()) {
          Object.assign(existing, backup);
          quotaAlert();
          return;
        }
      } else {
        const wine = Object.assign({ id: uid(), status: "cellar" }, data);
        state.wines.push(wine);
        if (!persist()) {
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
    const titleRow = isDrunk
      ? `<span class="detail__title-side detail__title-side--type">${t.emoji} ${t.label}</span>
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
        cells.push(cell("종류", `${t.emoji} ${t.label}`));
        cells.push(cell("빈티지", esc(w.vintage)));
      } else {
        cells.push(cell("종류", `${t.emoji} ${t.label}`, true));
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
            ? `<button class="detail-action detail-action--primary" data-action="edit">수정</button>
               <button class="detail-action detail-action--secondary" data-action="undo">셀러로 되돌리기</button>`
            : `<button class="detail-action detail-action--primary" data-action="drink">🍷 마셨어요</button>
               <button class="detail-action detail-action--secondary" data-action="edit">수정</button>`
        }
        </div>
        <button class="detail-actions__delete" data-action="delete">삭제</button>
      </div>
    `);

    sheet
      .querySelector('[data-action="drink"]')
      ?.addEventListener("click", () => openDrinkForm(w));
    sheet.querySelector('[data-action="edit"]')?.addEventListener("click", () => {
      closeSheet();
      setTimeout(() => openForm(w), 280);
    });
    sheet.querySelector('[data-action="undo"]')?.addEventListener("click", () => {
      w.status = "cellar";
      delete w.rating;
      delete w.note;
      delete w.drunkDate;
      persist();
      closeSheet();
      render();
    });
    sheet
      .querySelector('[data-action="delete"]')
      ?.addEventListener("click", () => {
        if (confirm(`'${w.name}'을(를) 삭제할까요?`)) {
          state.wines = state.wines.filter((x) => x.id !== w.id);
          persist();
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
          <button type="submit" class="btn btn--dark">기록 저장</button>
          <button type="button" class="btn btn--quiet" data-close>취소</button>
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
      if (!persist()) {
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
      c.addEventListener("click", () => openDetail(c.dataset.id));
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

  /* ---------- Boot ---------- */
  load();
  render();
})();
