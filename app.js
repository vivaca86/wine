/* =========================================================
   와인 셀러 — app logic
   Vanilla JS + localStorage. No build step, no network.
   ========================================================= */

(function () {
  "use strict";

  const STORE_KEY = "wine-cellar-v1";
  const DELETED_SEEDS_KEY = "wine-cellar-deleted-seeds-v1";
  const LOCAL_SYNC_BACKUP_KEY = "wine-cellar-pre-sync-backup-v1";
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
  const FIREBASE_FUNCTIONS_REGION = "asia-northeast3";
  const FIRESTORE_COLLECTION = "cellars";
  const FIRESTORE_DOC_ID = "main";
  const FIRESTORE_LOGS_COLLECTION = "logs";
  // Keep headroom for Firestore field names and document metadata (hard limit: 1 MiB).
  const FIRESTORE_SAFE_MAX_BYTES = 900 * 1024;

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
  const FORM_TYPE_IDS = ["red", "white", "rose", "sparkling", "dessert", "etc"];
  const TASTERS = [
    { id: "me", label: "심", short: "심", className: "me" },
    { id: "partner", label: "꽁", short: "꽁", className: "partner" },
  ];
  const TASTING_STATUS = {
    DRUNK: "drunk",
    SKIPPED: "skipped",
    UNKNOWN: "unknown",
  };

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
  const SEED_VERSION = "user-wine-list-2026-06-29-english-wine-names";
  const TAB_ORDER = ["cellar", "drunk", "stats"];
  const TAB_SWIPE_NEXT_MIN_X = 36;
  const TAB_SWIPE_PREV_MIN_X = 28;
  const TAB_SWIPE_NEXT_FLICK_MIN_X = 24;
  const TAB_SWIPE_PREV_FLICK_MIN_X = 18;
  const TAB_SWIPE_NEXT_VELOCITY = 0.3;
  const TAB_SWIPE_PREV_VELOCITY = 0.24;
  const TAB_SWIPE_NEXT_LOCK_RATIO = 0.78;
  const TAB_SWIPE_PREV_LOCK_RATIO = 0.58;
  const TAB_SWIPE_NEXT_FINISH_RATIO = 0.78;
  const TAB_SWIPE_PREV_FINISH_RATIO = 0.58;
  const TAB_SWIPE_VERTICAL_CANCEL_Y = 34;
  const TAB_SWIPE_NEXT_VERTICAL_CANCEL_RATIO = 1.55;
  const TAB_SWIPE_PREV_VERTICAL_CANCEL_RATIO = 1.9;
  const TAB_SWIPE_EDGE_MAX = 54;
  const TAB_TRANSITION_MS = 280;
  const SEED_TSV = `status	type	country_code	country_name	name	vintage
cellar	red	FR	프랑스	프리에르 로크, 르 끌라우드	2019
cellar	red	FR	프랑스	Moillard Gevrey-Chambertin	2018
cellar	red	FR	프랑스	알렉스 감발 제브리 샹베르땅	2019
drunk	red	FR	프랑스	앙또네 귀용 알렉스 꼬르동 1CRU 레 푸르니에	2017
cellar	red	FR	프랑스	죠셉 드루앵 제브리 샹베르땅	2017
cellar	red	FR	프랑스	루이 라투르 제브리 샹베르땅	2018
cellar	red	FR	프랑스	Barolet Pernot Pere & Fils Beaune Teurons 1er Cru	2020
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
drunk	red	FR	프랑스	Charles Aine & Fils Cotes du Rhone	2023
drunk	red	US	미국	패너 애쉬	2018
drunk	red	US	미국	Decoy Cabernet Sauvignon	2019
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
drunk	red	AR	아르헨티나	이스까이 시라 비오니에	2019
drunk	red	AR	아르헨티나	이스까이	2020
drunk	red	AR	아르헨티나	이스까이	2020
drunk	red	AR	아르헨티나	이스까이	2020
cellar	red	CL	칠레	세냐	2017
cellar	red	CL	칠레	세냐	2020
cellar	red	CL	칠레	돈 멜쵸	2020
cellar	red	IT	이탈리아	사시까이아	2019
cellar	red	IT	이탈리아	라 스피네따 바르바레스코 스타데리	2014
drunk	red	NZ	뉴질랜드	클라우디베이 피노누아	2018
drunk	red	ZA	남아공	맨패밀리 피노타쥐
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
cellar	sparkling	FR	프랑스	앙리 지로 퓌드센 MV17
cellar	sparkling	FR	프랑스	레어 08
drunk	sparkling	FR	프랑스	떼땅져
drunk	sparkling	FR	프랑스	떼땅져
cellar	sparkling	FR	프랑스	떼땅져
drunk	sparkling	FR	프랑스	떼땅져
drunk	sparkling	FR	프랑스	필리조 에 피스 누메로 3 브뤼
cellar	sparkling	FR	프랑스	뽀므리
drunk	sparkling	FR	프랑스	플뢰리
drunk	sparkling	FR	프랑스	파이퍼 하이직 퀴베 브뤼
cellar	sparkling	FR	프랑스	파이퍼 하이직 빈티지	2014
drunk	sparkling	FR	프랑스	폴로져
drunk	sparkling	FR	프랑스	뵈브 끌레꼬
drunk	sparkling	FR	프랑스	뵈브 끌레꼬
drunk	sparkling	FR	프랑스	뵈브 끌레꼬
cellar	sparkling	FR	프랑스	뵈브 끌레꼬 로제
drunk	sparkling	FR	프랑스	빌까르 살몽 드미섹
cellar	sparkling	FR	프랑스	볼랭져
drunk	sparkling	FR	프랑스	멈 그랑 꼬르동
drunk	sparkling	FR	프랑스	페리에 주에
drunk	sparkling	FR	프랑스	앙드레 끌루에
drunk	sparkling	FR	프랑스	도츠 브뤼 클래식
drunk	white	FR	프랑스	게뷔르츠트라미너 그로씨 로에	2011
cellar	white	FR	프랑스	휘겔 게뷔리츠트라미너
drunk	white	DE	독일	스모캣 리슬링
drunk	white	ZA	남아공	맨패밀리 슈냉블랑
drunk	white	DE	독일	군트럼 카비넷
drunk	white	CL	칠레	Dos Copas Sauvignon Blanc	2023
drunk	white	NZ	뉴질랜드	Break Point Sauvignon Blanc Marlborough
drunk	white	NZ	뉴질랜드	Break Point Sauvignon Blanc Marlborough
drunk	white	NZ	뉴질랜드	래빗 아일랜드 소비뇽 블랑
drunk	white	NZ	뉴질랜드	베비치 블랙 라벨 소비뇽 블랑
cellar	white	NZ	뉴질랜드	더 패스 소비뇽 블랑
cellar	white	NZ	뉴질랜드	셀락 오리진 소비뇽 블랑
cellar	white	NZ	뉴질랜드	셀락 오리진 소비뇽 블랑
drunk	white	DE	독일	마르쿠스 몰리터 젤팅거 아우스레제	2018
cellar	white	DE	독일	로버트 바일 리슬링	2021
drunk	white	DE	독일	로버트 바일 리슬링	2021
drunk	white	DE	독일	로버트 바일 리슬링	2021
drunk	white	DE	독일	로버트 바일 리슬링	2021
drunk	white	DE	독일	로버트 바일 리슬링 스파클링
drunk	white	FR	프랑스	루이자도 샤블리	2021
drunk	white	FR	프랑스	Domaine Laroche Saint Martin Chablis	2021
drunk	white	FR	프랑스	La Chablisienne Chablis 1er Cru Vaillons	2018
cellar	white	FR	프랑스	Joseph Drouhin Chablis Premier Cru Vaillons	2018
drunk	white	FR	프랑스	Nicolas Potel Chablis 1er Cru Vaillons	2019
drunk	white	FR	프랑스	샤블리 15000원 확인불가
drunk	white	HU	헝가리	로얄 토카이 드라이 푸르민트
drunk	white	HU	헝가리	로얄 토카이 블루라벨
cellar	white	HU	헝가리	로얄 토카이 블루라벨
cellar	white	FR	프랑스	샤또 꾸떼	2016
cellar	white	FR	프랑스	샤또 꾸떼	2016
cellar	white	FR	프랑스	샤또 기로	2016
drunk	white	NZ	뉴질랜드	클라우디베이 소비뇽 블랑	2021
drunk	white	NZ	뉴질랜드	클라우디베이 소비뇽 블랑	2022
drunk	white	NZ	뉴질랜드	클라우디베이 소비뇽 블랑	2022
drunk	white	NZ	뉴질랜드	클라우디베이 소비뇽 블랑	2022
drunk	white	NZ	뉴질랜드	클라우디베이 소비뇽 블랑	2023
cellar	white	NZ	뉴질랜드	클라우디베이 소비뇽 블랑	2024
drunk	white	NZ	뉴질랜드	클라우디베이 소비뇽 블랑	2024
drunk	white	NZ	뉴질랜드	오이스터 베이 소비뇽 블랑
drunk	white	NZ	뉴질랜드	도그포인트 소비뇽 블랑	2018
drunk	white	NZ	뉴질랜드	도그포인트 소비뇽 블랑	2020
drunk	white	NZ	뉴질랜드	도그포인트 소비뇽 블랑	2021
drunk	white	NZ	뉴질랜드	화이트헤븐	2021
drunk	white	NZ	뉴질랜드	머드하우스 소비뇽 블랑	2021
drunk	white	NZ	뉴질랜드	펄리셔 소비뇽 블랑	2022
drunk	white	NZ	뉴질랜드	인비보 소비뇽 블랑	2022
drunk	white	NZ	뉴질랜드	토후 소비뇽 블랑	2022
drunk	white	IT	이탈리아	시라꼬	2021
cellar	white	IT	이탈리아	브리꼬 꽐리아	2021
drunk	white	IT	이탈리아	브리꼬 꽐리아	2022
drunk	white	IT	이탈리아	브리꼬 꽐리아	2022
drunk	white	FR	프랑스	Cattin Orange Pinot Gris
drunk	red	US	미국	브레드 앤 버터 피노 누아
drunk	red	CL	칠레	몬테스 클래식 시리즈 카베르네 소비뇽
drunk	red	IT	이탈리아	브라이다 일 바치알레
drunk	red	FR	프랑스	루이 자도 부르고뉴 피노 누아
drunk	red	AU	호주	Ceravolo Petit Verdot	2019
drunk	white	DE	독일	조머 리슬링 트로켄
drunk	red	FR	프랑스	기갈 지공다스
drunk	red	FR	프랑스	도멘 페블리 마르사네
drunk	red	ES	스페인	옥세르 바스테기에타 칼라미티 리오하
drunk	sparkling	FR	프랑스	찰스하이직 브뤼 레제르브
drunk	sparkling	FR	프랑스	클레망 페르스발 레 루로 블랑 드 블랑
drunk	sparkling	FR	프랑스	클레망 페르스발 르 뤼트 블랑 드 누아
drunk	red	FR	프랑스	마르크 소야르 크라 부르고뉴	2022
drunk	sparkling	FR	프랑스	마리 노엘 르드뤼 퀴베 뒤 굴테 그랑 크뤼
drunk	white	NZ	뉴질랜드	머드하우스 소비뇽 블랑
drunk	white	NZ	뉴질랜드	머드하우스 소비뇽 블랑
drunk	white	NZ	뉴질랜드	코노 소비뇽 블랑
drunk	white	NZ	뉴질랜드	코노 소비뇽 블랑
drunk	white	NZ	뉴질랜드	코노 소비뇽 블랑
drunk	white	NZ	뉴질랜드	베비치 블랙 라벨 소비뇽 블랑
drunk	white	NZ	뉴질랜드	베비치 블랙 라벨 소비뇽 블랑
drunk	white	NZ	뉴질랜드	킴 크로포드 소비뇽 블랑
drunk	white	NZ	뉴질랜드	킴 크로포드 소비뇽 블랑
drunk	white	NZ	뉴질랜드	오이스터 베이 소비뇽 블랑
drunk	white	NZ	뉴질랜드	오이스터 베이 소비뇽 블랑
drunk	white	NZ	뉴질랜드	펄리셔 소비뇽 블랑
drunk	white	NZ	뉴질랜드	펄리셔 소비뇽 블랑
drunk	sparkling	FR	프랑스	페리에 주에
drunk	sparkling	FR	프랑스	파이퍼 하이직 퀴베 브뤼
drunk	sparkling	FR	프랑스	파이퍼 하이직 퀴베 브뤼
drunk	sparkling	FR	프랑스	파이퍼 하이직 퀴베 브뤼
drunk	sparkling	FR	프랑스	도츠 브뤼 클래식`;
  const VARIETY_BY_WINE_NAME = {
    "프리에르 로크, 르 끌라우드": "피노 누아",
    "Moillard Gevrey-Chambertin": "피노 누아",
    "알렉스 감발 제브리 샹베르땅": "피노 누아",
    "앙또네 귀용 알렉스 꼬르동 1CRU 레 푸르니에": "피노 누아",
    "죠셉 드루앵 제브리 샹베르땅": "피노 누아",
    "루이 라투르 제브리 샹베르땅": "피노 누아",
    "Barolet Pernot Pere & Fils Beaune Teurons 1er Cru": "피노 누아",
    "A.F. GROS 브르고뉴": "피노 누아",
    "샤또 딸보": "카베르네 소비뇽, 메를로, 쁘띠 베르도",
    "샤또 딸보 하프보틀": "카베르네 소비뇽, 메를로, 쁘띠 베르도",
    "꼬네따블 딸보": "카베르네 소비뇽, 메를로, 쁘띠 베르도",
    "부샤 제브리 샹베르땅": "피노 누아",
    "부샤 뽀마르": "피노 누아",
    "앙또네 귀용 꼬르똥 브레상드 그랑크뤼": "피노 누아",
    "앙또네 귀용 꼬뜨 드본 빌라쥐": "피노 누아",
    "샤또 르 퓌 에밀리앙": "메를로, 카베르네 프랑, 카베르네 소비뇽, 말벡, 카르메네르",
    "죠셉 드루앵 라포레 브르고뉴": "피노 누아",
    "필립 리베라 꼬뜨 드 뉘 빌라쥬": "피노 누아",
    "샤또 레오빌 라즈까즈": "카베르네 소비뇽, 메를로, 카베르네 프랑, 쁘띠 베르도",
    "Charles Aine & Fils Cotes du Rhone": "그르나슈, 시라, 무르베드르",
    "패너 애쉬": "피노 누아",
    "Decoy Cabernet Sauvignon": "카베르네 소비뇽",
    "덕혼 디코이": "카베르네 소비뇽",
    "덕혼 디코이 멜롯": "메를로",
    "칼레라 피노누아": "피노 누아",
    "텍스트북": "카베르네 소비뇽",
    "오퍼스원": "카베르네 소비뇽, 쁘띠 베르도, 메를로, 카베르네 프랑, 말벡",
    "오버츄어": "카베르네 소비뇽, 메를로, 쁘띠 베르도, 카베르네 프랑, 말벡",
    "힐트": "피노 누아",
    "투핸즈 벨라스 가든": "시라즈",
    "투핸즈 릴리스 가든": "시라즈",
    "투핸즈 찰리스 가든": "시라즈",
    "킬리카눈 오라클": "시라즈",
    "블루 아이드 보이": "시라즈",
    "더 복서": "시라즈",
    "이스까이 시라 비오니에": "시라, 비오니에",
    "이스까이": "말벡, 카베르네 프랑",
    "세냐": "카베르네 소비뇽, 말벡, 카르메네르, 쁘띠 베르도",
    "돈 멜쵸": "카베르네 소비뇽",
    "사시까이아": "카베르네 소비뇽, 카베르네 프랑",
    "라 스피네따 바르바레스코 스타데리": "네비올로",
    "클라우디베이 피노누아": "피노 누아",
    "맨패밀리 피노타쥐": "피노타주",
    "크리스탈": "피노 누아, 샤르도네",
    "자크셀로스 V.O": "샤르도네",
    "크룩 170": "피노 누아, 샤르도네, 피노 뮈니에",
    "크룩 171": "피노 누아, 샤르도네, 피노 뮈니에",
    "크룩 172": "피노 누아, 샤르도네, 피노 뮈니에",
    "돔페르뇽": "피노 누아, 샤르도네",
    "앙리 지로 퓌드센 MV17": "피노 누아, 샤르도네",
    "앙리 지로 퓌 드 쉔 MV17": "피노 누아, 샤르도네",
    "앙리지로 MV17": "피노 누아, 샤르도네",
    "앙리 지로 에스쁘리": "피노 누아, 샤르도네",
    "레어 08": "샤르도네, 피노 누아",
    "떼땅져": "샤르도네, 피노 누아, 피노 뮈니에",
    "필리조 에 피스 누메로 3 브뤼": "샤르도네, 피노 뮈니에, 피노 누아",
    "뽀므리": "샤르도네, 피노 누아, 피노 뮈니에",
    "플뢰리": "피노 누아",
    "파이퍼 하이직": "피노 누아, 피노 뮈니에, 샤르도네",
    "파이퍼하이직": "피노 누아, 피노 뮈니에, 샤르도네",
    "폴로져": "피노 누아, 샤르도네, 피노 뮈니에",
    "뵈브 끌레꼬": "피노 누아, 샤르도네, 피노 뮈니에",
    "뵈브 끌레꼬 로제": "피노 누아, 샤르도네, 피노 뮈니에",
    "빌까르 살몽 드미섹": "피노 뮈니에, 피노 누아, 샤르도네",
    "볼랭져": "피노 누아, 샤르도네, 피노 뮈니에",
    "멈 그랑 꼬르동": "피노 누아, 샤르도네, 피노 뮈니에",
    "멈 그랑 꼬르똥": "피노 누아, 샤르도네, 피노 뮈니에",
    "페리에 주에": "피노 누아, 피노 뮈니에, 샤르도네",
    "앙드레 끌루에": "피노 누아",
    "도츠": "피노 누아, 샤르도네, 피노 뮈니에",
    "게뷔르츠트라미너 그로씨 로에": "게뷔르츠트라미너",
    "휘겔 게뷔리츠트라미너": "게뷔르츠트라미너",
    "스모캣 리슬링": "리슬링",
    "맨패밀리 슈냉블랑": "슈냉 블랑",
    "군트럼 카비넷": "리슬링",
    "Dos Copas Sauvignon Blanc": "소비뇽 블랑",
    "Break Point Sauvignon Blanc Marlborough": "소비뇽 블랑",
    "래빗 아일랜드 소비뇽블랑": "소비뇽 블랑",
    "베비치 블랙 소비뇽블랑": "소비뇽 블랑",
    "더 패스 소비뇽블랑": "소비뇽 블랑",
    "셀락 오리진 소비뇽블랑": "소비뇽 블랑",
    "마르쿠스 몰리터 젤팅거 아우스레제": "리슬링",
    "로버트 바일 리슬링": "리슬링",
    "로버트 바일 리슬링 스파클링": "리슬링",
    "루이자도 샤블리": "샤르도네",
    "Domaine Laroche Saint Martin Chablis": "샤르도네",
    "La Chablisienne Chablis 1er Cru Vaillons": "샤르도네",
    "Joseph Drouhin Chablis Premier Cru Vaillons": "샤르도네",
    "Nicolas Potel Chablis 1er Cru Vaillons": "샤르도네",
    "Louis Latour Chablis": "샤르도네",
    "샤블리 15000원 확인불가": "샤르도네",
    "로얄 토카이 드라이 푸르민트": "푸르민트",
    "로얄 토카이 블루라벨": "푸르민트, 하르슈레벨뤼, 무스카텔",
    "샤또 꾸떼": "세미용, 소비뇽 블랑, 뮈스카델",
    "샤또 기로": "세미용, 소비뇽 블랑",
    "클라우디베이": "소비뇽 블랑",
    "오이스터베이": "소비뇽 블랑",
    "도그포인트": "소비뇽 블랑",
    "화이트헤븐": "소비뇽 블랑",
    "머드하우스": "소비뇽 블랑",
    "펄리셔": "소비뇽 블랑",
    "인비보": "소비뇽 블랑",
    "토후": "소비뇽 블랑",
    "시라꼬": "모스카토",
    "브리꼬 꽐리아": "모스카토",
    "Cattin Orange Pinot Gris": "피노 그리",
    "브레드 앤 버터 피노 누아": "피노 누아",
    "몬테스 클래식 시리즈 카베르네 소비뇽": "카베르네 소비뇽",
    "브라이다 일 바치알레": "바르베라, 피노 누아, 카베르네 소비뇽, 메를로",
    "루이 자도 부르고뉴 피노 누아": "피노 누아",
    "Ceravolo Petit Verdot": "쁘띠 베르도",
    "조머 리슬링 트로켄": "리슬링",
    "기갈 지공다스": "그르나슈, 시라, 무르베드르",
    "도멘 페블리 마르사네": "피노 누아",
    "옥세르 바스테기에타 칼라미티 리오하": "템프라니요, 가르나차, 비우라, 가르나차 블랑카",
    "찰스하이직 브뤼 레제르브": "피노 누아, 샤르도네, 피노 뮈니에",
    "찰스 하이직 브뤼 레제르브": "피노 누아, 샤르도네, 피노 뮈니에",
    "샤를 에드시크 브뤼 레제르브": "피노 누아, 샤르도네, 피노 뮈니에",
    "클레망 페르스발 레 루로 블랑 드 블랑": "샤르도네",
    "클레망 페르스발 르 뤼트 블랑 드 누아": "피노 누아",
    "마르크 소야르 크라 부르고뉴": "피노 누아",
    "마리 노엘 르드뤼 퀴베 뒤 굴테 그랑 크뤼": "피노 누아",
    "머드하우스 소비뇽 블랑": "소비뇽 블랑",
    "코노 소비뇽 블랑": "소비뇽 블랑",
    "베비치 블랙라벨 소비뇽 블랑": "소비뇽 블랑",
    "킴 크로포드 소비뇽 블랑": "소비뇽 블랑",
    "오이스터 베이 소비뇽 블랑": "소비뇽 블랑",
    "펄리셔 소비뇽 블랑": "소비뇽 블랑",
    "도츠 브뤼 클래식": "피노 누아, 샤르도네, 피노 뮈니에",
    "파이퍼 하이직 퀴베 브뤼": "피노 누아, 피노 뮈니에, 샤르도네",
    "파이퍼 하이직 빈티지": "피노 누아, 피노 뮈니에, 샤르도네",
    "래빗 아일랜드 소비뇽 블랑": "소비뇽 블랑",
    "베비치 블랙 라벨 소비뇽 블랑": "소비뇽 블랑",
    "더 패스 소비뇽 블랑": "소비뇽 블랑",
    "셀락 오리진 소비뇽 블랑": "소비뇽 블랑",
    "클라우디베이 소비뇽 블랑": "소비뇽 블랑",
    "도그포인트 소비뇽 블랑": "소비뇽 블랑",
    "인비보 소비뇽 블랑": "소비뇽 블랑",
    "토후 소비뇽 블랑": "소비뇽 블랑",
  };

  const varietyForName = (name, type = "", country = "") =>
    VARIETY_BY_WINE_NAME[(name || "").trim()] || inferVarietyFromName(name, type, country);

  const ENGLISH_NAME_BY_SEED_ID = {
    "seed-001": "Domaine Prieure Roch Le Cloud",
    "seed-002": "Moillard Gevrey-Chambertin",
    "seed-003": "Alex Gambal Gevrey-Chambertin",
    "seed-004": "Domaine Antonin Guyon Aloxe-Corton 1er Cru Les Fournieres",
    "seed-005": "Joseph Drouhin Gevrey-Chambertin",
    "seed-006": "Louis Latour Gevrey-Chambertin",
    "seed-007": "Barolet Pernot Pere & Fils Beaune Teurons 1er Cru",
    "seed-008": "A.F. Gros Bourgogne Pinot Noir",
    "seed-009": "Chateau Talbot",
    "seed-010": "Chateau Talbot Half Bottle",
    "seed-011": "Connetable de Talbot",
    "seed-012": "Bouchard Pere & Fils Gevrey-Chambertin",
    "seed-013": "Bouchard Pere & Fils Pommard",
    "seed-014": "Domaine Antonin Guyon Corton Bressandes Grand Cru",
    "seed-015": "Domaine Antonin Guyon Cote de Beaune Villages",
    "seed-016": "Chateau Le Puy Emilien",
    "seed-017": "Joseph Drouhin Laforet Bourgogne Pinot Noir",
    "seed-018": "Domaine Philippe Livera Cote de Nuits Villages",
    "seed-019": "Chateau Leoville Las Cases",
    "seed-020": "Charles Aine & Fils Cotes du Rhone",
    "seed-021": "Penner-Ash Pinot Noir",
    "seed-022": "Decoy Cabernet Sauvignon",
    "seed-023": "Decoy Merlot",
    "seed-024": "Decoy Merlot",
    "seed-025": "Calera Pinot Noir",
    "seed-026": "Textbook Cabernet Sauvignon",
    "seed-027": "Textbook Cabernet Sauvignon",
    "seed-028": "Textbook Cabernet Sauvignon",
    "seed-029": "Opus One",
    "seed-030": "Opus One",
    "seed-031": "Opus One",
    "seed-032": "Opus One Overture",
    "seed-033": "The Hilt Estate Pinot Noir",
    "seed-034": "The Hilt Estate Pinot Noir",
    "seed-035": "The Hilt Estate Pinot Noir",
    "seed-036": "Two Hands Bella's Garden Shiraz",
    "seed-037": "Two Hands Bella's Garden Shiraz",
    "seed-038": "Two Hands Lily's Garden Shiraz",
    "seed-039": "Two Hands Lily's Garden Shiraz",
    "seed-040": "Two Hands Lily's Garden Shiraz",
    "seed-041": "Two Hands Charlie's Garden Shiraz",
    "seed-042": "Two Hands Charlie's Garden Shiraz",
    "seed-043": "Kilikanoon Oracle Shiraz",
    "seed-044": "Kilikanoon Oracle Shiraz",
    "seed-045": "Kilikanoon Oracle Shiraz",
    "seed-046": "Mollydooker Blue Eyed Boy Shiraz",
    "seed-047": "Mollydooker The Boxer Shiraz",
    "seed-048": "Trapiche Iscay Syrah & Viognier",
    "seed-049": "Trapiche Iscay Malbec & Cabernet Franc",
    "seed-050": "Trapiche Iscay Malbec & Cabernet Franc",
    "seed-051": "Trapiche Iscay Malbec & Cabernet Franc",
    "seed-052": "Sena",
    "seed-053": "Sena",
    "seed-054": "Don Melchor Cabernet Sauvignon",
    "seed-055": "Tenuta San Guido Sassicaia",
    "seed-056": "La Spinetta Barbaresco Starderi",
    "seed-057": "Cloudy Bay Pinot Noir",
    "seed-058": "MAN Family Pinotage",
    "seed-059": "Louis Roederer Cristal",
    "seed-060": "Louis Roederer Cristal",
    "seed-061": "Louis Roederer Cristal",
    "seed-062": "Jacques Selosse V.O. Version Originale",
    "seed-063": "Jacques Selosse V.O. Version Originale",
    "seed-064": "Krug Grande Cuvee 170eme Edition",
    "seed-065": "Krug Grande Cuvee 170eme Edition",
    "seed-066": "Krug Grande Cuvee 171eme Edition",
    "seed-067": "Krug Grande Cuvee 171eme Edition",
    "seed-068": "Krug Grande Cuvee 171eme Edition",
    "seed-069": "Krug Grande Cuvee 172eme Edition",
    "seed-070": "Dom Perignon",
    "seed-071": "Dom Perignon",
    "seed-072": "Dom Perignon",
    "seed-073": "Dom Perignon",
    "seed-074": "Dom Perignon",
    "seed-075": "Henri Giraud Ay Grand Cru Fut de Chene MV17",
    "seed-076": "Piper-Heidsieck Rare 2008",
    "seed-077": "Taittinger Brut Reserve",
    "seed-078": "Taittinger Brut Reserve",
    "seed-079": "Taittinger Brut Reserve",
    "seed-080": "Taittinger Brut Reserve",
    "seed-081": "Champagne Philizot & Fils Numero 3 Brut",
    "seed-082": "Pommery Brut Royal",
    "seed-083": "Champagne Fleury Robert Fleury Extra Brut",
    "seed-084": "Piper-Heidsieck Cuvee Brut",
    "seed-085": "Piper-Heidsieck Vintage Brut",
    "seed-086": "Pol Roger Brut Reserve",
    "seed-087": "Veuve Clicquot Yellow Label Brut",
    "seed-088": "Veuve Clicquot Yellow Label Brut",
    "seed-089": "Veuve Clicquot Yellow Label Brut",
    "seed-090": "Veuve Clicquot Rose",
    "seed-091": "Billecart-Salmon Demi-Sec",
    "seed-092": "Bollinger Special Cuvee Brut",
    "seed-093": "G.H. Mumm Grand Cordon Brut",
    "seed-094": "Perrier-Jouet Grand Brut",
    "seed-095": "Andre Clouet Grande Reserve Brut",
    "seed-096": "Deutz Brut Classic",
    "seed-097": "Hugel Gewurztraminer Grossi Laue",
    "seed-098": "Hugel Gewurztraminer",
    "seed-099": "Sumo Cat Riesling",
    "seed-100": "MAN Family Chenin Blanc",
    "seed-101": "Guntrum Riesling Kabinett",
    "seed-102": "Dos Copas Sauvignon Blanc",
    "seed-103": "Break Point Sauvignon Blanc Marlborough",
    "seed-104": "Break Point Sauvignon Blanc Marlborough",
    "seed-105": "Rabbit Island Sauvignon Blanc",
    "seed-106": "Babich Black Label Sauvignon Blanc",
    "seed-107": "The Pass Sauvignon Blanc",
    "seed-108": "Selaks Origins Sauvignon Blanc",
    "seed-109": "Selaks Origins Sauvignon Blanc",
    "seed-110": "Markus Molitor Zeltinger Sonnenuhr Riesling Auslese",
    "seed-111": "Robert Weil Riesling Tradition",
    "seed-112": "Robert Weil Riesling Tradition",
    "seed-113": "Robert Weil Riesling Tradition",
    "seed-114": "Robert Weil Riesling Tradition",
    "seed-115": "Robert Weil Riesling Sekt Brut",
    "seed-116": "Louis Jadot Chablis",
    "seed-117": "Domaine Laroche Saint Martin Chablis",
    "seed-118": "La Chablisienne Chablis 1er Cru Vaillons",
    "seed-119": "Joseph Drouhin Chablis Premier Cru Vaillons",
    "seed-120": "Nicolas Potel Chablis 1er Cru Vaillons",
    "seed-121": "Unknown Chablis 15000 KRW",
    "seed-122": "Royal Tokaji Dry Furmint",
    "seed-123": "Royal Tokaji Blue Label 5 Puttonyos Aszu",
    "seed-124": "Royal Tokaji Blue Label 5 Puttonyos Aszu",
    "seed-125": "Chateau Coutet Barsac",
    "seed-126": "Chateau Coutet Barsac",
    "seed-127": "Chateau Guiraud Sauternes",
    "seed-128": "Cloudy Bay Sauvignon Blanc",
    "seed-129": "Cloudy Bay Sauvignon Blanc",
    "seed-130": "Cloudy Bay Sauvignon Blanc",
    "seed-131": "Cloudy Bay Sauvignon Blanc",
    "seed-132": "Cloudy Bay Sauvignon Blanc",
    "seed-133": "Cloudy Bay Sauvignon Blanc",
    "seed-134": "Cloudy Bay Sauvignon Blanc",
    "seed-135": "Oyster Bay Sauvignon Blanc",
    "seed-136": "Dog Point Sauvignon Blanc",
    "seed-137": "Dog Point Sauvignon Blanc",
    "seed-138": "Dog Point Sauvignon Blanc",
    "seed-139": "Whitehaven Sauvignon Blanc",
    "seed-140": "Mud House Sauvignon Blanc",
    "seed-141": "Palliser Estate Sauvignon Blanc",
    "seed-142": "Invivo X SJP Sauvignon Blanc",
    "seed-143": "Tohu Sauvignon Blanc",
    "seed-144": "Saracco Moscato d'Asti",
    "seed-145": "La Spinetta Bricco Quaglia Moscato d'Asti",
    "seed-146": "La Spinetta Bricco Quaglia Moscato d'Asti",
    "seed-147": "La Spinetta Bricco Quaglia Moscato d'Asti",
    "seed-148": "Cattin Orange Pinot Gris",
    "seed-149": "Bread & Butter Pinot Noir",
    "seed-150": "Montes Classic Cabernet Sauvignon",
    "seed-151": "Braida Il Baciale Monferrato Rosso",
    "seed-152": "Louis Jadot Bourgogne Pinot Noir",
    "seed-153": "Ceravolo Petit Verdot",
    "seed-154": "Schloss Vollrads Sommer Riesling Trocken",
    "seed-155": "E. Guigal Gigondas",
    "seed-156": "Domaine Faiveley Marsannay",
    "seed-157": "Oxer Bastegieta Kalamity Rioja",
    "seed-158": "Charles Heidsieck Brut Reserve",
    "seed-159": "Clement Perseval Les Rouleaux Blanc de Blancs",
    "seed-160": "Clement Perseval Le Luth Blanc de Noirs",
    "seed-161": "Marc Soyard Cras Bourgogne",
    "seed-162": "Marie-Noelle Ledru Cuvee du Goulte Grand Cru Blanc de Noirs Extra Brut",
    "seed-163": "Mud House Sauvignon Blanc",
    "seed-164": "Mud House Sauvignon Blanc",
    "seed-165": "Kono Sauvignon Blanc",
    "seed-166": "Kono Sauvignon Blanc",
    "seed-167": "Kono Sauvignon Blanc",
    "seed-168": "Babich Black Label Sauvignon Blanc",
    "seed-169": "Babich Black Label Sauvignon Blanc",
    "seed-170": "Kim Crawford Sauvignon Blanc",
    "seed-171": "Kim Crawford Sauvignon Blanc",
    "seed-172": "Oyster Bay Sauvignon Blanc",
    "seed-173": "Oyster Bay Sauvignon Blanc",
    "seed-174": "Palliser Estate Sauvignon Blanc",
    "seed-175": "Palliser Estate Sauvignon Blanc",
    "seed-176": "Perrier-Jouet Grand Brut",
    "seed-177": "Piper-Heidsieck Cuvee Brut",
    "seed-178": "Piper-Heidsieck Cuvee Brut",
    "seed-179": "Piper-Heidsieck Cuvee Brut",
    "seed-180": "Deutz Brut Classic",
  };

  const SEED_CORRECTIONS = {
    "seed-002": {
      old: { name: "모알라 제브리 샹베르땅", country: "FR", vintage: "2018" },
      next: { name: "Moillard Gevrey-Chambertin", country: "FR", vintage: "2018" },
    },
    "seed-007": {
      old: { name: "본 트롱 1CRU", country: "FR", vintage: "2020" },
      next: {
        name: "Barolet Pernot Pere & Fils Beaune Teurons 1er Cru",
        country: "FR",
        vintage: "2020",
      },
    },
    "seed-020": {
      old: { name: "샤를 에네 꼬뜨 뒤 론", country: "FR", vintage: "" },
      next: { name: "Charles Aine & Fils Cotes du Rhone", country: "FR", vintage: "2023" },
    },
    "seed-022": {
      old: { name: "덕혼 디코이", country: "US", vintage: "2019" },
      next: { name: "Decoy Cabernet Sauvignon", country: "US", vintage: "2019" },
    },
    "seed-048": {
      old: { name: "이스까이", country: "AR", vintage: "2019" },
      next: { name: "이스까이 시라 비오니에", country: "AR", vintage: "2019" },
    },
    "seed-058": {
      old: { name: "맨패밀리 피노타쥐", country: "NZ", vintage: "" },
      next: { name: "맨패밀리 피노타쥐", country: "ZA", vintage: "" },
    },
    "seed-075": {
      old: [
        { name: "앙리지로 MV17", country: "FR", vintage: "" },
        { name: "앙리 지로 MV17", country: "FR", vintage: "" },
        { name: "Henri Giraud MV17", country: "FR", vintage: "" },
        { name: "Henri Giraud Fut de Chene MV17", country: "FR", vintage: "" },
        { name: "Henri Giraud Fût de Chêne MV17", country: "FR", vintage: "" },
        { name: "앙리 지로 퓌 드 쉔 MV17", country: "FR", vintage: "" },
        { name: "앙리 지로 퓌드센 MV17", country: "FR", vintage: "" },
        { name: "앙리 지로 퓌드센", country: "FR", vintage: "" },
        { name: "앙리지로 에스쁘리", country: "FR", vintage: "" },
        { name: "앙리 지로 에스쁘리", country: "FR", vintage: "" },
        { name: "앙리 지로 에스쁘리 네이처", country: "FR", vintage: "" },
        { name: "Henri Giraud Esprit", country: "FR", vintage: "" },
        { name: "Henri Giraud Esprit Nature", country: "FR", vintage: "" },
      ],
      next: { name: "앙리 지로 퓌드센 MV17", country: "FR", vintage: "" },
    },
    "seed-081": {
      old: { name: "필리조 에피스", country: "FR", vintage: "" },
      next: { name: "필리조 에 피스 누메로 3 브뤼", country: "FR", vintage: "" },
    },
    "seed-093": {
      old: { name: "멈 그랑 꼬르똥", country: "FR", vintage: "" },
      next: { name: "멈 그랑 꼬르동", country: "FR", vintage: "" },
    },
    "seed-099": {
      old: { name: "스모켓 리슬링", country: "DE", vintage: "" },
      next: { name: "스모캣 리슬링", country: "DE", vintage: "" },
    },
    "seed-102": {
      old: { name: "도스코파스", country: "CL", vintage: "" },
      next: { name: "Dos Copas Sauvignon Blanc", country: "CL", vintage: "2023" },
    },
    "seed-103": {
      old: { name: "브레이크 포인트 소비뇽블랑", country: "NZ", vintage: "" },
      next: { name: "Break Point Sauvignon Blanc Marlborough", country: "NZ", vintage: "" },
    },
    "seed-104": {
      old: { name: "브레이크 포인트 소비뇽블랑", country: "NZ", vintage: "" },
      next: { name: "Break Point Sauvignon Blanc Marlborough", country: "NZ", vintage: "" },
    },
    "seed-117": {
      old: { name: "샤블리 생마르땡", country: "FR", vintage: "2021" },
      next: { name: "Domaine Laroche Saint Martin Chablis", country: "FR", vintage: "2021" },
    },
    "seed-118": {
      old: [
        { name: "바이용 샤블리 1CRU", country: "FR", vintage: "2018" },
        { name: "L&C Poitout Chablis 1er Cru Vaillons", country: "FR", vintage: "2018" },
      ],
      next: { name: "La Chablisienne Chablis 1er Cru Vaillons", country: "FR", vintage: "2018" },
    },
    "seed-122": {
      old: { name: "로얄토카이", country: "HU", vintage: "" },
      next: { name: "로얄 토카이 드라이 푸르민트", country: "HU", vintage: "" },
    },
    "seed-119": {
      old: { name: "조셉드루앙 샤블리 1CRU", country: "FR", vintage: "2018" },
      next: {
        name: "Joseph Drouhin Chablis Premier Cru Vaillons",
        country: "FR",
        vintage: "2018",
      },
    },
    "seed-120": {
      old: { name: "메종 니꼴라 뽀뗄 샤블리 1er 발롱", country: "FR", vintage: "" },
      next: { name: "Nicolas Potel Chablis 1er Cru Vaillons", country: "FR", vintage: "2019" },
    },
    "seed-121": {
      old: [
        { name: "샤블리. 15000원 뽑기로 뽑은거", country: "FR", vintage: "" },
        { name: "Louis Latour Chablis", country: "FR", vintage: "2020" },
      ],
      next: { name: "샤블리 15000원 확인불가", country: "FR", vintage: "" },
    },
    "seed-148": {
      old: { name: "오렌지 카틴 피노 그리", country: "FR", vintage: "" },
      next: { name: "Cattin Orange Pinot Gris", country: "FR", vintage: "" },
    },
    "seed-153": {
      old: { name: "체라볼로 프티 베르도", country: "AU", vintage: "" },
      next: { name: "Ceravolo Petit Verdot", country: "AU", vintage: "2019" },
    },
    "seed-157": {
      old: { name: "칼라미티 리오하", country: "ES", vintage: "" },
      next: { name: "옥세르 바스테기에타 칼라미티 리오하", country: "ES", vintage: "" },
    },
    "seed-158": {
      old: [
        { name: "샤를 에드시크 브뤼 레제르브", country: "FR", vintage: "" },
        { name: "찰스 하이직 브뤼 레제르브", country: "FR", vintage: "" },
      ],
      next: { name: "찰스하이직 브뤼 레제르브", country: "FR", vintage: "" },
    },
    "seed-160": {
      old: { name: "클레망 페르스발 르 뤼 블랑 드 누아", country: "FR", vintage: "" },
      next: { name: "클레망 페르스발 르 뤼트 블랑 드 누아", country: "FR", vintage: "" },
    },
    "seed-161": {
      old: { name: "마르크 소야르 크라 2022 부르고뉴", country: "FR", vintage: "" },
      next: { name: "마르크 소야르 크라 부르고뉴", country: "FR", vintage: "2022" },
    },
    "seed-084": {
      old: { name: "파이퍼 하이직", country: "FR", vintage: "" },
      next: { name: "파이퍼 하이직 퀴베 브뤼", country: "FR", vintage: "" },
    },
    "seed-085": {
      old: { name: "파이퍼하이직", country: "FR", vintage: "2014" },
      next: { name: "파이퍼 하이직 빈티지", country: "FR", vintage: "2014" },
    },
    "seed-096": {
      old: { name: "도츠", country: "FR", vintage: "" },
      next: { name: "도츠 브뤼 클래식", country: "FR", vintage: "" },
    },
    "seed-105": {
      old: { name: "래빗 아일랜드 소비뇽블랑", country: "NZ", vintage: "" },
      next: { name: "래빗 아일랜드 소비뇽 블랑", country: "NZ", vintage: "" },
    },
    "seed-106": {
      old: { name: "베비치 블랙 소비뇽블랑", country: "NZ", vintage: "" },
      next: { name: "베비치 블랙 라벨 소비뇽 블랑", country: "NZ", vintage: "" },
    },
    "seed-107": {
      old: { name: "더 패스 소비뇽블랑", country: "NZ", vintage: "" },
      next: { name: "더 패스 소비뇽 블랑", country: "NZ", vintage: "" },
    },
    "seed-108": {
      old: { name: "셀락 오리진 소비뇽블랑", country: "NZ", vintage: "" },
      next: { name: "셀락 오리진 소비뇽 블랑", country: "NZ", vintage: "" },
    },
    "seed-109": {
      old: { name: "셀락 오리진 소비뇽블랑", country: "NZ", vintage: "" },
      next: { name: "셀락 오리진 소비뇽 블랑", country: "NZ", vintage: "" },
    },
    "seed-128": {
      old: { name: "클라우디베이", country: "NZ", vintage: "2021" },
      next: { name: "클라우디베이 소비뇽 블랑", country: "NZ", vintage: "2021" },
    },
    "seed-129": {
      old: { name: "클라우디베이", country: "NZ", vintage: "2022" },
      next: { name: "클라우디베이 소비뇽 블랑", country: "NZ", vintage: "2022" },
    },
    "seed-130": {
      old: { name: "클라우디베이", country: "NZ", vintage: "2022" },
      next: { name: "클라우디베이 소비뇽 블랑", country: "NZ", vintage: "2022" },
    },
    "seed-131": {
      old: { name: "클라우디베이", country: "NZ", vintage: "2022" },
      next: { name: "클라우디베이 소비뇽 블랑", country: "NZ", vintage: "2022" },
    },
    "seed-132": {
      old: { name: "클라우디베이", country: "NZ", vintage: "2023" },
      next: { name: "클라우디베이 소비뇽 블랑", country: "NZ", vintage: "2023" },
    },
    "seed-133": {
      old: { name: "클라우디베이", country: "NZ", vintage: "2024" },
      next: { name: "클라우디베이 소비뇽 블랑", country: "NZ", vintage: "2024" },
    },
    "seed-134": {
      old: { name: "클라우디베이", country: "NZ", vintage: "2024" },
      next: { name: "클라우디베이 소비뇽 블랑", country: "NZ", vintage: "2024" },
    },
    "seed-135": {
      old: { name: "오이스터베이", country: "NZ", vintage: "" },
      next: { name: "오이스터 베이 소비뇽 블랑", country: "NZ", vintage: "" },
    },
    "seed-136": {
      old: { name: "도그포인트", country: "NZ", vintage: "2018" },
      next: { name: "도그포인트 소비뇽 블랑", country: "NZ", vintage: "2018" },
    },
    "seed-137": {
      old: { name: "도그포인트", country: "NZ", vintage: "2020" },
      next: { name: "도그포인트 소비뇽 블랑", country: "NZ", vintage: "2020" },
    },
    "seed-138": {
      old: { name: "도그포인트", country: "NZ", vintage: "2021" },
      next: { name: "도그포인트 소비뇽 블랑", country: "NZ", vintage: "2021" },
    },
    "seed-140": {
      old: { name: "머드하우스", country: "NZ", vintage: "2021" },
      next: { name: "머드하우스 소비뇽 블랑", country: "NZ", vintage: "2021" },
    },
    "seed-141": {
      old: { name: "펄리셔", country: "NZ", vintage: "2022" },
      next: { name: "펄리셔 소비뇽 블랑", country: "NZ", vintage: "2022" },
    },
    "seed-142": {
      old: { name: "인비보", country: "NZ", vintage: "2022" },
      next: { name: "인비보 소비뇽 블랑", country: "NZ", vintage: "2022" },
    },
    "seed-143": {
      old: { name: "토후", country: "NZ", vintage: "2022" },
      next: { name: "토후 소비뇽 블랑", country: "NZ", vintage: "2022" },
    },
    "seed-168": {
      old: { name: "베비치 블랙라벨 소비뇽 블랑", country: "NZ", vintage: "" },
      next: { name: "베비치 블랙 라벨 소비뇽 블랑", country: "NZ", vintage: "" },
    },
    "seed-169": {
      old: { name: "베비치 블랙라벨 소비뇽 블랑", country: "NZ", vintage: "" },
      next: { name: "베비치 블랙 라벨 소비뇽 블랑", country: "NZ", vintage: "" },
    },
    "seed-177": {
      old: { name: "파이퍼하이직", country: "FR", vintage: "" },
      next: { name: "파이퍼 하이직 퀴베 브뤼", country: "FR", vintage: "" },
    },
    "seed-178": {
      old: { name: "파이퍼하이직", country: "FR", vintage: "" },
      next: { name: "파이퍼 하이직 퀴베 브뤼", country: "FR", vintage: "" },
    },
    "seed-179": {
      old: { name: "파이퍼하이직", country: "FR", vintage: "" },
      next: { name: "파이퍼 하이직 퀴베 브뤼", country: "FR", vintage: "" },
    },
    "seed-180": {
      old: { name: "도츠", country: "FR", vintage: "" },
      next: { name: "도츠 브뤼 클래식", country: "FR", vintage: "" },
    },
  };

  const DEFAULT_PHOTO_BY_WINE_ID = {
    "seed-001": "wine-images/review-001.jpg",
    "seed-002": "wine-images/review-002.jpg",
    "seed-003": "wine-images/review-003.jpg",
    "seed-004": "wine-images/review-141.jpg",

    "seed-005": "wine-images/review-005.jpg",
    "seed-006": "wine-images/review-006.jpg",
    "seed-007": "wine-images/review-149.jpg",
    "seed-008": "wine-images/review-008.jpg",
    "seed-009": "wine-images/review-009.jpg",
    "seed-010": "wine-images/review-010.jpg",
    "seed-011": "wine-images/review-011.jpg",
    "seed-012": "wine-images/review-012.jpg",
    "seed-013": "wine-images/review-013.jpg",
    "seed-014": "wine-images/review-142.jpg",
    "seed-015": "wine-images/review-147.jpg",

    "seed-016": "wine-images/review-016.jpg",
    "seed-017": "wine-images/review-017.jpg",
    "seed-018": "wine-images/review-018.jpg",
    "seed-019": "wine-images/review-019.jpg",
    "seed-020": "wine-images/review-020.jpg",
    "seed-021": "wine-images/review-021.jpg",
    "seed-022": "wine-images/review-022.jpg",
    "seed-023": "wine-images/review-023.jpg",
    "seed-024": "wine-images/review-023.jpg",
    "seed-025": "wine-images/review-024.jpg",
    "seed-026": "wine-images/review-025.jpg",
    "seed-027": "wine-images/review-025.jpg",
    "seed-028": "wine-images/review-025.jpg",
    "seed-029": "wine-images/review-026.jpg",
    "seed-030": "wine-images/review-026.jpg",
    "seed-031": "wine-images/review-027.jpg",
    "seed-032": "wine-images/review-028.jpg",
    "seed-033": "wine-images/review-029.jpg",
    "seed-034": "wine-images/review-029.jpg",
    "seed-035": "wine-images/review-029.jpg",
    "seed-036": "wine-images/review-030.jpg",
    "seed-037": "wine-images/review-030.jpg",
    "seed-038": "wine-images/review-031.jpg",
    "seed-039": "wine-images/review-031.jpg",
    "seed-040": "wine-images/review-031.jpg",
    "seed-041": "wine-images/review-032.jpg",
    "seed-042": "wine-images/review-032.jpg",
    "seed-043": "wine-images/review-137.jpg",
    "seed-044": "wine-images/review-137.jpg",
    "seed-045": "wine-images/review-137.jpg",



    "seed-046": "wine-images/review-034.jpg",
    "seed-047": "wine-images/review-035.jpg",
    "seed-048": "wine-images/review-036.jpg",
    "seed-049": "wine-images/review-037.jpg",
    "seed-050": "wine-images/review-037.jpg",
    "seed-051": "wine-images/review-037.jpg",
    "seed-052": "wine-images/review-038.jpg",
    "seed-053": "wine-images/review-039.jpg",
    "seed-054": "wine-images/review-040.jpg",
    "seed-055": "wine-images/review-041.jpg",
    "seed-056": "wine-images/review-042.jpg",
    "seed-057": "wine-images/review-043.jpg",
    "seed-058": "wine-images/review-044.jpg",
    "seed-059": "wine-images/review-045.jpg",
    "seed-060": "wine-images/review-046.jpg",
    "seed-061": "wine-images/review-047.jpg",
    "seed-062": "wine-images/review-048.jpg",
    "seed-063": "wine-images/review-048.jpg",
    "seed-064": "wine-images/review-049.jpg",
    "seed-065": "wine-images/review-049.jpg",
    "seed-066": "wine-images/review-050.jpg",
    "seed-067": "wine-images/review-050.jpg",
    "seed-068": "wine-images/review-050.jpg",
    "seed-069": "wine-images/review-051.jpg",
    "seed-070": "wine-images/review-052.jpg",
    "seed-071": "wine-images/review-053.jpg",
    "seed-072": "wine-images/review-053.jpg",
    "seed-073": "wine-images/review-053.jpg",
    "seed-074": "wine-images/review-053.jpg",
    "seed-075": "wine-images/review-054.jpg",

    "seed-076": "wine-images/review-055.jpg",
    "seed-077": "wine-images/review-056.jpg",
    "seed-078": "wine-images/review-056.jpg",
    "seed-079": "wine-images/review-056.jpg",
    "seed-080": "wine-images/review-056.jpg",
    "seed-081": "wine-images/review-057.jpg",
    "seed-082": "wine-images/review-058.jpg",
    "seed-083": "wine-images/review-148.jpg",

    "seed-084": "wine-images/review-060.jpg",
    "seed-085": "wine-images/review-061.jpg",
    "seed-086": "wine-images/review-062.jpg",
    "seed-087": "wine-images/review-063.jpg",
    "seed-088": "wine-images/review-063.jpg",
    "seed-089": "wine-images/review-063.jpg",
    "seed-090": "wine-images/review-064.jpg",
    "seed-091": "wine-images/review-065.jpg",
    "seed-092": "wine-images/review-066.jpg",
    "seed-093": "wine-images/review-135.jpg",

    "seed-094": "wine-images/review-068.jpg",
    "seed-095": "wine-images/review-069.jpg",
    "seed-096": "wine-images/review-070.jpg",
    "seed-097": "wine-images/review-071.jpg",
    "seed-098": "wine-images/review-072.jpg",
    "seed-099": "wine-images/review-073.jpg",
    "seed-100": "wine-images/review-074.jpg",
    "seed-101": "wine-images/review-134.jpg",

    "seed-102": "wine-images/review-076.jpg",
    "seed-103": "wine-images/review-145.jpg",
    "seed-104": "wine-images/review-145.jpg",
    "seed-105": "wine-images/review-077.jpg",
    "seed-106": "wine-images/review-078.jpg",
    "seed-107": "wine-images/review-079.jpg",
    "seed-108": "wine-images/review-080.jpg",
    "seed-109": "wine-images/review-080.jpg",
    "seed-110": "wine-images/review-081.jpg",
    "seed-111": "wine-images/review-082.jpg",
    "seed-112": "wine-images/review-082.jpg",
    "seed-113": "wine-images/review-082.jpg",
    "seed-114": "wine-images/review-082.jpg",
    "seed-115": "wine-images/review-083.jpg",
    "seed-116": "wine-images/review-084.jpg",
    "seed-117": "wine-images/review-085.jpg",
    "seed-118": "wine-images/review-086.jpg",
    "seed-119": "wine-images/review-087.jpg",
    "seed-120": "wine-images/review-138.jpg",
    "seed-122": "wine-images/review-090.jpg",
    "seed-123": "wine-images/review-091.jpg",
    "seed-124": "wine-images/review-091.jpg",
    "seed-125": "wine-images/review-092.jpg",
    "seed-126": "wine-images/review-092.jpg",
    "seed-127": "wine-images/review-093.jpg",
    "seed-128": "wine-images/review-094.jpg",
    "seed-129": "wine-images/review-095.jpg",
    "seed-130": "wine-images/review-095.jpg",
    "seed-131": "wine-images/review-095.jpg",
    "seed-132": "wine-images/review-096.jpg",
    "seed-133": "wine-images/review-097.jpg",
    "seed-134": "wine-images/review-097.jpg",
    "seed-135": "wine-images/review-098.jpg",
    "seed-136": "wine-images/review-099.jpg",
    "seed-137": "wine-images/review-100.jpg",
    "seed-138": "wine-images/review-101.jpg",
    "seed-139": "wine-images/review-102.jpg",
    "seed-140": "wine-images/review-103.jpg",
    "seed-141": "wine-images/review-104.jpg",
    "seed-142": "wine-images/review-136.jpg",
    "seed-143": "wine-images/review-140.jpg",


    "seed-144": "wine-images/review-107.jpg",
    "seed-145": "wine-images/review-108.jpg",
    "seed-146": "wine-images/review-109.jpg",
    "seed-147": "wine-images/review-109.jpg",
    "seed-148": "wine-images/review-110.jpg",
    "seed-149": "wine-images/review-111.jpg",
    "seed-150": "wine-images/review-112.jpg",
    "seed-151": "wine-images/review-113.jpg",
    "seed-152": "wine-images/review-114.jpg",
    "seed-153": "wine-images/review-146.jpg",
    "seed-154": "wine-images/review-116.jpg",
    "seed-155": "wine-images/review-139.jpg",

    "seed-156": "wine-images/review-118.jpg",
    "seed-157": "wine-images/review-119.jpg",
    "seed-158": "wine-images/review-120.jpg",
    "seed-159": "wine-images/review-121.jpg",
    "seed-160": "wine-images/review-122.jpg",
    "seed-161": "wine-images/review-144.jpg",
    "seed-162": "wine-images/review-132.jpg",
    "seed-163": "wine-images/review-125.jpg",
    "seed-164": "wine-images/review-125.jpg",
    "seed-165": "wine-images/review-126.jpg",
    "seed-166": "wine-images/review-126.jpg",
    "seed-167": "wine-images/review-126.jpg",
    "seed-168": "wine-images/review-127.jpg",
    "seed-169": "wine-images/review-127.jpg",
    "seed-170": "wine-images/review-143.jpg",
    "seed-171": "wine-images/review-143.jpg",


    "seed-172": "wine-images/review-129.jpg",
    "seed-173": "wine-images/review-129.jpg",
    "seed-174": "wine-images/review-104.jpg",
    "seed-175": "wine-images/review-104.jpg",
    "seed-176": "wine-images/review-068.jpg",
    "seed-177": "wine-images/review-131.jpg",
    "seed-178": "wine-images/review-131.jpg",
    "seed-179": "wine-images/review-131.jpg",
    "seed-180": "wine-images/review-070.jpg",
  };
  const DEFAULT_PHOTO_AUTOFILL_ENABLED = true;
  const DEFAULT_PHOTO_RE = /^wine-images\/(?:ready|review)-\d{3}\.jpg$/;
  const DEFAULT_PHOTO_BY_WINE_NAME = {
    "앙리 지로 퓌드센 MV17": "wine-images/review-054.jpg",
    "앙리 지로 퓌드센": "wine-images/review-054.jpg",
    "앙리 지로 퓌 드 쉔 MV17": "wine-images/review-054.jpg",
    "앙리지로 MV17": "wine-images/review-054.jpg",
    "앙리 지로 MV17": "wine-images/review-054.jpg",
    "Henri Giraud MV17": "wine-images/review-054.jpg",
    "Henri Giraud Fut de Chene MV17": "wine-images/review-054.jpg",
    "Henri Giraud Fût de Chêne MV17": "wine-images/review-054.jpg",
    "앙리 지로 에스쁘리": "wine-images/review-133.jpg",
    "앙리지로 에스쁘리": "wine-images/review-133.jpg",
    "Henri Giraud Esprit": "wine-images/review-133.jpg",
    "Henri Giraud Esprit Nature": "wine-images/review-133.jpg",
  };

  const defaultPhotoForWineId = (id) =>
    DEFAULT_PHOTO_AUTOFILL_ENABLED ? DEFAULT_PHOTO_BY_WINE_ID[id] || null : null;

  const defaultPhotoForWineName = (name) =>
    DEFAULT_PHOTO_AUTOFILL_ENABLED ? DEFAULT_PHOTO_BY_WINE_NAME[(name || "").trim()] || null : null;

  const isDefaultPhoto = (photo) =>
    typeof photo === "string" && DEFAULT_PHOTO_RE.test(photo);

  const ADDITIONAL_VARIETY_OPTIONS = [
    "그르나슈",
    "까르메네르",
    "네비올로",
    "말벡",
    "바르베라",
    "비오니에",
    "세미용",
    "카베르네 프랑",
    "템프라니요",
    "피노 뮈니에",
  ];

  const VARIETY_OPTIONS = Array.from(
    new Set(
      Object.values(VARIETY_BY_WINE_NAME)
        .flatMap((varieties) =>
          varieties
            .split(",")
            .map((variety) => variety.trim())
            .filter(Boolean)
        )
        .concat(ADDITIONAL_VARIETY_OPTIONS)
    )
  ).sort((a, b) => a.localeCompare(b, "ko"));

  const normalizeVarietyInput = (value) =>
    (value || "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .join(", ");

  const varietyParts = (wine) =>
    normalizeVarietyInput(wine && wine.variety)
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

  const primaryVariety = (wine) => varietyParts(wine)[0] || "";

  const canonicalSeedNameForId = (id) => ENGLISH_NAME_BY_SEED_ID[id] || "";

  function normalizedLookupName(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function inferVarietyFromName(name, type = "", country = "") {
    const n = normalizedLookupName(name);
    const wineType = (type || "").toLowerCase();
    const countryCode = (country || "").toUpperCase();
    if (!n) return representativeVarietyForType(wineType, countryCode);

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
    if (n.includes("sena")) {
      return "카베르네 소비뇽, 까르메네르, 말벡, 메를로, 쁘띠 베르도";
    }
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
    if (
      wineType === "sparkling" ||
      n.includes("champagne") ||
      n.includes("brut") ||
      n.includes("cuvee")
    ) {
      return "샤르도네, 피노 누아, 피노 뮈니에";
    }

    return representativeVarietyForType(wineType, countryCode);
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

  function seedVarietyForId(id, fallbackName = "", type = "", country = "") {
    const canonicalName = canonicalSeedNameForId(id);
    return varietyForName(canonicalName, type, country) || varietyForName(fallbackName, type, country);
  }

  function applyEnglishSeedName(wine) {
    if (!wine || typeof wine !== "object") return wine;
    const canonicalName = canonicalSeedNameForId(wine.id);
    if (!canonicalName) return wine;

    // New seed records already use the canonical name. Existing records may have
    // been intentionally renamed by the user, so normalization must never rename
    // them again. Exact legacy corrections are handled separately below.
    const updates = {};
    const variety = seedVarietyForId(wine.id, wine.name, wine.type, wine.country);
    if (variety && !(wine.variety || "").trim()) updates.variety = variety;
    return Object.keys(updates).length ? Object.assign({}, wine, updates) : wine;
  }

  function applySeedCorrections(wines) {
    if (!Array.isArray(wines)) return [];
    return wines.map((wine) => {
      let nextWine = wine;
      if (wine && wine.userModified) return nextWine;
      const correction = wine && SEED_CORRECTIONS[wine.id];
      if (!correction) return applyEnglishSeedName(nextWine);

      const currentName = (wine.name || "").trim();
      const currentCountry = wine.country || "";
      const currentVintage = (wine.vintage || "").trim();
      const oldVariants = Array.isArray(correction.old) ? correction.old : [correction.old];
      const matchesOldSeed = oldVariants.some(
        (old) =>
          currentName === old.name &&
          currentCountry === old.country &&
          currentVintage === old.vintage
      );

      if (!matchesOldSeed) return applyEnglishSeedName(nextWine);

      nextWine = Object.assign({}, wine, correction.next);
      const canonicalName = canonicalSeedNameForId(nextWine.id);
      if (canonicalName) nextWine.name = canonicalName;
      const mappedVariety = seedVarietyForId(
        nextWine.id,
        nextWine.name,
        nextWine.type,
        nextWine.country
      );
      if (mappedVariety && !(nextWine.variety || "").trim()) {
        nextWine.variety = mappedVariety;
      }
      return applyEnglishSeedName(nextWine);
    });
  }

  function enrichWinesWithVariety(wines) {
    if (!Array.isArray(wines)) return [];
    return wines.map((wine) => {
      if (!wine || typeof wine !== "object") return wine;
      const variety =
        seedVarietyForId(wine.id, wine.name, wine.type, wine.country) ||
        varietyForName(wine.name, wine.type, wine.country);
      const photo = defaultPhotoForWineId(wine.id) || defaultPhotoForWineName(wine.name);
      const updates = {};
      const preserveEditedSeedFields =
        /^seed-\d{3}$/.test(wine.id || "") && wine.userModified;
      if (variety && !preserveEditedSeedFields && !(wine.variety || "").trim()) {
        updates.variety = variety;
      }
      const explicitEmptySeedPhoto =
        /^seed-\d{3}$/.test(wine.id || "") &&
        Object.prototype.hasOwnProperty.call(wine, "photo") &&
        !(wine.photo || "").trim();
      if (
        photo &&
        !wine.photoRemoved &&
        !explicitEmptySeedPhoto &&
        (!(wine.photo || "").trim() || isDefaultPhoto(wine.photo))
      ) {
        updates.photo = photo;
      }
      if (!photo && isDefaultPhoto(wine.photo)) updates.photo = null;
      if (!DEFAULT_PHOTO_AUTOFILL_ENABLED && isDefaultPhoto(wine.photo)) updates.photo = null;
      return Object.keys(updates).length ? Object.assign({}, wine, updates) : wine;
    });
  }

  function emptyTasting(status) {
    return {
      status: status || TASTING_STATUS.UNKNOWN,
      rating: null,
      drunkDate: "",
      note: "",
    };
  }

  function normalizeTasting(input, fallbackStatus) {
    const source = input && typeof input === "object" ? input : {};
    const status =
      source.status === TASTING_STATUS.DRUNK ||
      source.status === TASTING_STATUS.SKIPPED ||
      source.status === TASTING_STATUS.UNKNOWN
        ? source.status
        : fallbackStatus || TASTING_STATUS.UNKNOWN;
    const rating = Number(source.rating);
    return {
      status,
      rating: status === TASTING_STATUS.DRUNK && rating > 0 ? rating : null,
      drunkDate: status === TASTING_STATUS.DRUNK ? source.drunkDate || "" : "",
      note: status === TASTING_STATUS.DRUNK ? source.note || "" : "",
    };
  }

  function legacyTastingForWine(wine) {
    if (!wine || wine.status !== "drunk") return emptyTasting();
    return normalizeTasting(
      {
        status: TASTING_STATUS.DRUNK,
        rating: wine.rating,
        drunkDate: wine.drunkDate,
        note: wine.note,
      },
      TASTING_STATUS.DRUNK
    );
  }

  function normalizeWineTastings(wine) {
    if (!wine || typeof wine !== "object") return wine;
    const raw = wine.tastings && typeof wine.tastings === "object" ? wine.tastings : {};
    const next = Object.assign({}, wine);
    const tastings = {};
    TASTERS.forEach((person) => {
      const fallback =
        person.id === "me" && !raw[person.id]
          ? legacyTastingForWine(wine).status
          : TASTING_STATUS.UNKNOWN;
      const source = raw[person.id] || (person.id === "me" ? legacyTastingForWine(wine) : null);
      tastings[person.id] = normalizeTasting(source, fallback);
    });
    next.tastings = tastings;
    const hasKnown = TASTERS.some(
      (person) => tastings[person.id].status !== TASTING_STATUS.UNKNOWN
    );
    next.status = hasKnown ? "drunk" : next.status === "cellar" ? "cellar" : "cellar";
    next.featuredTasterId = featuredTasterIdFromTastings(
      tastings,
      wine.featuredTasterId
    );
    return syncLegacyTastingFields(next);
  }

  function normalizeWineCollection(wines) {
    return (Array.isArray(wines) ? wines : []).map(normalizeWineTastings);
  }

  function normalizeWines(wines) {
    return normalizeWineCollection(enrichWinesWithVariety(applySeedCorrections(wines)));
  }

  /* ---------- State ---------- */
  let state = {
    wines: [],
    tab: "cellar",
    typeFilters: [],
    countryFilters: [],
    varietyFilters: [],
    filterPanel: null,
    searchOpen: false,
    searchQuery: "",
    sortBy: "name",
    sortDir: "asc",
    viewMode: "list",
    lastViewedId: null,
    deletedSeedIds: [],
    syncStatus: "local",
    syncMessage: "",
    lastSyncedAt: "",
  };

  let syncDebounce = null;
  let applyingRemote = false;
  let auth = null;
  let db = null;
  let cloudFunctions = null;
  let firebaseApi = null;
  let firebaseReady = false;
  let unsubscribeCellar = null;
  let currentUser = null;
  let pendingAuditLogs = [];
  let cloudBackfillInFlight = false;
  let initialCloudSyncReady = false;
  let syncQueuedUntilInitial = false;

  function sanitizeDeletedSeedIds(value) {
    return Array.from(
      new Set(
        (Array.isArray(value) ? value : []).filter(
          (id) => typeof id === "string" && /^seed-\d{3}$/.test(id)
        )
      )
    ).sort();
  }

  function inferDeletedSeedIds(wines, seedVersion) {
    if (seedVersion !== SEED_VERSION || !Array.isArray(wines)) return [];
    const presentIds = new Set(wines.map((wine) => wine && wine.id).filter(Boolean));
    return seedWines()
      .map((seed) => seed.id)
      .filter((id) => !presentIds.has(id));
  }

  function loadDeletedSeedIds() {
    try {
      return sanitizeDeletedSeedIds(
        JSON.parse(localStorage.getItem(DELETED_SEEDS_KEY) || "[]")
      );
    } catch (error) {
      console.warn("삭제된 기본 와인 기록을 읽지 못했어요.", error);
      return [];
    }
  }

  function seedWines() {
    return SEED_TSV.trim()
      .split(/\r?\n/)
      .slice(1)
      .map((line, idx) => {
        const [status, type, country, , name, vintage] = line.split("\t");
        const trimmedName = name.trim();
        const id = `seed-${String(idx + 1).padStart(3, "0")}`;
        const canonicalName = canonicalSeedNameForId(id) || trimmedName;
        const wine = {
          id,
          status,
          name: canonicalName,
          country: country || "",
          type,
          vintage: (vintage || "").trim(),
          variety: seedVarietyForId(id, trimmedName, type, country),
          price: null,
          purchaseDate: "",
          photo: defaultPhotoForWineId(id),
        };
        if (status === "drunk") {
          wine.rating = null;
          wine.drunkDate = "";
          wine.note = "";
          wine.tastings = {
            me: emptyTasting(TASTING_STATUS.DRUNK),
            partner: emptyTasting(),
          };
        }
        return normalizeWineTastings(wine);
      });
  }

  function applySeedIfNeeded() {
    const raw = localStorage.getItem(STORE_KEY);
    const currentSeed = localStorage.getItem(SEED_KEY);
    if (raw && currentSeed === SEED_VERSION) return false;

    const seeds = seedWines();
    const deletedSeedIds = new Set(state.deletedSeedIds);
    if (raw) {
      const existing = normalizeWines(JSON.parse(raw) || []).filter(
        (wine) => !deletedSeedIds.has(wine.id)
      );
      const seedById = new Map(seeds.map((seed) => [seed.id, seed]));
      const existingIds = new Set(existing.map((w) => w.id));
      existing.forEach((wine) => {
        const seed = seedById.get(wine.id);
        if (seed && !wine.variety && seed.variety) {
          wine.variety = seed.variety;
        }
        if (
          seed &&
          wine.photo === undefined &&
          !wine.photoRemoved &&
          seed.photo
        ) {
          wine.photo = seed.photo;
        }
      });
      seeds.forEach((seed) => {
        if (!existingIds.has(seed.id) && !deletedSeedIds.has(seed.id)) {
          existing.push(seed);
        }
      });
      state.wines = normalizeWines(existing);
    } else {
      state.wines = seeds.filter((seed) => !deletedSeedIds.has(seed.id));
    }

    localStorage.setItem(STORE_KEY, JSON.stringify(state.wines));
    localStorage.setItem(SEED_KEY, SEED_VERSION);
    return true;
  }

  function loadWineData() {
    state.deletedSeedIds = loadDeletedSeedIds();
    const storedRaw = localStorage.getItem(STORE_KEY);
    const storedSeedVersion = localStorage.getItem(SEED_KEY);
    if (storedRaw && storedSeedVersion === SEED_VERSION) {
      try {
        state.deletedSeedIds = sanitizeDeletedSeedIds(
          state.deletedSeedIds.concat(
            inferDeletedSeedIds(JSON.parse(storedRaw) || [], storedSeedVersion)
          )
        );
        localStorage.setItem(DELETED_SEEDS_KEY, JSON.stringify(state.deletedSeedIds));
      } catch (error) {
        // Wine parsing below owns recovery; this migration must not hide that error.
      }
    }
    try {
      if (!applySeedIfNeeded()) {
        const raw = localStorage.getItem(STORE_KEY);
        if (raw) {
          const parsedWines = JSON.parse(raw) || [];
          const deletedSeedIds = new Set(state.deletedSeedIds);
          state.wines = normalizeWines(parsedWines).filter(
            (wine) => !deletedSeedIds.has(wine.id)
          );
          if (JSON.stringify(parsedWines) !== JSON.stringify(state.wines)) {
            localStorage.setItem(STORE_KEY, JSON.stringify(state.wines));
          }
        }
      }
    } catch (error) {
      console.warn("저장된 와인 데이터를 읽지 못해 기본 목록을 사용해요.", error);
      const deletedSeedIds = new Set(state.deletedSeedIds);
      state.wines = seedWines().filter((seed) => !deletedSeedIds.has(seed.id));
    }
  }

  function loadPreferences() {
    try {
      const pref = JSON.parse(localStorage.getItem(PREF_KEY) || "{}");
      if (["name", "country", "variety", "price", "rating"].includes(pref.sortBy)) {
        state.sortBy = pref.sortBy;
        if (pref.sortDir === "asc" || pref.sortDir === "desc") {
          state.sortDir = pref.sortDir;
        }
      }
      if (pref.viewMode === "list" || pref.viewMode === "image") {
        state.viewMode = pref.viewMode;
      }
      if (TAB_ORDER.includes(pref.tab)) {
        state.tab = pref.tab;
      }
    } catch (error) {
      // Preferences are disposable UI state. A malformed preference must never
      // replace the independently loaded wine collection.
      console.warn("화면 설정을 읽지 못해 기본 설정을 사용해요.", error);
    }
  }

  function load() {
    loadWineData();
    loadPreferences();
  }
  function savePref() {
    try {
      localStorage.setItem(
        PREF_KEY,
        JSON.stringify({
          tab: state.tab,
          sortBy: state.sortBy,
          sortDir: state.sortDir,
          viewMode: state.viewMode,
        })
      );
    } catch (e) {}
  }
  /* Persist locally; returns false if storage quota is exceeded. */
  function persistLocalOnly() {
    const previousDeletedSeedIds = localStorage.getItem(DELETED_SEEDS_KEY);
    const previousWines = localStorage.getItem(STORE_KEY);
    const restoreStorageValue = (key, value) => {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    };
    try {
      state.deletedSeedIds = sanitizeDeletedSeedIds(state.deletedSeedIds);
      localStorage.setItem(DELETED_SEEDS_KEY, JSON.stringify(state.deletedSeedIds));
      localStorage.setItem(STORE_KEY, JSON.stringify(state.wines));
      return true;
    } catch (e) {
      try {
        restoreStorageValue(DELETED_SEEDS_KEY, previousDeletedSeedIds);
        restoreStorageValue(STORE_KEY, previousWines);
      } catch (restoreError) {
        console.warn("로컬 저장 실패 후 이전 데이터를 복원하지 못했어요.", restoreError);
      }
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
  function stableStringify(value) {
    if (Array.isArray(value)) {
      return `[${value.map(stableStringify).join(",")}]`;
    }
    if (value && typeof value === "object") {
      return `{${Object.keys(value)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
        .join(",")}}`;
    }
    const primitive = JSON.stringify(value);
    return primitive === undefined ? "undefined" : primitive;
  }

  function comparableWine(wine) {
    if (!wine || typeof wine !== "object") return null;
    const fields = [
      "id",
      "status",
      "name",
      "country",
      "type",
      "vintage",
      "variety",
      "price",
      "purchaseDate",
      "photo",
      "photoRemoved",
      "rating",
      "drunkDate",
      "note",
      "tastings",
      "featuredTasterId",
    ];
    return fields.reduce((result, field) => {
      if (wine[field] !== undefined) result[field] = wine[field];
      return result;
    }, {});
  }

  let seedBaselineById = null;
  function pristineSeedWine(wine) {
    if (!wine || !/^seed-\d{3}$/.test(wine.id || "") || wine.userModified) return false;
    if (!seedBaselineById) {
      seedBaselineById = new Map(seedWines().map((seed) => [seed.id, seed]));
    }
    const seed = seedBaselineById.get(wine.id);
    return !!seed && stableStringify(comparableWine(wine)) === stableStringify(comparableWine(seed));
  }

  function modifiedTime(wine) {
    const time = Date.parse((wine && wine.clientUpdatedAt) || "");
    return Number.isFinite(time) ? time : 0;
  }

  function restoreObject(target, backup) {
    Object.keys(target || {}).forEach((key) => delete target[key]);
    Object.assign(target, JSON.parse(JSON.stringify(backup || {})));
    return target;
  }

  function markWineModified(wine) {
    if (!wine || typeof wine !== "object") return wine;
    wine.userModified = true;
    wine.clientUpdatedAt = new Date().toISOString();
    return wine;
  }

  function pickInitialSyncConflict(localWine, cloudWine) {
    const localSignature = stableStringify(localWine);
    const cloudSignature = stableStringify(cloudWine);
    if (localSignature === cloudSignature) return localWine;

    const localPristine = pristineSeedWine(localWine);
    const cloudPristine = pristineSeedWine(cloudWine);
    if (localPristine && !cloudPristine) return cloudWine;
    if (cloudPristine && !localPristine) return localWine;

    const localTime = modifiedTime(localWine);
    const cloudTime = modifiedTime(cloudWine);
    if (cloudTime && (!localTime || cloudTime > localTime)) return cloudWine;
    return localWine;
  }

  function mergeInitialCloudWines(localWines, cloudWines) {
    const cloudById = new Map(
      (Array.isArray(cloudWines) ? cloudWines : []).map((wine) => [wine.id, wine])
    );
    const merged = (Array.isArray(localWines) ? localWines : []).map((localWine) => {
      const cloudWine = cloudById.get(localWine.id);
      cloudById.delete(localWine.id);
      return cloudWine ? pickInitialSyncConflict(localWine, cloudWine) : localWine;
    });
    cloudById.forEach((wine) => merged.push(wine));
    return normalizeWines(merged);
  }

  function backupLocalBeforeFirstSync(cloudWines = []) {
    if (!state.wines.length) return true;
    try {
      localStorage.setItem(
        LOCAL_SYNC_BACKUP_KEY,
        JSON.stringify({
          createdAt: new Date().toISOString(),
          wines: state.wines,
          cloudWines: Array.isArray(cloudWines) ? cloudWines : [],
          deletedSeedIds: state.deletedSeedIds,
        })
      );
      return true;
    } catch (error) {
      console.warn("동기화 전 로컬 백업을 저장할 공간이 부족해요.", error);
      return false;
    }
  }

  function utf8ByteLength(value) {
    const text = typeof value === "string" ? value : JSON.stringify(value);
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(text).length;
    return encodeURIComponent(text).replace(/%[0-9A-F]{2}|./gi, "x").length;
  }

  function cloudDataSizeBytes(wines = state.wines, deletedSeedIds = state.deletedSeedIds) {
    return utf8ByteLength({
      version: 1,
      seedVersion: SEED_VERSION,
      updatedAt: "server-timestamp",
      updatedBy: currentUser ? currentUser.uid : "",
      wines,
      deletedSeedIds: sanitizeDeletedSeedIds(deletedSeedIds),
    });
  }

  function formatDataSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(bytes < 100 * 1024 ? 1 : 0)} KB`;
  }

  function assertCloudDataSize() {
    const bytes = cloudDataSizeBytes();
    if (bytes <= FIRESTORE_SAFE_MAX_BYTES) return bytes;
    throw new Error(
      `클라우드 동기화 데이터가 ${formatDataSize(bytes)}로 너무 커요. ` +
        "사진이 큰 와인을 수정해 사진을 줄이거나 제거한 뒤 다시 동기화해 주세요. 로컬 데이터는 그대로 보존돼요."
    );
  }

  const $ = (sel, root) => (root || document).querySelector(sel);
  const view = $("#view");
  const sheet = $("#sheet");
  const backdrop = $("#backdrop");

  const uid = () =>
    Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  function appScroller() {
    return $(".app") || document.scrollingElement || document.documentElement;
  }

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

  function localCalendarDate(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  }

  const today = () => localCalendarDate();

  function daysBetween(a, b) {
    if (!a || !b) return null;
    const d1 = new Date(a + "T00:00:00");
    const d2 = new Date(b + "T00:00:00");
    if (isNaN(d1) || isNaN(d2)) return null;
    return Math.round((d2 - d1) / 86400000);
  }

  function tasterById(id) {
    return TASTERS.find((person) => person.id === id) || TASTERS[0];
  }

  function tastingOf(wine, personId) {
    const source =
      wine && wine.tastings && typeof wine.tastings === "object"
        ? wine.tastings[personId]
        : null;
    return normalizeTasting(source, TASTING_STATUS.UNKNOWN);
  }

  function tastingEntries(wine) {
    return TASTERS.map((person) => ({
      person,
      tasting: tastingOf(wine, person.id),
    }));
  }

  function knownTastingEntries(wine) {
    return tastingEntries(wine).filter(
      (entry) => entry.tasting.status !== TASTING_STATUS.UNKNOWN
    );
  }

  function drunkTastingEntries(wine) {
    return tastingEntries(wine).filter(
      (entry) => entry.tasting.status === TASTING_STATUS.DRUNK
    );
  }

  function ratedTastingEntries(wine) {
    return drunkTastingEntries(wine).filter((entry) => Number(entry.tasting.rating) > 0);
  }

  function tasterIdExists(id) {
    return TASTERS.some((person) => person.id === id);
  }

  function featuredTasterIdFromTastings(tastings, preferredId) {
    const entries = TASTERS.map((person) => ({
      person,
      tasting: normalizeTasting(tastings && tastings[person.id], TASTING_STATUS.UNKNOWN),
    }));
    const drunkEntries = entries.filter(
      (entry) => entry.tasting.status === TASTING_STATUS.DRUNK
    );
    if (!drunkEntries.length) return "";
    if (
      tasterIdExists(preferredId) &&
      drunkEntries.some((entry) => entry.person.id === preferredId)
    ) {
      return preferredId;
    }
    return drunkEntries[0].person.id;
  }

  function featuredTasterIdFor(wine) {
    return featuredTasterIdFromTastings(wine && wine.tastings, wine?.featuredTasterId);
  }

  function wineAverageRating(wine) {
    const rated = ratedTastingEntries(wine);
    if (!rated.length) return null;
    const avg =
      rated.reduce((sum, entry) => sum + Number(entry.tasting.rating), 0) / rated.length;
    return Math.round(avg * 10) / 10;
  }

  function featuredTastingEntry(wine) {
    const featuredId = featuredTasterIdFor(wine);
    const preferred = featuredId
      ? {
          person: tasterById(featuredId),
          tasting: tastingOf(wine, featuredId),
        }
      : null;
    if (preferred && preferred.tasting.status === TASTING_STATUS.DRUNK) {
      return preferred;
    }
    return drunkTastingEntries(wine)[0] || null;
  }

  function wineDisplayRating(wine) {
    const entry = featuredTastingEntry(wine);
    const rating = Number(entry?.tasting.rating);
    return rating > 0 ? rating : null;
  }

  function primaryTasting(wine) {
    return (
      tastingOf(wine, "me").status === TASTING_STATUS.DRUNK
        ? tastingOf(wine, "me")
        : drunkTastingEntries(wine)[0]?.tasting
    ) || emptyTasting();
  }

  function tastingNotesText(wine) {
    return drunkTastingEntries(wine)
      .map((entry) => entry.tasting.note || "")
      .filter(Boolean)
      .join(" ");
  }

  function applyWineStatusFromTastings(wine) {
    const hasKnown = knownTastingEntries(wine).length > 0;
    wine.status = hasKnown ? "drunk" : "cellar";
    return wine;
  }

  function syncLegacyTastingFields(wine) {
    if (!wine || typeof wine !== "object") return wine;
    wine.featuredTasterId = featuredTasterIdFor(wine);
    const displayRating = wineDisplayRating(wine);
    const primary = primaryTasting(wine);
    wine.rating = displayRating == null ? null : displayRating;
    wine.drunkDate = primary.drunkDate || "";
    wine.note = primary.note || "";
    applyWineStatusFromTastings(wine);
    return wine;
  }

  function updateWineTastings(wine, tastings, featuredTasterId) {
    wine.tastings = {};
    TASTERS.forEach((person) => {
      wine.tastings[person.id] = normalizeTasting(
        tastings && tastings[person.id],
        TASTING_STATUS.UNKNOWN
      );
    });
    wine.featuredTasterId = featuredTasterIdFromTastings(
      wine.tastings,
      featuredTasterId || wine.featuredTasterId
    );
    return syncLegacyTastingFields(wine);
  }

  function hasDrunkTasting(tastings) {
    return TASTERS.some(
      (person) =>
        normalizeTasting(tastings && tastings[person.id], TASTING_STATUS.UNKNOWN).status ===
        TASTING_STATUS.DRUNK
    );
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

  function starInputHTML(id) {
    const inputId = id || "starInput";
    return `<div class="star-input" id="${esc(inputId)}">
      ${[1, 2, 3, 4, 5]
        .map(
          (i) =>
            `<button type="button" class="s" data-v="${i}" aria-label="${i}점" title="왼쪽 절반은 ${(
              i - 0.5
            ).toFixed(1)}점, 오른쪽 절반은 ${i}점">★</button>`
        )
        .join("")}
    </div>`;
  }

  function starRatingFromPointer(value, clientX, left, width) {
    const full = Number(value);
    if (!Number.isFinite(clientX) || !Number.isFinite(left) || !(width > 0)) return full;
    return clientX < left + width / 2 ? full - 0.5 : full;
  }

  function bindStarInput(root, initialRating, selector) {
    let picked = Number(initialRating) || 0;
    const stars = () => root.querySelectorAll(`${selector || "#starInput"} .s`);
    const pickValue = (star, event) => {
      const value = Number(star.dataset.v);
      if (!event || typeof event.clientX !== "number") return value;
      const rect = star.getBoundingClientRect();
      return starRatingFromPointer(value, event.clientX, rect.left, rect.width);
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
        picked = Number(s.dataset.v);
        paint();
      };
      s.addEventListener("pointerdown", (e) => {
        lastPointerAt = Date.now();
        picked = pickValue(s, e);
        paint();
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

  /* Image: read a file, downscale, and resolve a JPEG data URL. */
  function processImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("사진 파일을 읽지 못했어요."));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error("지원하지 않는 사진 형식이에요."));
        img.onload = () => {
          try {
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
            const context = canvas.getContext("2d");
            if (!context) throw new Error("사진을 처리하지 못했어요.");
            context.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", 0.72));
          } catch (error) {
            reject(error);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
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
      variety: w.variety || "",
      price: w.price == null ? null : String(w.price),
      purchaseDate: w.purchaseDate || "",
      rating: w.rating == null ? null : Number(w.rating),
      drunkDate: w.drunkDate || "",
      note: w.note || "",
      tastings: JSON.stringify(w.tastings || {}),
      featuredTasterId: w.featuredTasterId || "",
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
    variety: "품종",
    price: "구입 가격",
    purchaseDate: "구입일",
    rating: "별점",
    drunkDate: "마신 날",
    note: "시음 노트",
    tastings: "사람별 기록",
    featuredTasterId: "대표 별점",
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
    const [appMod, authMod, firestoreMod, functionsMod] = await Promise.all([
      import(`${base}/firebase-app.js`),
      import(`${base}/firebase-auth.js`),
      import(`${base}/firebase-firestore.js`),
      import(`${base}/firebase-functions.js`),
    ]);
    const app = appMod.initializeApp(FIREBASE_CONFIG);
    auth = authMod.getAuth(app);
    db = firestoreMod.getFirestore(app);
    cloudFunctions = functionsMod.getFunctions(app, FIREBASE_FUNCTIONS_REGION);
    firebaseApi = {
      signInWithEmailAndPassword: authMod.signInWithEmailAndPassword,
      onAuthStateChanged: authMod.onAuthStateChanged,
      signOut: authMod.signOut,
      httpsCallable: functionsMod.httpsCallable,
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

  async function analyzeWineLabelPhoto(image) {
    if (!currentUser) {
      throw new Error("로그인 후 사진 자동 입력을 사용할 수 있어요.");
    }
    const api = await loadFirebase();
    const analyzeWineLabel = api.httpsCallable(cloudFunctions, "analyzeWineLabel", {
      timeout: 60000,
    });
    const result = await analyzeWineLabel({ image });
    return result && result.data ? result.data.suggestion : null;
  }

  function queueSyncPush(delay) {
    if (!currentUser || !firebaseReady) {
      updateSyncButton();
      return;
    }
    if (!initialCloudSyncReady) {
      syncQueuedUntilInitial = true;
      setSyncStatus("syncing", "서버의 최신 셀러 확인 후 변경사항을 저장할게요.");
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
    const deletedSeedIds = new Set(state.deletedSeedIds);
    state.wines = normalizeWines(state.wines).filter((wine) => !deletedSeedIds.has(wine.id));
    state.deletedSeedIds = sanitizeDeletedSeedIds(state.deletedSeedIds);
    assertCloudDataSize();
    await firebaseApi.setDoc(
      cellarDocRef(),
      {
        version: 1,
        seedVersion: SEED_VERSION,
        updatedAt: firebaseApi.serverTimestamp(),
        updatedBy: currentUser.uid,
        wines: state.wines,
        deletedSeedIds: state.deletedSeedIds,
      },
      { merge: true }
    );
    await flushAuditLogs();
    return true;
  }

  async function syncPush() {
    if (!currentUser || !firebaseReady) return false;
    if (!initialCloudSyncReady) {
      syncQueuedUntilInitial = true;
      return false;
    }
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

  function isServerConfirmedSnapshot(snapshot) {
    const metadata = snapshot && snapshot.metadata;
    return !(metadata && (metadata.fromCache || metadata.hasPendingWrites));
  }

  function releaseInitialCloudSyncBarrier() {
    if (initialCloudSyncReady) return;
    initialCloudSyncReady = true;
    if (syncQueuedUntilInitial) {
      syncQueuedUntilInitial = false;
      queueSyncPush(0);
    }
  }

  async function startCellarListener(user) {
    const api = await loadFirebase();
    if (unsubscribeCellar) unsubscribeCellar();
    let awaitingInitialServerSnapshot = true;
    unsubscribeCellar = api.onSnapshot(
      cellarDocRef(),
      { includeMetadataChanges: true },
      (snapshot) => {
        if (awaitingInitialServerSnapshot && !isServerConfirmedSnapshot(snapshot)) {
          setSyncStatus("syncing", "서버의 최신 셀러 데이터를 확인하는 중");
          return;
        }

        const initialServerSnapshot = awaitingInitialServerSnapshot;
        if (initialServerSnapshot) awaitingInitialServerSnapshot = false;
        if (!snapshot.exists()) {
          if (initialServerSnapshot && state.wines.length) {
            const backupSaved = backupLocalBeforeFirstSync([]);
            if (!backupSaved) {
              setSyncStatus(
                "error",
                "동기화 전 백업 공간이 부족해 최초 업로드를 중단했어요. 저장 공간을 정리한 뒤 다시 로그인해 주세요."
              );
              return;
            }
            if (!cloudBackfillInFlight) {
              cloudBackfillInFlight = true;
              setSyncStatus("syncing", "기존 로컬 셀러를 클라우드에 처음 저장하는 중");
              writeCloudWines()
                .then(() => {
                  releaseInitialCloudSyncBarrier();
                  setSyncStatus("synced", "기존 로컬 셀러를 클라우드에 저장했어요.");
                })
                .catch(handleSyncError)
                .finally(() => {
                  cloudBackfillInFlight = false;
                });
            }
          } else {
            if (initialServerSnapshot) releaseInitialCloudSyncBarrier();
            setSyncStatus("synced", "클라우드 데이터가 아직 없어요.");
          }
          return;
        }
        const data = snapshot.data() || {};
        if (!Array.isArray(data.wines)) {
          setSyncStatus("error", "클라우드 데이터 형식이 올바르지 않아요.");
          return;
        }
        const incomingDeletedSeedIds = sanitizeDeletedSeedIds(
          (Array.isArray(data.deletedSeedIds) ? data.deletedSeedIds : []).concat(
            inferDeletedSeedIds(data.wines, data.seedVersion)
          )
        );
        const mergedDeletedSeedIds = sanitizeDeletedSeedIds(
          state.deletedSeedIds.concat(incomingDeletedSeedIds)
        );
        const deletedSeedIds = new Set(mergedDeletedSeedIds);
        let normalizedWines = normalizeWines(data.wines).filter(
          (wine) => !deletedSeedIds.has(wine.id)
        );
        const cloudWinesBeforeMerge = normalizedWines.slice();
        let didInitialMerge = false;
        let backupSaved = true;
        if (
          initialServerSnapshot &&
          state.wines.length &&
          stableStringify(state.wines) !== stableStringify(normalizedWines)
        ) {
          backupSaved = backupLocalBeforeFirstSync(cloudWinesBeforeMerge);
          if (!backupSaved) {
            setSyncStatus(
              "error",
              "동기화 전 백업 공간이 부족해 로컬 목록과 클라우드 목록을 변경하지 않았어요."
            );
            return;
          }
          normalizedWines = mergeInitialCloudWines(
            state.wines.filter((wine) => !deletedSeedIds.has(wine.id)),
            normalizedWines
          ).filter((wine) => !deletedSeedIds.has(wine.id));
          didInitialMerge = true;
        }
        const incomingSignature = stableStringify(normalizedWines);
        const shouldRender =
          stableStringify(state.wines) !== incomingSignature ||
          stableStringify(state.deletedSeedIds) !== stableStringify(mergedDeletedSeedIds);
        const shouldBackfillCloud =
          didInitialMerge ||
          stableStringify(data.wines) !== incomingSignature ||
          stableStringify(incomingDeletedSeedIds) !== stableStringify(mergedDeletedSeedIds);
        const previousWines = state.wines;
        const previousDeletedSeedIds = state.deletedSeedIds;
        applyingRemote = true;
        state.deletedSeedIds = mergedDeletedSeedIds;
        if (shouldRender) {
          state.wines = normalizedWines;
          if (!persistLocalOnly()) {
            state.wines = previousWines;
            state.deletedSeedIds = previousDeletedSeedIds;
            applyingRemote = false;
            setSyncStatus("error", "저장 공간이 부족해 클라우드 변경을 적용하지 못했어요.");
            quotaAlert();
            return;
          }
        }
        applyingRemote = false;
        if (shouldRender) render();
        if (shouldBackfillCloud && backupSaved && !cloudBackfillInFlight) {
          cloudBackfillInFlight = true;
          writeCloudWines()
            .then(() => {
              if (initialServerSnapshot) releaseInitialCloudSyncBarrier();
            })
            .catch(handleSyncError)
            .finally(() => {
              cloudBackfillInFlight = false;
            });
        } else if (initialServerSnapshot) {
          releaseInitialCloudSyncBarrier();
        }
        setSyncStatus(
          "synced",
          didInitialMerge
            ? backupSaved
              ? "로컬 데이터를 백업하고 클라우드 목록과 안전하게 병합했어요."
              : "로컬 목록은 유지했지만 백업 공간 부족으로 클라우드 반영을 중단했어요."
            : "실시간 동기화 중"
        );
      },
      (error) => {
        applyingRemote = false;
        handleSyncError(error);
      }
    );
  }

  function stopCellarListener() {
    if (unsubscribeCellar) unsubscribeCellar();
    unsubscribeCellar = null;
    initialCloudSyncReady = false;
    syncQueuedUntilInitial = false;
    if (syncDebounce) {
      clearTimeout(syncDebounce);
      syncDebounce = null;
    }
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
  function syncTabButtons() {
    document.querySelectorAll(".tab").forEach((b) => {
      const active = b.dataset.tab === state.tab;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function animateTabView(direction, enterOffset = null) {
    if (!view || !direction) return;
    view.classList.remove(
      "view--tab-enter-next",
      "view--tab-enter-prev",
      "is-tab-swiping",
      "is-tab-swipe-return"
    );
    view.style.removeProperty("--tab-swipe-x");
    if (Number.isFinite(enterOffset)) {
      view.style.setProperty("--tab-enter-x", `${Math.round(enterOffset)}px`);
    } else {
      view.style.removeProperty("--tab-enter-x");
    }
    void view.offsetWidth;
    view.classList.add(
      direction === "next" ? "view--tab-enter-next" : "view--tab-enter-prev"
    );
    setTimeout(() => {
      view.classList.remove("view--tab-enter-next", "view--tab-enter-prev");
      view.style.removeProperty("--tab-enter-x");
    }, TAB_TRANSITION_MS + 40);
  }

  function setTab(tab, options = {}) {
    if (!TAB_ORDER.includes(tab)) return;
    const previousTab = state.tab;
    state.tab = tab;
    state.typeFilters = [];
    state.countryFilters = [];
    state.varietyFilters = [];
    state.filterPanel = null;
    state.searchOpen = false;
    state.searchQuery = "";
    syncTabButtons();
    savePref();
    render();
    if (options.animate && previousTab !== tab) {
      const direction =
        options.direction ||
        (TAB_ORDER.indexOf(tab) > TAB_ORDER.indexOf(previousTab) ? "next" : "prev");
      animateTabView(direction, options.enterOffset);
    }
  }

  function adjacentTabFromSwipe(deltaX) {
    const index = TAB_ORDER.indexOf(state.tab);
    if (index === -1) return null;
    const direction = deltaX < 0 ? 1 : -1;
    return TAB_ORDER[index + direction] || null;
  }

  function isTabSwipeBlockedTarget(target) {
    if (!target || sheetOpen || document.querySelector(".app-confirm")) return true;
    if (
      target.closest(
        ".sheet, .app-confirm, .tabs, .fab, .filter-options, .variety-suggest"
      )
    ) {
      return true;
    }
    if (target.closest("input, textarea, select, option, label, a, [contenteditable]")) {
      return true;
    }
    const button = target.closest("button");
    return !!button && !button.matches(".card, .wine-tile");
  }

  function setupTabSwipeNavigation() {
    let gesture = null;
    let suppressClick = false;
    let suppressClickTimer = 0;
    let swipeReturnTimer = 0;

    const swipeSettings = (dx) => {
      const isPrev = dx > 0;
      return {
        minX: isPrev ? TAB_SWIPE_PREV_MIN_X : TAB_SWIPE_NEXT_MIN_X,
        flickMinX: isPrev
          ? TAB_SWIPE_PREV_FLICK_MIN_X
          : TAB_SWIPE_NEXT_FLICK_MIN_X,
        velocity: isPrev ? TAB_SWIPE_PREV_VELOCITY : TAB_SWIPE_NEXT_VELOCITY,
        lockRatio: isPrev
          ? TAB_SWIPE_PREV_LOCK_RATIO
          : TAB_SWIPE_NEXT_LOCK_RATIO,
        finishRatio: isPrev
          ? TAB_SWIPE_PREV_FINISH_RATIO
          : TAB_SWIPE_NEXT_FINISH_RATIO,
        verticalCancelRatio: isPrev
          ? TAB_SWIPE_PREV_VERTICAL_CANCEL_RATIO
          : TAB_SWIPE_NEXT_VERTICAL_CANCEL_RATIO,
      };
    };

    const tabsNav = document.querySelector(".tabs");
    const tabButtonFor = (tab) => document.querySelector(`.tab[data-tab="${tab}"]`);

    const measureTabIndicator = (tab) => {
      const button = tabButtonFor(tab);
      if (!tabsNav || !button) return null;
      const navRect = tabsNav.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      return {
        x: buttonRect.left - navRect.left,
        w: buttonRect.width,
        lineX: buttonRect.left - navRect.left + buttonRect.width / 2 - 7,
      };
    };

    const clearTabIndicator = () => {
      if (!tabsNav) return;
      tabsNav.classList.remove(
        "is-tab-indicator-active",
        "is-tab-indicator-settling"
      );
      tabsNav.style.removeProperty("--tab-indicator-opacity");
      tabsNav.style.removeProperty("--tab-indicator-x");
      tabsNav.style.removeProperty("--tab-indicator-w");
      tabsNav.style.removeProperty("--tab-indicator-line-x");
      tabsNav.style.removeProperty("--tab-settle-ms");
      document.querySelectorAll(".tab.is-swipe-source, .tab.is-swipe-target").forEach((tab) => {
        tab.classList.remove("is-swipe-source", "is-swipe-target");
      });
    };

    const setupTabIndicator = (track) => {
      if (!tabsNav) return;
      track.sourceMetrics = measureTabIndicator(track.sourceTab);
      track.targetMetrics = measureTabIndicator(track.nextTab);
      const sourceButton = tabButtonFor(track.sourceTab);
      const targetButton = tabButtonFor(track.nextTab);
      if (!track.sourceMetrics || !track.targetMetrics || !sourceButton || !targetButton) {
        clearTabIndicator();
        return;
      }
      sourceButton.classList.add("is-swipe-source");
      targetButton.classList.add("is-swipe-target");
      tabsNav.classList.add("is-tab-indicator-active");
      tabsNav.style.setProperty("--tab-indicator-opacity", "1");
    };

    const setTabIndicatorProgress = (track, progress, settling = false) => {
      if (!tabsNav || !track.sourceMetrics || !track.targetMetrics) return;
      const p = Math.max(0, Math.min(1, progress));
      const x =
        track.sourceMetrics.x + (track.targetMetrics.x - track.sourceMetrics.x) * p;
      const w =
        track.sourceMetrics.w + (track.targetMetrics.w - track.sourceMetrics.w) * p;
      const lineX =
        track.sourceMetrics.lineX +
        (track.targetMetrics.lineX - track.sourceMetrics.lineX) * p;
      tabsNav.classList.toggle("is-tab-indicator-settling", settling);
      tabsNav.style.setProperty("--tab-indicator-x", `${Math.round(x)}px`);
      tabsNav.style.setProperty("--tab-indicator-w", `${Math.round(w)}px`);
      tabsNav.style.setProperty("--tab-indicator-line-x", `${Math.round(lineX)}px`);
    };

    const tabIndicatorProgressFor = (track, x = track.currentX) => {
      if (!track?.width) return 0;
      return Math.max(0, Math.min(1, Math.abs(x - track.baseX) / track.width));
    };

    const clearSwipeProps = () => {
      view.classList.remove(
        "is-tab-swiping",
        "is-tab-swipe-return",
        "is-tab-track-active"
      );
      view.style.removeProperty("--tab-swipe-x");
    };

    const navigationSnapshot = () => ({
      tab: state.tab,
      typeFilters: [...state.typeFilters],
      countryFilters: [...state.countryFilters],
      varietyFilters: [...state.varietyFilters],
      filterPanel: state.filterPanel,
      searchOpen: state.searchOpen,
      searchQuery: state.searchQuery,
      sortBy: state.sortBy,
      sortDir: state.sortDir,
    });

    const restoreNavigationSnapshot = (snapshot) => {
      state.tab = snapshot.tab;
      state.typeFilters = [...snapshot.typeFilters];
      state.countryFilters = [...snapshot.countryFilters];
      state.varietyFilters = [...snapshot.varietyFilters];
      state.filterPanel = snapshot.filterPanel;
      state.searchOpen = snapshot.searchOpen;
      state.searchQuery = snapshot.searchQuery;
      state.sortBy = snapshot.sortBy;
      state.sortDir = snapshot.sortDir;
    };

    const resetNavigationForTab = (tab) => {
      state.tab = tab;
      state.typeFilters = [];
      state.countryFilters = [];
      state.varietyFilters = [];
      state.filterPanel = null;
      state.searchOpen = false;
      state.searchQuery = "";
    };

    const paneHTML = (html) => html.replace(/\sid=/g, " data-swipe-id=");

    const captureTabHTML = (tab) => {
      const snapshot = navigationSnapshot();
      resetNavigationForTab(tab);
      const html = tabContentHTML(tab);
      restoreNavigationSnapshot(snapshot);
      return html;
    };

    const setTrackX = (track, x, settling = false) => {
      track.currentX = x;
      track.el.style.setProperty("--tab-track-x", `${Math.round(x)}px`);
      setTabIndicatorProgress(track, tabIndicatorProgressFor(track, x), settling);
    };

    const restorePaneIds = (root) => {
      root.querySelectorAll("[data-swipe-id]").forEach((node) => {
        node.id = node.dataset.swipeId;
        node.removeAttribute("data-swipe-id");
      });
    };

    const bindSettledTabContent = (tab) => {
      if (tab === "cellar") {
        const wines = cellarWines();
        if (wines.length) {
          normalizeSortForKind("cellar");
          bindListControls(wines, "cellar");
          bindCards();
        }
      } else if (tab === "drunk") {
        const wines = drunkWines();
        if (wines.length) {
          normalizeSortForKind("drunk");
          bindListControls(wines, "drunk");
          bindCards();
        }
      }
    };

    const settleSwipeToTab = (track) => {
      const pane = track.el.querySelector(`[data-swipe-tab="${track.nextTab}"]`);
      if (!pane) {
        setTab(track.nextTab);
        return;
      }
      resetNavigationForTab(track.nextTab);
      view.replaceChildren(...Array.from(pane.childNodes));
      restorePaneIds(view);
      syncTabButtons();
      savePref();
      $("#addBtn").hidden = state.tab === "stats";
      updateHeaderSub();
      bindSettledTabContent(state.tab);
    };

    const restoreSwipeToCurrent = (track) => {
      const pane =
        track.el.querySelector(`[data-swipe-tab="${track.sourceTab}"]`) ||
        track.el.querySelector('.tab-swipe-pane[aria-hidden="false"]');
      if (!pane) {
        render();
        return;
      }
      view.replaceChildren(...Array.from(pane.childNodes));
      restorePaneIds(view);
      syncTabButtons();
      $("#addBtn").hidden = state.tab === "stats";
      updateHeaderSub();
    };

    const finishSwipeTrack = (track, commit) => {
      if (!track?.el) {
        clearSwipeProps();
        if (commit && track?.nextTab) setTab(track.nextTab);
        else render();
        return;
      }
      if (swipeReturnTimer) {
        clearTimeout(swipeReturnTimer);
        swipeReturnTimer = 0;
      }
      const finalX = commit
        ? track.direction === "next"
          ? -track.width
          : 0
        : track.baseX;
      const remaining = Math.abs(finalX - (track.currentX ?? track.baseX));
      const duration = Math.round(
        Math.min(320, Math.max(170, (remaining / track.width) * TAB_TRANSITION_MS))
      );

      track.el.style.setProperty("--tab-settle-ms", `${duration}ms`);
      if (tabsNav) tabsNav.style.setProperty("--tab-settle-ms", `${duration}ms`);
      track.el.classList.add("is-settling");
      setTrackX(track, finalX, true);
      swipeReturnTimer = setTimeout(() => {
        swipeReturnTimer = 0;
        clearSwipeProps();
        if (commit) {
          settleSwipeToTab(track);
        } else {
          restoreSwipeToCurrent(track);
        }
        clearTabIndicator();
      }, duration + 40);
    };

    const buildSwipeTrack = (nextTab, direction) => {
      const nextHTML = paneHTML(captureTabHTML(nextTab));
      const width = Math.max(
        1,
        Math.round(view.getBoundingClientRect().width || window.innerWidth || 1)
      );
      const baseX = direction === "next" ? 0 : -width;
      const currentPane = document.createElement("section");
      const nextPane = document.createElement("section");
      const track = document.createElement("div");

      currentPane.className = "tab-swipe-pane";
      currentPane.dataset.swipeTab = state.tab;
      currentPane.setAttribute("aria-hidden", "false");
      nextPane.className = "tab-swipe-pane";
      nextPane.dataset.swipeTab = nextTab;
      nextPane.setAttribute("aria-hidden", "true");
      nextPane.innerHTML = nextHTML;
      while (view.firstChild) currentPane.appendChild(view.firstChild);
      track.className = "tab-swipe-track";
      track.style.setProperty("--tab-track-x", `${baseX}px`);
      if (direction === "next") {
        track.append(currentPane, nextPane);
      } else {
        track.append(nextPane, currentPane);
      }

      view.classList.remove(
        "view--tab-enter-next",
        "view--tab-enter-prev",
        "is-tab-swipe-return"
      );
      view.style.removeProperty("--tab-swipe-x");
      view.appendChild(track);
      view.classList.add("is-tab-track-active", "is-tab-swiping");

      const el = track;
      if (!el) return null;
      const swipeTrack = {
        el,
        sourceTab: state.tab,
        nextTab,
        direction,
        width,
        baseX,
        currentX: baseX,
      };
      setupTabIndicator(swipeTrack);
      setTabIndicatorProgress(swipeTrack, 0);
      return swipeTrack;
    };

    const ensureSwipeTrack = (dx) => {
      if (gesture.track) return gesture.track;
      const nextTab = adjacentTabFromSwipe(dx);
      if (!nextTab) return null;
      const direction = dx < 0 ? "next" : "prev";
      gesture.track = buildSwipeTrack(nextTab, direction);
      return gesture.track;
    };

    const clearSwipeVisual = (animateBack = false) => {
      if (swipeReturnTimer) {
        clearTimeout(swipeReturnTimer);
        swipeReturnTimer = 0;
      }
      if (gesture?.track) {
        if (animateBack) {
          finishSwipeTrack(gesture.track, false);
        } else {
          clearSwipeProps();
          restoreSwipeToCurrent(gesture.track);
          clearTabIndicator();
        }
        return;
      }
      if (!animateBack) {
        clearSwipeProps();
        return;
      }
      view.classList.add("is-tab-swipe-return");
      view.style.setProperty("--tab-swipe-x", "0px");
      swipeReturnTimer = setTimeout(() => {
        clearSwipeProps();
        swipeReturnTimer = 0;
      }, 190);
    };

    const setSwipeVisual = (dx) => {
      const track = ensureSwipeTrack(dx);
      if (track) {
        const offset = Math.max(-track.width, Math.min(0, track.baseX + dx));
        view.classList.add("is-tab-swiping");
        setTrackX(track, offset);
        gesture.visualOffset = Math.round(offset);
        return;
      }
      const offset = Math.max(
        -TAB_SWIPE_EDGE_MAX,
        Math.min(TAB_SWIPE_EDGE_MAX, dx * 0.16)
      );
      view.classList.add("is-tab-swiping");
      view.style.setProperty("--tab-swipe-x", `${Math.round(offset)}px`);
      gesture.visualOffset = Math.round(offset);
    };

    const holdSwipeScroll = () => {
      if (!gesture?.scroller) return;
      gesture.scroller.scrollTop = gesture.startScrollTop;
    };

    const suppressNextClick = () => {
      suppressClick = true;
      if (suppressClickTimer) clearTimeout(suppressClickTimer);
      suppressClickTimer = setTimeout(() => {
        suppressClick = false;
        suppressClickTimer = 0;
      }, 450);
    };

    const begin = (point, target, pointerId = null) => {
      if (swipeReturnTimer) return;
      if (isTabSwipeBlockedTarget(target)) return;
      const scroller = appScroller();
      gesture = {
        startX: point.clientX,
        startY: point.clientY,
        lastX: point.clientX,
        lastY: point.clientY,
        startScrollTop: scroller.scrollTop,
        scroller,
        startedAt: Date.now(),
        lastMoveAt: Date.now(),
        pointerId,
        active: false,
        track: null,
      };
    };

    const move = (point, e) => {
      if (!gesture) return;
      const dx = point.clientX - gesture.startX;
      const dy = point.clientY - gesture.startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (!gesture.active) {
        if (absX < 10 && absY < 10) return;
        const settings = swipeSettings(dx);
        const verticalDominant =
          absY >= TAB_SWIPE_VERTICAL_CANCEL_Y &&
          absY > absX * settings.verticalCancelRatio;
        if (verticalDominant) {
          clearSwipeVisual(false);
          gesture = null;
          return;
        }
        if (absX >= 10 && absX > absY * settings.lockRatio) {
          gesture.active = true;
          holdSwipeScroll();
          if (gesture.pointerId != null && view.setPointerCapture) {
            try {
              view.setPointerCapture(gesture.pointerId);
            } catch (err) {}
          }
        }
      }

      if (!gesture.active) return;
      gesture.lastX = point.clientX;
      gesture.lastY = point.clientY;
      gesture.lastMoveAt = Date.now();
      holdSwipeScroll();
      setSwipeVisual(dx);
      e.preventDefault();
    };

    const finish = (point, e) => {
      if (!gesture) return;
      const dx = (point?.clientX ?? gesture.lastX) - gesture.startX;
      const dy = (point?.clientY ?? gesture.lastY) - gesture.startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const elapsed = Math.max(1, Date.now() - gesture.startedAt);
      const velocity = absX / elapsed;
      const settings = swipeSettings(dx);
      const isFlick =
        absX >= settings.flickMinX && velocity >= settings.velocity;
      const horizontalIntent =
        gesture.active && absX > absY * settings.finishRatio;
      const track = gesture.track;
      const directionConsistent =
        !track || (track.direction === "next" ? dx < 0 : dx > 0);
      const shouldSwitch =
        horizontalIntent && directionConsistent && (absX >= settings.minX || isFlick);
      const nextTab = shouldSwitch
        ? track?.nextTab || adjacentTabFromSwipe(dx)
        : null;

      if (horizontalIntent && absX >= 18) {
        suppressNextClick();
        if (e?.preventDefault) e.preventDefault();
      }
      if (track) {
        finishSwipeTrack(track, !!nextTab);
      } else {
        clearSwipeVisual(!nextTab && horizontalIntent);
      }
      if (nextTab && !track) {
        holdSwipeScroll();
        setTab(nextTab, { animate: true, direction: dx < 0 ? "next" : "prev" });
      }

      if (gesture.pointerId != null && view.releasePointerCapture) {
        try {
          view.releasePointerCapture(gesture.pointerId);
        } catch (err) {}
      }
      gesture = null;
    };

    view.addEventListener(
      "click",
      (e) => {
        if (!suppressClick) return;
        suppressClick = false;
        if (suppressClickTimer) {
          clearTimeout(suppressClickTimer);
          suppressClickTimer = 0;
        }
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );

    if (window.PointerEvent) {
      view.addEventListener(
        "pointerdown",
        (e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          begin(e, e.target, e.pointerId);
        },
        { passive: true }
      );
      view.addEventListener(
        "pointermove",
        (e) => {
          if (!gesture || gesture.pointerId !== e.pointerId) return;
          move(e, e);
        },
        { passive: false }
      );
      view.addEventListener(
        "pointerup",
        (e) => {
          if (!gesture || gesture.pointerId !== e.pointerId) return;
          finish(e, e);
        },
        { passive: false }
      );
      view.addEventListener("pointercancel", () => {
        clearSwipeVisual(true);
        gesture = null;
      });
      return;
    }

    view.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) return;
        begin(e.touches[0], e.target);
      },
      { passive: true }
    );
    view.addEventListener(
      "touchmove",
      (e) => {
        if (!gesture || e.touches.length !== 1) return;
        move(e.touches[0], e);
      },
      { passive: false }
    );
    view.addEventListener(
      "touchend",
      (e) => finish(e.changedTouches[0], e),
      { passive: false }
    );
    view.addEventListener("touchcancel", () => {
      clearSwipeVisual(true);
      gesture = null;
    });
  }

  function scrollCurrentTabToTop() {
    const scroller = appScroller();
    if (scroller && scroller.scrollTo) {
      scroller.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scroller.scrollTop = 0;
    }
  }

  function render() {
    syncTabButtons();
    if (state.tab === "cellar") renderCellar();
    else if (state.tab === "drunk") renderDrunk();
    else renderStats();
    $("#addBtn").hidden = state.tab === "stats";
    updateHeaderSub();
  }

  function markViewedCard() {
    view.querySelectorAll(".card[data-id], .wine-tile[data-id]").forEach((card) => {
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

  function trashIconHTML() {
    return `<svg class="detail-actions__delete-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 6h18"></path>
      <path d="M8 6V4h8v2"></path>
      <path d="M6.5 6l1 15h9l1-15"></path>
      <path d="M10 10v7"></path>
      <path d="M14 10v7"></path>
    </svg>`;
  }

  function cellarReturnIconHTML() {
    return `<svg class="detail-actions__delete-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.5 7.5H4.25V4.25"></path>
      <path d="M4.55 7.25a7.3 7.3 0 1 1 1.95 7.25"></path>
    </svg>`;
  }

  function personMarkHTML(person, tasting, featured, variant) {
    const status = tasting.status;
    if (status === TASTING_STATUS.UNKNOWN) return "";
    const isFeatured = featured && status === TASTING_STATUS.DRUNK;
    const title =
      isFeatured
        ? `${person.label} 마심, 대표 별점`
        : status === TASTING_STATUS.DRUNK
        ? `${person.label} 마심`
        : `${person.label} 안마심`;
    const isDot = variant === "row" || variant === "tile";
    if (isDot) {
      return `<span class="person-mark person-mark--dot person-mark--${person.className} ${
        status === TASTING_STATUS.SKIPPED ? "person-mark--skipped" : ""
      } ${
        featured ? "person-mark--featured" : ""
      }" title="${esc(title)}" aria-label="${esc(title)}"></span>`;
    }
    return `<span class="person-mark person-mark--${person.className} ${
      status === TASTING_STATUS.SKIPPED ? "person-mark--skipped" : ""
    } ${
      featured ? "person-mark--featured" : ""
    }" title="${esc(title)}" aria-label="${esc(title)}">${esc(person.short)}</span>`;
  }

  function tastingMarksHTML(wine, variant) {
    const featuredId = featuredTasterIdFor(wine);
    const marks = tastingEntries(wine)
      .map((entry) =>
        personMarkHTML(
          entry.person,
          entry.tasting,
          entry.person.id === featuredId && entry.tasting.status === TASTING_STATUS.DRUNK,
          variant
        )
      )
      .filter(Boolean)
      .join("");
    return marks
      ? `<span class="person-marks ${
          variant ? `person-marks--${variant}` : ""
        }">${marks}</span>`
      : "";
  }

  function sortDefaultDir(key) {
    return key === "name" || key === "country" || key === "variety" ? "asc" : "desc";
  }

  function sortOptionsFor(kind) {
    return kind === "drunk"
      ? [
          ["name", "이름순"],
          ["country", "국가순"],
          ["variety", "품종순"],
          ["rating", "별점순"],
        ]
      : [
          ["name", "이름순"],
          ["country", "국가순"],
          ["variety", "품종순"],
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

  function countVarieties(wines) {
    return wines.reduce((acc, wine) => {
      new Set(varietyParts(wine)).forEach((variety) => {
        acc[variety] = (acc[variety] || 0) + 1;
      });
      return acc;
    }, {});
  }

  function optionBaseWines(wines, skip) {
    return wines.filter((w) => {
      if (
        skip !== "type" &&
        state.typeFilters.length &&
        !state.typeFilters.includes(w.type)
      ) {
        return false;
      }
      if (
        skip !== "country" &&
        state.countryFilters.length &&
        !state.countryFilters.includes(w.country || "ETC")
      ) {
        return false;
      }
      if (
        skip !== "variety" &&
        state.varietyFilters.length &&
        !varietyParts(w).some((variety) => state.varietyFilters.includes(variety))
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
        tastingNotesText(w),
        w.variety,
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
    return filterOptionButton("type", "all", "전체", !state.typeFilters.length, base.length)
      + ids
        .map((id) => {
          const t = typeOf(id);
          return filterOptionButton(
            "type",
            id,
            `${typeIconHTML(id, "option")}<span>${t.label}</span>`,
            state.typeFilters.includes(id),
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
    return filterOptionButton("country", "all", "전체", !state.countryFilters.length, base.length)
      + codes
        .map((code) => {
          const c = countryOf(code);
          const label = `${flagBadge(code)}<span>${c ? esc(c.name) : "기타"}</span>`;
          return filterOptionButton(
            "country",
            code,
            label,
            state.countryFilters.includes(code),
            counts[code]
          );
        })
        .join("");
  }

  function varietyOptionsHTML(wines) {
    const base = optionBaseWines(wines, "variety");
    const counts = countVarieties(base);
    const varieties = Object.keys(counts).sort((a, b) => a.localeCompare(b, "ko"));
    return filterOptionButton("variety", "all", "전체", !state.varietyFilters.length, base.length)
      + varieties
        .map((variety) =>
          filterOptionButton(
            "variety",
            variety,
            `<span>${esc(variety)}</span>`,
            state.varietyFilters.includes(variety),
            counts[variety]
          )
        )
        .join("");
  }

  function filterOptionButton(kind, value, labelHTML, active, count) {
    const attr =
      kind === "type"
        ? "data-type-filter"
        : kind === "country"
        ? "data-country-filter"
        : kind === "variety"
        ? "data-variety-filter"
        : "data-sort";
    const countHTML =
      count === "" || count == null
        ? ""
        : `<span class="filter-option__count">${count}</span>`;
    return `<button class="filter-option ${active ? "is-active" : ""}" ${attr}="${esc(
      value
    )}" aria-pressed="${active ? "true" : "false"}"><span class="filter-option__label">${labelHTML}</span>${countHTML}</button>`;
  }

  function sortOptionsHTML(kind) {
    return sortOptionsFor(kind)
      .map(([key, label]) =>
        filterOptionButton(
          "sort",
          key,
          `<span>${label}</span>${state.sortBy === key ? sortArrow(key) : ""}`,
          state.sortBy === key,
          ""
        )
      )
      .join("");
  }

  function filterSectionHTML(title, body) {
    return `<div class="filter-section-title">${title}</div>${body}`;
  }

  function filterPanelHTML(wines, kind) {
    if (!state.filterPanel) return "";
    const options =
      state.filterPanel === "filter"
        ? filterSectionHTML("종류", typeOptionsHTML(wines))
          + filterSectionHTML("국가", countryOptionsHTML(wines))
          + filterSectionHTML("품종", varietyOptionsHTML(wines))
        : sortOptionsHTML(kind);
    return `<button class="filter-dismiss" type="button" data-filter-dismiss aria-label="필터 닫기"></button><div class="filter-options filter-options--${state.filterPanel}">${options}</div>`;
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

  function viewModeControlsHTML() {
    return `<div class="view-mode" role="group" aria-label="보기 방식">
      <button class="view-mode__btn ${
        state.viewMode === "list" ? "is-active" : ""
      }" type="button" data-view-mode="list" aria-pressed="${
        state.viewMode === "list" ? "true" : "false"
      }">리스트</button>
      <button class="view-mode__btn ${
        state.viewMode === "image" ? "is-active" : ""
      }" type="button" data-view-mode="image" aria-pressed="${
        state.viewMode === "image" ? "true" : "false"
      }">이미지</button>
    </div>`;
  }

  function listControlsHTML(wines, kind) {
    const activeFilterCount =
      state.typeFilters.length + state.countryFilters.length + state.varietyFilters.length;
    const activeFilter = activeFilterCount > 0;
    const activeSearch = !!state.searchQuery.trim();
    const filterLabel = activeFilter ? `필터 ${activeFilterCount}` : "필터";
    return `
      <div class="list-controls">
        ${viewModeControlsHTML()}
        <div class="filterbar">
          <button class="chip chip--search ${
            state.searchOpen || activeSearch ? "is-active" : ""
          }" data-search-toggle aria-label="와인 검색" aria-pressed="${
            state.searchOpen || activeSearch ? "true" : "false"
          }">${searchIconHTML()}</button>
          <button class="chip chip--filter ${
            state.filterPanel === "filter" || activeFilter ? "is-active" : ""
          }" data-filter-panel="filter"><span class="chip__label">${filterLabel}</span></button>
          <button class="chip chip--sort ${
            state.filterPanel === "sort" ? "is-active" : ""
          }" data-filter-panel="sort"><span class="chip__label">정렬</span></button>
        </div>
        ${searchPanelHTML()}
        ${filterPanelHTML(wines, kind)}
      </div>
      `;
  }

  function compareWineList(a, b) {
    const dir = state.sortDir === "asc" ? 1 : -1;
    if (state.sortBy === "country") {
      const ac = countryOf(a.country);
      const bc = countryOf(b.country);
      const an = ac ? ac.name : "기타";
      const bn = bc ? bc.name : "기타";
      return an.localeCompare(bn, "ko") * dir || a.name.localeCompare(b.name, "ko");
    }
    if (state.sortBy === "variety") {
      const av = primaryVariety(a);
      const bv = primaryVariety(b);
      if (!av && !bv) return a.name.localeCompare(b.name, "ko");
      if (!av) return 1;
      if (!bv) return -1;
      return av.localeCompare(bv, "ko") * dir || a.name.localeCompare(b.name, "ko");
    }
    if (state.sortBy === "price") {
      const ap = a.price == null || a.price === "" || isNaN(a.price) ? null : Number(a.price);
      const bp = b.price == null || b.price === "" || isNaN(b.price) ? null : Number(b.price);
      if (ap == null && bp == null) return a.name.localeCompare(b.name, "ko");
      if (ap == null) return 1;
      if (bp == null) return -1;
      return (ap - bp) * dir || a.name.localeCompare(b.name, "ko");
    }
    if (state.sortBy === "rating") {
      const ar = wineDisplayRating(a);
      const br = wineDisplayRating(b);
      if (ar == null && br == null) return a.name.localeCompare(b.name, "ko");
      if (ar == null) return 1;
      if (br == null) return -1;
      return (ar - br) * dir || a.name.localeCompare(b.name, "ko");
    }
    return a.name.localeCompare(b.name, "ko") * dir;
  }

  function listResultsHTML(wines, kind) {
    const filtered = applyListFilters(wines).sort(compareWineList);
    if (!filtered.length) return `<div class="filtered-empty">조건에 맞는 와인이 없어요.</div>`;
    if (state.viewMode === "image") {
      return (
        '<div class="image-grid">' +
        filtered.map((w) => wineImageTile(w, kind)).join("") +
        "</div>"
      );
    }
    return '<div class="list">' + filtered.map((w) => wineRow(w, kind)).join("") + "</div>";
  }

  function refreshListResults(wines, kind) {
    const results = $("#wineListResults", view);
    if (!results) return;
    results.innerHTML = listResultsHTML(wines, kind);
    bindCards();
  }

  /* shared list renderer for cellar / drunk tabs */
  function listHTML(wines, kind) {
    normalizeSortForKind(kind);
    if (state.viewMode !== "list" && state.viewMode !== "image") state.viewMode = "list";
    let html = listControlsHTML(wines, kind);
    html += `<div id="wineListResults">${listResultsHTML(wines, kind)}</div>`;
    return html;
  }

  function renderList(wines, kind) {
    const html = listHTML(wines, kind);
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
    const displayRating = wineDisplayRating(w);
    const right =
      kind === "drunk"
        ? `${tastingMarksHTML(w, "row")}<span class="card__rating">${starsHTML(
            displayRating || 0
          )}</span>`
        : `<span class="card__price">${won(w.price)}</span>`;
    const variety = w.variety ? `<span class="card__sub">${esc(w.variety)}</span>` : "";
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
        ${variety}
      </button>`;
  }

  function wineImageTile(w, kind) {
    const viewed = w.id === state.lastViewedId ? " is-viewed" : "";
    const vint = w.vintage ? ` ${w.vintage}` : "";
    const label = `${w.name}${vint}`;
    const photo = w.photo
      ? `<img class="wine-tile__photo" src="${esc(w.photo)}" alt="${esc(label)}" loading="lazy" />`
      : `<span class="wine-tile__placeholder" aria-hidden="true">${typeIconHTML(
          w.type,
          "detail"
        )}</span>`;
    const meta =
      kind === "drunk"
        ? `<span class="wine-tile__rating">${starsHTML(wineDisplayRating(w) || 0)}</span>`
        : `<span class="wine-tile__name">${esc(w.name)}</span>`;
    return `<button class="wine-tile wine-tile--${kind}${viewed}" type="button" data-id="${
      w.id
    }" aria-label="${esc(label)}">
      <span class="wine-tile__image">${photo}${tastingMarksHTML(w, "tile")}</span>
      <span class="wine-tile__meta">${meta}</span>
    </button>`;
  }

  function bindListControls(wines, kind) {
    view.querySelectorAll("[data-view-mode]").forEach((b) => {
      b.addEventListener("click", () => {
        state.viewMode = b.dataset.viewMode === "image" ? "image" : "list";
        savePref();
        render();
      });
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
    view.querySelector("[data-filter-dismiss]")?.addEventListener("click", () => {
      state.filterPanel = null;
      render();
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
        const value = b.dataset.typeFilter;
        if (value === "all") {
          state.typeFilters = [];
        } else if (state.typeFilters.includes(value)) {
          state.typeFilters = state.typeFilters.filter((id) => id !== value);
        } else {
          state.typeFilters = [...state.typeFilters, value];
        }
        render();
      });
    });
    view.querySelectorAll("[data-country-filter]").forEach((b) => {
      b.addEventListener("click", () => {
        const value = b.dataset.countryFilter;
        if (value === "all") {
          state.countryFilters = [];
        } else if (state.countryFilters.includes(value)) {
          state.countryFilters = state.countryFilters.filter((code) => code !== value);
        } else {
          state.countryFilters = [...state.countryFilters, value];
        }
        render();
      });
    });
    view.querySelectorAll("[data-variety-filter]").forEach((b) => {
      b.addEventListener("click", () => {
        const value = b.dataset.varietyFilter;
        if (value === "all") {
          state.varietyFilters = [];
        } else if (state.varietyFilters.includes(value)) {
          state.varietyFilters = state.varietyFilters.filter((variety) => variety !== value);
        } else {
          state.varietyFilters = [...state.varietyFilters, value];
        }
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
  function cellarWines() {
    return state.wines.filter((w) => w.status === "cellar");
  }

  function cellarContentHTML() {
    const wines = cellarWines();
    if (!wines.length) {
      return emptyState(
        "🍷",
        "셀러가 비어 있어요",
        "아래 오른쪽 추가 버튼으로 보유한 와인을 등록해 보세요."
      );
    }
    return listHTML(wines, "cellar");
  }

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
  function drunkWines() {
    return state.wines.filter((w) => w.status === "drunk");
  }

  function drunkContentHTML() {
    const wines = drunkWines();
    if (!wines.length) {
      return emptyState(
        "🍾",
        "아직 마신 와인이 없어요",
        "셀러에서 와인을 열고 마셨어요를 누르면 여기에 기록돼요."
      );
    }
    return listHTML(wines, "drunk");
  }

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
  function statsContentHTML() {
    const cellar = state.wines.filter((w) => w.status === "cellar");
    const drunk = state.wines.filter((w) => w.status === "drunk");

    const cellarValue = cellar.reduce((s, w) => s + (Number(w.price) || 0), 0);
    const spentTotal = state.wines.reduce(
      (s, w) => s + (Number(w.price) || 0),
      0
    );
    const tastingRows = state.wines.flatMap((wine) =>
      tastingEntries(wine).map((entry) => ({
        wine,
        person: entry.person,
        tasting: entry.tasting,
      }))
    );
    const drunkRows = tastingRows.filter(
      (row) => row.tasting.status === TASTING_STATUS.DRUNK
    );
    const rated = drunkRows.filter((row) => Number(row.tasting.rating) > 0);
    const hasRatings = rated.length > 0;
    const avg = hasRatings
      ? (
          rated.reduce((s, row) => s + Number(row.tasting.rating), 0) / rated.length
        ).toFixed(1)
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
    rated.forEach((row) => {
      if (!best || row.tasting.rating > best.tasting.rating) best = row;
    });
    const total = state.wines.length;
    const cellarPct = total ? Math.round((cellar.length / total) * 100) : 0;
    const drunkPct = total ? 100 - cellarPct : 0;
    const avgText = hasRatings ? `${avg}점 평균` : "별점 기록 없음";

    if (!state.wines.length) {
      return emptyState(
        "📖",
        "기록이 없어요",
        "와인을 추가하면 컬렉션 통계가 여기에 모여요."
      );
    }

    return `
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
        ${TASTERS.map((person) => {
          const rows = tastingRows.filter((row) => row.person.id === person.id);
          const personDrunk = rows.filter(
            (row) => row.tasting.status === TASTING_STATUS.DRUNK
          );
          const personSkipped = rows.filter(
            (row) => row.tasting.status === TASTING_STATUS.SKIPPED
          );
          const personRated = personDrunk.filter(
            (row) => Number(row.tasting.rating) > 0
          );
          const personAvg = personRated.length
            ? (
                personRated.reduce(
                  (sum, row) => sum + Number(row.tasting.rating),
                  0
                ) / personRated.length
              ).toFixed(1)
            : "없음";
          return `<div class="stat">
            <div class="stat__icon">${personMarkHTML(person, {
              status: TASTING_STATUS.DRUNK,
            })}</div>
            <div class="stat__body">
              <div class="stat__label">${person.label} 기록</div>
              <div class="stat__num stat__num--text">${personAvg}</div>
              <div class="stat__hint">마심 ${personDrunk.length} · 안마심 ${personSkipped.length}</div>
            </div>
          </div>`;
        }).join("")}
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
                ${starsHTML(best.tasting.rating)}
              </div>
              <div class="best-stat__wine">
                ${flagBadge(best.wine.country)}
                <span class="best-stat__name">${esc(best.wine.name)}</span>
                <span class="best-stat__vintage">· ${esc(best.person.label)}</span>
                ${
                  best.wine.vintage
                    ? `<span class="best-stat__vintage">· ${esc(
                        best.wine.vintage
                      )}</span>`
                    : ""
                }
              </div>
            </section>`
          : ""
      }`;
  }

  function renderStats() {
    view.innerHTML = statsContentHTML();
  }

  function tabContentHTML(tab) {
    if (tab === "cellar") return cellarContentHTML();
    if (tab === "drunk") return drunkContentHTML();
    return statsContentHTML();
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
  let sheetCloseTimer = 0;
  let sheetDrag = null;
  let sheetReturnFocus = null;
  const SHEET_DRAG_ACTIVATE_DISTANCE = 4;
  const SHEET_SCROLL_TOP_TOLERANCE = 12;
  const SHEET_DISMISS_DISTANCE = 76;
  const SHEET_DISMISS_VELOCITY = 1.15;

  function lockPageScroll() {
    if (document.body.classList.contains("is-sheet-locked")) return;
    const scroller = appScroller();
    lockedScrollY = scroller.scrollTop || 0;
    document.body.classList.add("is-sheet-locked");
    scroller.style.overflow = "hidden";
  }

  function unlockPageScroll() {
    if (!document.body.classList.contains("is-sheet-locked")) return;
    const scroller = appScroller();
    document.body.classList.remove("is-sheet-locked");
    scroller.style.overflow = "";
    scroller.scrollTop = lockedScrollY;
  }

  function clearSheetDragStyles() {
    sheet.classList.remove("is-dragging");
    sheet.style.transition = "";
    sheet.style.transform = "";
    backdrop.style.opacity = "";
  }

  function focusableElements(root) {
    return Array.from(
      root.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hidden && element.getClientRects().length > 0);
  }

  function setModalBackgroundInert(inert) {
    [document.querySelector(".app"), document.querySelector(".tabs"), document.querySelector(".fab")]
      .filter(Boolean)
      .forEach((element) => {
        if (inert) element.setAttribute("inert", "");
        else element.removeAttribute("inert");
      });
  }

  function labelSheet() {
    const title = sheet.querySelector(".sheet__title, h1, h2, h3, .detail__title");
    if (title) {
      if (!title.id) title.id = `sheetTitle_${Date.now()}`;
      sheet.setAttribute("aria-labelledby", title.id);
      sheet.removeAttribute("aria-label");
    } else {
      sheet.removeAttribute("aria-labelledby");
      sheet.setAttribute("aria-label", "셀러 대화상자");
    }
  }

  function openSheet(html) {
    if (sheetCloseTimer) {
      clearTimeout(sheetCloseTimer);
      sheetCloseTimer = 0;
    }
    sheetDrag = null;
    clearSheetDragStyles();
    sheetReturnFocus =
      document.activeElement && !sheet.contains(document.activeElement)
        ? document.activeElement
        : sheetReturnFocus;
    lockPageScroll();
    setModalBackgroundInert(true);
    sheet.innerHTML = '<div class="sheet__handle" data-sheet-handle></div>' + html;
    sheet.setAttribute("tabindex", "-1");
    labelSheet();
    sheet.hidden = false;
    backdrop.hidden = false;
    sheet.scrollTop = 0;
    void sheet.offsetWidth; // force reflow for transition
    requestAnimationFrame(() => {
      sheet.scrollTop = 0;
      sheet.classList.add("is-open");
      backdrop.classList.add("is-open");
      const initialFocus = sheet.querySelector("[autofocus]") || focusableElements(sheet)[0] || sheet;
      initialFocus.focus({ preventScroll: true });
    });
    sheetOpen = true;
  }
  function closeSheet(options = {}) {
    if (!sheetOpen) return;
    const fromDrag = options.fromDrag === true;
    if (sheetCloseTimer) {
      clearTimeout(sheetCloseTimer);
      sheetCloseTimer = 0;
    }
    sheet.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    sheetOpen = false;
    sheetDrag = null;
    if (fromDrag) {
      sheet.classList.remove("is-dragging");
      sheet.style.transition = "transform 0.22s cubic-bezier(0.22, 0.85, 0.18, 1)";
      sheet.style.transform = "translate(-50%, 100%)";
      backdrop.style.opacity = "0";
    } else {
      clearSheetDragStyles();
    }
    unlockPageScroll();
    setModalBackgroundInert(false);
    const focusToRestore = sheetReturnFocus;
    sheetReturnFocus = null;
    sheetCloseTimer = setTimeout(() => {
      sheet.hidden = true;
      backdrop.hidden = true;
      sheet.innerHTML = "";
      sheet.scrollTop = 0;
      clearSheetDragStyles();
      sheetCloseTimer = 0;
      if (focusToRestore && focusToRestore.isConnected) {
        focusToRestore.focus({ preventScroll: true });
      }
    }, 260);
  }

  function onSheetKeyDown(event) {
    if (!sheetOpen || document.querySelector(".app-confirm")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeSheet();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = focusableElements(sheet);
    if (!focusables.length) {
      event.preventDefault();
      sheet.focus();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openConfirmDialog({ title, message, tone = "default" }) {
    return new Promise((resolve) => {
      const root = document.createElement("div");
      const returnFocus = document.activeElement;
      const sheetWasInert = sheet.hasAttribute("inert");
      const previousSheetAriaHidden = sheet.getAttribute("aria-hidden");
      if (sheetOpen) {
        sheet.setAttribute("inert", "");
        sheet.setAttribute("aria-hidden", "true");
      }
      const titleId = `confirmTitle_${Date.now()}`;
      const messageId = `confirmMessage_${Date.now()}`;
      root.className = `app-confirm app-confirm--${tone}`;
      root.innerHTML = `
        <div class="app-confirm__scrim" data-confirm-cancel></div>
        <section class="app-confirm__card" role="dialog" aria-modal="true" aria-labelledby="${titleId}" aria-describedby="${messageId}">
          <h2 class="app-confirm__title" id="${titleId}">${esc(title)}</h2>
          <p class="app-confirm__message" id="${messageId}">${esc(message)}</p>
          <div class="app-confirm__actions">
            <button type="button" class="btn btn--quiet" data-confirm-cancel>취소</button>
            <button type="button" class="btn btn--dark" data-confirm-ok>확인</button>
          </div>
        </section>
      `;

      let done = false;
      const finish = (confirmed) => {
        if (done) return;
        done = true;
        document.removeEventListener("keydown", onKeyDown);
        root.classList.remove("is-open");
        setTimeout(() => {
          root.remove();
          if (!sheetWasInert) sheet.removeAttribute("inert");
          if (previousSheetAriaHidden === null) sheet.removeAttribute("aria-hidden");
          else sheet.setAttribute("aria-hidden", previousSheetAriaHidden);
          if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
        }, 180);
        resolve(confirmed);
      };
      const onKeyDown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          finish(false);
          return;
        }
        if (e.key !== "Tab") return;
        const focusables = focusableElements(root);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };

      root
        .querySelectorAll("[data-confirm-cancel]")
        .forEach((btn) => btn.addEventListener("click", () => finish(false)));
      root
        .querySelector("[data-confirm-ok]")
        ?.addEventListener("click", () => finish(true));
      document.addEventListener("keydown", onKeyDown);
      document.body.appendChild(root);
      requestAnimationFrame(() => {
        root.classList.add("is-open");
        root.querySelector("[data-confirm-cancel]")?.focus();
      });
    });
  }

  function sheetTouchPoint(e) {
    return (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || null;
  }

  function isSheetHandleTarget(target, y) {
    if (target && target.closest && target.closest(".sheet__handle")) return true;
    const rect = sheet.getBoundingClientRect();
    return y - rect.top <= 54;
  }

  function settleSheetDrag() {
    sheetDrag = null;
    sheet.classList.remove("is-dragging");
    sheet.style.transition = "transform 0.22s cubic-bezier(0.22, 0.85, 0.18, 1)";
    sheet.style.transform = "translate(-50%, 0)";
    backdrop.style.opacity = "";
    setTimeout(() => {
      if (sheetOpen && !sheetDrag) clearSheetDragStyles();
    }, 200);
  }

  function onSheetTouchStart(e) {
    if (!sheetOpen || !e.touches || e.touches.length !== 1) return;
    const point = sheetTouchPoint(e);
    if (!point) return;
    sheetDrag = {
      startX: point.clientX,
      startY: point.clientY,
      lastY: point.clientY,
      dragStartY: point.clientY,
      lastPull: 0,
      startedAt: Date.now(),
      dragStartedAt: 0,
      dragging: false,
      fromHandle: isSheetHandleTarget(e.target, point.clientY),
    };
  }

  function onSheetTouchMove(e) {
    if (!sheetOpen || !sheetDrag) return;
    const point = sheetTouchPoint(e);
    if (!point) return;
    const dy = point.clientY - sheetDrag.startY;
    const dx = Math.abs(point.clientX - sheetDrag.startX);
    sheetDrag.lastY = point.clientY;

    if (!sheetDrag.dragging) {
      if (dy <= SHEET_DRAG_ACTIVATE_DISTANCE || dx > dy * 0.9) return;
      if (!sheetDrag.fromHandle && sheet.scrollTop > SHEET_SCROLL_TOP_TOLERANCE) return;
      if (sheet.scrollTop > 0) sheet.scrollTop = 0;
      sheetDrag.dragging = true;
      sheetDrag.dragStartY = point.clientY;
      sheetDrag.dragStartedAt = Date.now();
      sheetDrag.lastPull = 0;
      sheet.classList.add("is-dragging");
      sheet.style.transition = "none";
    }

    if (!sheetDrag.dragging) return;
    e.preventDefault();
    const pull = Math.max(0, point.clientY - sheetDrag.dragStartY);
    const translate = pull <= 160 ? pull : 160 + (pull - 160) * 0.35;
    sheetDrag.lastPull = translate;
    sheet.style.transform = `translate(-50%, ${Math.round(translate)}px)`;
    backdrop.style.opacity = `${Math.max(0.2, 1 - translate / 320)}`;
  }

  function onSheetTouchEnd() {
    if (!sheetDrag) return;
    const elapsed = Math.max(1, Date.now() - (sheetDrag.dragStartedAt || sheetDrag.startedAt));
    const velocity = sheetDrag.lastPull / elapsed;
    const shouldClose =
      sheetDrag.dragging &&
      (sheetDrag.lastPull >= SHEET_DISMISS_DISTANCE || velocity >= SHEET_DISMISS_VELOCITY);
    if (shouldClose) {
      closeSheet({ fromDrag: true });
    } else if (sheetDrag.dragging) {
      settleSheetDrag();
    } else {
      sheetDrag = null;
    }
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

  function tastingStatusOptionsHTML(personId, currentStatus) {
    return [
      [TASTING_STATUS.DRUNK, "마심"],
      [TASTING_STATUS.SKIPPED, "안마심"],
      [TASTING_STATUS.UNKNOWN, "미정"],
    ]
      .map(
        ([status, label]) =>
          `<button type="button" class="tasting-status ${
            currentStatus === status ? "is-active" : ""
          }" data-tasting-status="${status}" data-tasting-person="${personId}">${label}</button>`
      )
      .join("");
  }

  function tastingFormHTML(person, tasting) {
    const safe = normalizeTasting(tasting, TASTING_STATUS.UNKNOWN);
    const isActive = safe.status === TASTING_STATUS.DRUNK;
    return `<section class="tasting-form ${
      isActive ? "is-tasting-active" : ""
    }" data-tasting-form="${person.id}" data-initial-rating="${esc(safe.rating || 0)}">
      <div class="tasting-form__head">
        <span class="tasting-form__person">${personMarkHTML(person, {
          status: TASTING_STATUS.DRUNK,
        })}</span>
        <div class="tasting-statuses">
          ${tastingStatusOptionsHTML(person.id, safe.status)}
        </div>
      </div>
      <input type="hidden" name="tastingStatus_${person.id}" value="${safe.status}" />
      <div class="tasting-form__body">
        <div class="field">
          <label class="field__label">별점</label>
          ${starInputHTML(`starInput-${person.id}`)}
        </div>
        <div class="field">
          <label class="field__label">마신 날</label>
          <div class="date-row">
            <input class="input" name="drunkDate_${person.id}" type="date" value="${esc(
              safe.drunkDate || ""
            )}" />
            <button type="button" class="date-clear" data-clear-date="drunkDate_${
              person.id
            }" aria-label="마신 날 비우기" title="마신 날 비우기">-</button>
          </div>
        </div>
        <div class="field">
          <label class="field__label">시음 노트 <span class="opt">(선택)</span></label>
          <textarea class="textarea textarea--note" name="note_${
            person.id
          }" placeholder="향, 맛, 함께한 음식, 분위기…">${esc(safe.note || "")}</textarea>
        </div>
      </div>
    </section>`;
  }

  function featuredRatingFormHTML(wine, defaults) {
    const tastings = defaults || wine?.tastings || {};
    const selected = featuredTasterIdFromTastings(tastings, wine?.featuredTasterId);
    return `<div class="featured-rating" data-featured-rating>
      <span class="featured-rating__label">대표 별점</span>
      <input type="hidden" name="featuredTasterId" value="${esc(selected)}" />
      <div class="featured-rating__options">
        ${TASTERS.map((person) => {
          const tasting = normalizeTasting(tastings[person.id], TASTING_STATUS.UNKNOWN);
          const disabled = tasting.status !== TASTING_STATUS.DRUNK;
          return `<button type="button" class="featured-rating__btn ${
            selected === person.id ? "is-active" : ""
          }" data-featured-taster="${person.id}" ${
            disabled ? "disabled" : ""
          }>${personMarkHTML(person, { status: TASTING_STATUS.DRUNK })}</button>`;
        }).join("")}
      </div>
    </div>`;
  }

  function tastingsFormHTML(wine, defaults) {
    const tastingForms = TASTERS.map((person) =>
      tastingFormHTML(person, defaults?.[person.id] || tastingOf(wine, person.id))
    ).join("");
    return `${tastingForms}${featuredRatingFormHTML(wine, defaults)}`;
  }

  function setTastingFormStatus(block, status) {
    const hidden = block.querySelector('input[type="hidden"]');
    if (hidden) hidden.value = status;
    block.classList.toggle("is-tasting-active", status === TASTING_STATUS.DRUNK);
    block.querySelectorAll("[data-tasting-status]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tastingStatus === status);
    });
  }

  function bindTastingForms(root) {
    const ratingGetters = {};
    const featuredBlock = root.querySelector("[data-featured-rating]");
    const syncFeaturedRating = (preferredId) => {
      if (!featuredBlock) return;
      const hidden = featuredBlock.querySelector('input[type="hidden"]');
      const drunkIds = TASTERS.filter((person) => {
        const block = root.querySelector(`[data-tasting-form="${person.id}"]`);
        return (
          block?.querySelector('input[type="hidden"]')?.value === TASTING_STATUS.DRUNK
        );
      }).map((person) => person.id);
      let selected = preferredId || hidden?.value || "";
      if (!drunkIds.includes(selected)) selected = drunkIds[0] || "";
      if (hidden) hidden.value = selected;
      featuredBlock.querySelectorAll("[data-featured-taster]").forEach((button) => {
        const enabled = drunkIds.includes(button.dataset.featuredTaster);
        button.disabled = !enabled;
        button.classList.toggle(
          "is-active",
          enabled && button.dataset.featuredTaster === selected
        );
      });
    };
    TASTERS.forEach((person) => {
      const block = root.querySelector(`[data-tasting-form="${person.id}"]`);
      if (!block) return;
      ratingGetters[person.id] = bindStarInput(
        root,
        Number(block.dataset.initialRating) || 0,
        `#starInput-${person.id}`
      );
      block.querySelectorAll("[data-tasting-status]").forEach((button) => {
        button.addEventListener("click", () => {
          setTastingFormStatus(block, button.dataset.tastingStatus);
          syncFeaturedRating();
        });
      });
    });
    featuredBlock?.querySelectorAll("[data-featured-taster]").forEach((button) => {
      button.addEventListener("click", () => {
        syncFeaturedRating(button.dataset.featuredTaster);
      });
    });
    syncFeaturedRating();
    return ratingGetters;
  }

  function collectTastingsFromForm(form, ratingGetters) {
    const tastings = {};
    TASTERS.forEach((person) => {
      const status =
        form.elements[`tastingStatus_${person.id}`]?.value || TASTING_STATUS.UNKNOWN;
      if (status === TASTING_STATUS.DRUNK) {
        tastings[person.id] = normalizeTasting(
          {
            status,
            rating: ratingGetters[person.id] ? ratingGetters[person.id]() : null,
            drunkDate: form.elements[`drunkDate_${person.id}`]?.value || "",
            note: form.elements[`note_${person.id}`]?.value.trim() || "",
          },
          TASTING_STATUS.DRUNK
        );
      } else {
        tastings[person.id] = emptyTasting(status);
      }
    });
    return tastings;
  }

  function collectFeaturedTasterFromForm(form, tastings) {
    return featuredTasterIdFromTastings(
      tastings,
      form.elements.featuredTasterId?.value || ""
    );
  }

  function defaultDrinkTastings(wine) {
    const known = knownTastingEntries(wine);
    if (known.length) {
      const tastings = {};
      TASTERS.forEach((person) => {
        tastings[person.id] = tastingOf(wine, person.id);
      });
      return tastings;
    }
    return {
      me: normalizeTasting(
        { status: TASTING_STATUS.DRUNK, drunkDate: today() },
        TASTING_STATUS.DRUNK
      ),
      partner: emptyTasting(),
    };
  }

  /* ---------- Add / Edit form ---------- */
  function openForm(existing) {
    const w = existing || { type: "red", purchaseDate: today() };
    const isEdit = !!existing;
    const isDrunkEdit = isEdit && existing.status === "drunk";
    const selectedType = FORM_TYPE_IDS.includes(w.type) ? w.type : "red";
    const initialVariety =
      w.variety ||
      seedVarietyForId(w.id, w.name, w.type, w.country) ||
      varietyForName(w.name, w.type, w.country) ||
      "";
    let photo = (existing && existing.photo) || null;
    let lastAutoVariety = initialVariety;
    let aiBusy = false;
    let aiStatus = "";
    let photoProcessing = false;
    let photoRemoved = !!(existing && existing.photoRemoved);

    openSheet(`
      <form id="wineForm">
        <div class="form-section">
          <h2 class="form-section__title" id="wineFormTitle">와인 정보</h2>
        <div class="field field--photo">
          <label class="field__label" for="photoInput">와인 사진 <span class="opt">(선택 · 병 사진)</span></label>
          <label class="photo-drop" id="photoDrop"></label>
          <div class="photo-assist" id="photoAssist" aria-live="polite"></div>
        </div>

        <div class="field">
          <label class="field__label" for="wineName">와인 이름</label>
          <input class="input" id="wineName" name="name" placeholder="예: Château Margaux" value="${esc(
            w.name || ""
          )}" required />
        </div>

        <div class="row-2">
          <div class="field">
            <label class="field__label" for="wineVintage">빈티지 <span class="opt">(선택)</span></label>
            <input class="input" id="wineVintage" name="vintage" inputmode="numeric" placeholder="예: 2018" value="${esc(
              w.vintage || ""
            )}" />
          </div>
          <div class="field field--variety">
            <label class="field__label" for="varietyInput">품종 <span class="opt">(선택)</span></label>
            <input class="input" name="variety" id="varietyInput" autocomplete="off" placeholder="예: 샤르도네" value="${esc(
              initialVariety
            )}" />
            <div class="variety-suggest" id="varietySuggest" hidden></div>
          </div>
        </div>

        <div class="row-2">
          <div class="field">
            <label class="field__label" for="wineCountry">국가</label>
            <select class="select" id="wineCountry" name="country">
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
            <label class="field__label" for="winePrice">구입 가격 <span class="opt">(원)</span></label>
            <input class="input" id="winePrice" name="price" inputmode="numeric" placeholder="예: 85000" value="${
              w.price != null ? esc(w.price) : ""
            }" />
          </div>
        </div>

        <div class="field">
          <span class="field__label" id="wineTypeLabel">종류</span>
          <div class="choices" id="typeChoices" role="group" aria-labelledby="wineTypeLabel">
            ${formTypes().map(
              (t) =>
                `<button type="button" class="choice ${
                  selectedType === t.id ? "is-active" : ""
                }" data-type="${t.id}" aria-pressed="${
                  selectedType === t.id ? "true" : "false"
                }">${formTypeLabel(t.id)}</button>`
            ).join("")}
          </div>
          <input type="hidden" name="type" value="${selectedType}" />
        </div>

        <div class="field">
          <label class="field__label" for="winePurchaseDate">구입일</label>
          <div class="date-row">
            <input class="input" id="winePurchaseDate" name="purchaseDate" type="date" value="${esc(
              w.purchaseDate || ""
            )}" />
            <button type="button" class="date-clear" data-clear-date="purchaseDate" aria-label="구입일 비우기" title="구입일 비우기">-</button>
          </div>
        </div>
        </div>

        ${
          isDrunkEdit
            ? `<div class="form-section form-section--drink">
                <div class="form-section__title">사람별 기록</div>
                ${tastingsFormHTML(w)}
              </div>`
            : ""
        }

        <div class="btn-stack">
          <button type="button" class="btn btn--quiet" data-close>취소</button>
          <button type="submit" class="btn btn--dark" id="wineSubmitBtn">${
            isEdit ? "저장" : "등록"
          }</button>
        </div>
      </form>
    `);

    const tastingRatingGetters = isDrunkEdit ? bindTastingForms(sheet) : null;
    const form = $("#wineForm");
    const nameInput = form.elements.name;
    const vintageInput = form.elements.vintage;
    const countryInput = form.elements.country;
    const typeInput = form.elements.type;
    const varietyInput = form.elements.variety;

    function updateFormBusyState() {
      if (!form.isConnected) return;
      const busy = photoProcessing || aiBusy;
      form.setAttribute("aria-busy", busy ? "true" : "false");
      const submit = form.querySelector("#wineSubmitBtn");
      if (submit) submit.disabled = busy;
    }

    function setFormType(type) {
      if (!FORM_TYPE_IDS.includes(type)) return false;
      typeInput.value = type;
      sheet.querySelectorAll("[data-type]").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.type === type);
        b.setAttribute("aria-pressed", b.dataset.type === type ? "true" : "false");
      });
      return true;
    }

    function setInputValue(input, value) {
      const next = (value || "").trim();
      if (!input || !next) return false;
      input.value = next;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }

    function applyWineLabelSuggestion(suggestion) {
      if (!suggestion || typeof suggestion !== "object") return 0;
      let applied = 0;
      if (setInputValue(nameInput, suggestion.name)) applied += 1;
      if (setInputValue(vintageInput, suggestion.vintage)) applied += 1;
      if (
        suggestion.country &&
        COUNTRIES.some((country) => country.code === suggestion.country) &&
        setInputValue(countryInput, suggestion.country)
      ) {
        applied += 1;
      }
      if (suggestion.type && setFormType(suggestion.type)) applied += 1;
      const suggestedVariety =
        normalizeVarietyInput(suggestion.variety) ||
        varietyForName(suggestion.name, suggestion.type, suggestion.country);
      if (setInputValue(varietyInput, suggestedVariety)) {
        lastAutoVariety = varietyInput.value.trim();
        applied += 1;
      }
      return applied;
    }

    function aiErrorMessage(error) {
      const message = error && error.message ? error.message : "";
      if (message.includes("OPENAI_API_KEY")) return "아직 서버 키가 설정되지 않았어요.";
      if (message.includes("로그인")) return "로그인 후 사용할 수 있어요.";
      if (message.includes("회까지")) return message;
      return "사진 분석에 실패했어요.";
    }

    function renderPhotoAssistant() {
      const assist = sheet.querySelector("#photoAssist");
      if (!assist) return;
      if (!photo) {
        assist.innerHTML = aiStatus
          ? `<span class="photo-assist__status">${esc(aiStatus)}</span>`
          : "";
        return;
      }
      const status = aiStatus
        ? `<span class="photo-assist__status">${esc(aiStatus)}</span>`
        : "";
      assist.innerHTML = `
        <button type="button" class="photo-assist__btn" id="photoAiBtn" ${
          aiBusy || photoProcessing ? "disabled" : ""
        }>${aiBusy ? "분석 중..." : "사진으로 자동 입력"}</button>
        ${status}
      `;
      assist.querySelector("#photoAiBtn")?.addEventListener("click", async () => {
        if (aiBusy || !photo) return;
        aiBusy = true;
        aiStatus = "사진 라벨 분석 중";
        updateFormBusyState();
        renderPhotoAssistant();
        try {
          const suggestion = await analyzeWineLabelPhoto(photo);
          const applied = applyWineLabelSuggestion(suggestion);
          const confidence =
            suggestion && Number(suggestion.confidence) > 0
              ? ` · 확신도 ${Math.round(Number(suggestion.confidence) * 100)}%`
              : "";
          aiStatus = applied ? `자동 입력 완료${confidence}` : "읽을 수 있는 정보가 부족해요.";
        } catch (error) {
          aiStatus = aiErrorMessage(error);
        } finally {
          aiBusy = false;
          if (form.isConnected) {
            updateFormBusyState();
            renderPhotoAssistant();
          }
        }
      });
    }

    // ----- photo drop rendering / wiring -----
    function renderPhoto() {
      const drop = sheet.querySelector("#photoDrop");
      drop.classList.toggle("has-photo", !!photo);
      drop.innerHTML = photo
        ? `<input type="file" accept="image/*" id="photoInput" hidden />
           <img src="${photo}" alt="와인 사진" />
           <button type="button" class="photo-remove" id="photoRemove" aria-label="사진 삭제">✕</button>`
        : `<input type="file" accept="image/*" id="photoInput" hidden />
           <span>📷 와인 병 사진 찍기 / 선택</span>`;
      const photoInput = drop.querySelector("#photoInput");
      photoInput.disabled = photoProcessing;
      photoInput.addEventListener("change", async (e) => {
        if (photoProcessing) return;
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        photoProcessing = true;
        aiStatus = "사진 처리 중...";
        updateFormBusyState();
        renderPhoto();
        renderPhotoAssistant();
        try {
          const url = await processImage(file);
          if (!form.isConnected || !sheet.contains(form)) return;
          photo = url;
          photoRemoved = false;
          aiStatus = "";
          renderPhoto();
          renderPhotoAssistant();
        } catch (error) {
          if (!form.isConnected || !sheet.contains(form)) return;
          aiStatus = error && error.message ? error.message : "사진을 처리하지 못했어요.";
          renderPhotoAssistant();
        } finally {
          if (form.isConnected && sheet.contains(form)) {
            photoProcessing = false;
            updateFormBusyState();
            renderPhoto();
            renderPhotoAssistant();
          }
        }
      });
      const rm = drop.querySelector("#photoRemove");
      if (rm)
        rm.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (photoProcessing) return;
          photo = null;
          photoRemoved = true;
          aiStatus = "";
          renderPhoto();
          renderPhotoAssistant();
        });
    }
    renderPhoto();
    renderPhotoAssistant();

    // ----- type picker -----
    sheet.querySelectorAll("[data-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sheet
          .querySelectorAll("[data-type]")
          .forEach((b) => {
            b.classList.remove("is-active");
            b.setAttribute("aria-pressed", "false");
          });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        sheet.querySelector('[name="type"]').value = btn.dataset.type;
      });
    });

    // ----- variety autocomplete -----
    const varietySuggest = sheet.querySelector("#varietySuggest");
    let pickedVarietyValue = "";
    let pickedVarietyFragment = "";
    let suppressVarietyInputUntil = 0;
    let varietyChoiceHandledAt = 0;
    let varietyComposing = false;

    const selectedVarietyParts = () =>
      varietyInput.value
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    const currentVarietyQuery = () => {
      const parts = varietyInput.value.split(",");
      return (parts[parts.length - 1] || "").trim().toLocaleLowerCase("ko");
    };

    function moveVarietyCaretToEnd() {
      const end = varietyInput.value.length;
      if (typeof varietyInput.setSelectionRange === "function") {
        varietyInput.setSelectionRange(end, end);
      }
      requestAnimationFrame(() => {
        varietyInput.scrollLeft = varietyInput.scrollWidth;
      });
    }

    function focusVarietyInputForAppend() {
      if (typeof varietyInput.focus === "function") {
        try {
          varietyInput.focus({ preventScroll: true });
        } catch (_) {
          varietyInput.focus();
        }
      }
      moveVarietyCaretToEnd();
    }

    function prepareVarietyInputForAppend() {
      const normalized = normalizeVarietyInput(varietyInput.value);
      if (normalized) {
        varietyInput.value = `${normalized}, `;
      }
      focusVarietyInputForAppend();
    }

    function applyVarietyChoice(choice) {
      const parts = varietyInput.value.split(",");
      pickedVarietyFragment = (parts[parts.length - 1] || "").trim();
      parts[parts.length - 1] = choice;
      const normalized = normalizeVarietyInput(parts.join(","));
      pickedVarietyValue = normalized ? `${normalized}, ` : "";
      suppressVarietyInputUntil = Date.now() + 1800;
      varietyInput.value = pickedVarietyValue;
      varietySuggest.hidden = true;
      varietySuggest.innerHTML = "";
      focusVarietyInputForAppend();
      requestAnimationFrame(() => {
        focusVarietyInputForAppend();
      });
      [40, 140, 360, 800, 1400].forEach((delay) => {
        setTimeout(() => {
          if (cleanupVarietyChoiceGhostInput()) renderVarietySuggestions();
        }, delay);
      });
    }

    function cleanupVarietyChoiceGhostInput() {
      if (!pickedVarietyValue || !pickedVarietyFragment) return false;
      if (Date.now() > suppressVarietyInputUntil) return false;
      if (!varietyInput.value.startsWith(pickedVarietyValue)) return false;
      const appended = varietyInput.value.slice(pickedVarietyValue.length).trim();
      if (appended !== pickedVarietyFragment) return false;
      varietyInput.value = pickedVarietyValue;
      pickedVarietyValue = "";
      pickedVarietyFragment = "";
      suppressVarietyInputUntil = 0;
      focusVarietyInputForAppend();
      return true;
    }

    function renderVarietySuggestions() {
      const query = currentVarietyQuery();
      if (!query) {
        varietySuggest.hidden = true;
        varietySuggest.innerHTML = "";
        return;
      }
      const selected = new Set(selectedVarietyParts().map((part) => part.toLocaleLowerCase("ko")));
      const matches = VARIETY_OPTIONS.filter((option) => {
        const normalized = option.toLocaleLowerCase("ko");
        return !selected.has(normalized) && normalized.includes(query);
      }).slice(0, 8);

      varietySuggest.hidden = !matches.length;
      varietySuggest.innerHTML = matches
        .map(
          (option) =>
            `<button type="button" tabindex="-1" class="variety-suggest__item" data-variety="${esc(
              option
            )}">${esc(option)}</button>`
        )
        .join("");
    }

    function varietyButtonFromTarget(target) {
      return target && typeof target.closest === "function"
        ? target.closest("[data-variety]")
        : null;
    }

    function chooseVarietyButton(btn) {
      if (!btn) return;
      varietyChoiceHandledAt = Date.now();
      applyVarietyChoice(btn.dataset.variety);
    }

    nameInput.addEventListener("input", () => {
      const suggested = varietyForName(
        nameInput.value.trim(),
        sheet.querySelector('[name="type"]').value,
        countryInput.value
      );
      const current = varietyInput.value.trim();
      if (suggested && (!current || current === lastAutoVariety)) {
        varietyInput.value = suggested;
        lastAutoVariety = suggested;
        renderVarietySuggestions();
      }
    });

    varietyInput.addEventListener("compositionstart", () => {
      varietyComposing = true;
    });
    varietyInput.addEventListener("compositionend", () => {
      varietyComposing = false;
      setTimeout(() => {
        if (cleanupVarietyChoiceGhostInput()) renderVarietySuggestions();
      }, 0);
    });
    varietyInput.addEventListener("input", () => {
      if (cleanupVarietyChoiceGhostInput()) return;
      if (pickedVarietyValue && Date.now() < suppressVarietyInputUntil && varietyComposing) {
        return;
      }
      pickedVarietyValue = "";
      pickedVarietyFragment = "";
      suppressVarietyInputUntil = 0;
      lastAutoVariety = "";
      renderVarietySuggestions();
    });
    varietyInput.addEventListener("focus", () => {
      prepareVarietyInputForAppend();
      varietySuggest.hidden = true;
    });
    varietyInput.addEventListener("pointerup", moveVarietyCaretToEnd);
    varietyInput.addEventListener("click", moveVarietyCaretToEnd);
    varietyInput.addEventListener("blur", () => {
      setTimeout(() => {
        varietySuggest.hidden = true;
      }, 120);
    });
    varietySuggest.addEventListener("pointerdown", (e) => {
      const btn = varietyButtonFromTarget(e.target);
      if (btn) {
        e.preventDefault();
        chooseVarietyButton(btn);
      }
    });
    varietySuggest.addEventListener("click", (e) => {
      if (Date.now() - varietyChoiceHandledAt < 500) return;
      chooseVarietyButton(varietyButtonFromTarget(e.target));
    });

    // ----- submit -----
    $("#wineForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (photoProcessing || aiBusy) {
        alert("사진 처리가 끝난 뒤 저장해 주세요.");
        return;
      }
      const f = e.target;
      const name = f.name.value.trim();
      if (!name) return;
      const data = {
        name,
        country: f.country.value,
        type: f.type.value,
        vintage: f.vintage.value.trim(),
        variety:
          normalizeVarietyInput(f.variety.value) || varietyForName(name, f.type.value, f.country.value),
        price: f.price.value.replace(/[^\d]/g, "") || null,
        purchaseDate: f.purchaseDate.value || "",
        photo: photo || null,
        photoRemoved: !photo && photoRemoved,
      };
      if (isDrunkEdit) {
        data.tastings = collectTastingsFromForm(f, tastingRatingGetters);
        if (!hasDrunkTasting(data.tastings)) {
          alert("마신 사람을 한 명 이상 선택해 주세요.");
          return;
        }
        data.featuredTasterId = collectFeaturedTasterFromForm(f, data.tastings);
      }

      if (isEdit) {
        const backup = Object.assign({}, existing);
        Object.assign(existing, data, {
          userModified: true,
          clientUpdatedAt: new Date().toISOString(),
        });
        if (isDrunkEdit) syncLegacyTastingFields(existing);
        if (!persist(makeAuditLog("update", backup, existing))) {
          restoreObject(existing, backup);
          quotaAlert();
          return;
        }
      } else {
        const wine = Object.assign(
          { id: uid(), status: "cellar", clientUpdatedAt: new Date().toISOString() },
          data
        );
        state.wines.push(wine);
        if (!persist(makeAuditLog("create", null, wine))) {
          state.wines.pop();
          quotaAlert();
          return;
        }
        state.tab = "cellar";
        savePref();
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
    const displayRating = wineDisplayRating(w);
    const typeValue = `${typeIconHTML(w.type, "detail")}<span>${t.label}</span>`;
    const titleVintage = w.vintage
      ? `<span class="detail__title-vintage">${esc(w.vintage)}</span>`
      : "";
    const titleRow = isDrunk
      ? `<span class="detail__compact-title">
           ${typeIconHTML(w.type, "detail")}
           <span class="detail__name">${esc(w.name)}</span>
           ${titleVintage}
         </span>`
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
      cells.push(cell("종류", typeValue));
      cells.push(cell("빈티지", w.vintage ? esc(w.vintage) : "—"));
      cells.push(cell("구입일", fmtDate(w.purchaseDate)));
      cells.push(cell("구입 가격", won(w.price)));
    }
    const grid = `<div class="dgrid ${
      isDrunk ? "dgrid--compact" : ""
    }">${cells.join("")}</div>`;

    openSheet(`
      ${
        isDrunk
          ? `<div class="detail__rating-top" aria-label="대표 별점 ${
              displayRating || 0
            }점">${starsHTML(displayRating || 0)}${tastingMarksHTML(w, "detail")}</div>`
          : ""
      }
      ${w.photo ? `<img class="detail__photo" src="${w.photo}" alt="와인 사진" />` : ""}
      <div class="detail__head ${isDrunk ? "detail__head--compact" : ""}">
        <div class="detail__name-row ${
          isDrunk ? "detail__name-row--center" : ""
        }">${titleRow}</div>
      </div>

      ${grid}

      ${isDrunk ? detailTastingsHTML(w) : ""}

      <div class="detail-actions">
        <div class="detail-actions__tools">
          <button class="detail-actions__icon detail-actions__icon--delete" data-action="delete" aria-label="삭제" title="삭제">${trashIconHTML()}</button>
        ${
          isDrunk
            ? `<button class="detail-actions__icon detail-actions__icon--undo" data-action="undo" aria-label="셀러로 되돌리기" title="셀러로 되돌리기">${cellarReturnIconHTML()}</button>`
            : ""
        }
        </div>
        <div class="btn-stack detail-actions__main">
        ${
          isDrunk
            ? `<button type="button" class="btn btn--quiet" data-close>취소</button>
               <button type="button" class="btn btn--dark" data-action="edit">수정</button>`
            : `<button type="button" class="btn btn--quiet" data-action="edit">수정</button>
               <button type="button" class="btn btn--dark" data-action="drink">🍷 마셨어요</button>`
        }
        </div>
      </div>
    `);

    bindNoteBlocks(sheet);

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
    sheet.querySelector('[data-action="undo"]')?.addEventListener("click", async () => {
      const confirmed = await openConfirmDialog({
        title: "셀러로 되돌릴까요?",
        message: w.name
      });
      if (!confirmed) return;
      const backup = Object.assign({}, w);
      w.status = "cellar";
      delete w.rating;
      delete w.note;
      delete w.drunkDate;
      delete w.tastings;
      delete w.featuredTasterId;
      markWineModified(w);
      if (!persist(makeAuditLog("undoDrunk", backup, w))) {
        restoreObject(w, backup);
        quotaAlert();
        return;
      }
      closeSheet();
      render();
    });
    sheet
      .querySelector('[data-action="delete"]')
      ?.addEventListener("click", async () => {
        const confirmed = await openConfirmDialog({
          title: "정말 삭제할까요?",
          message: w.name,
          tone: "danger"
        });
        if (!confirmed) return;
        const backup = Object.assign({}, w);
        const previousWines = state.wines;
        const previousDeletedSeedIds = state.deletedSeedIds.slice();
        state.wines = state.wines.filter((x) => x.id !== w.id);
        if (/^seed-\d{3}$/.test(w.id || "")) {
          state.deletedSeedIds = sanitizeDeletedSeedIds(state.deletedSeedIds.concat(w.id));
        }
        if (!persist(makeAuditLog("delete", backup, null))) {
          state.wines = previousWines;
          state.deletedSeedIds = previousDeletedSeedIds;
          quotaAlert();
          return;
        }
        closeSheet();
        render();
      });
  }

  function noteBlockHTML(label, note) {
    return `<div class="note-block note-block--focus" data-note-block>
      ${label ? `<div class="note-block__label">${esc(label)}</div>` : ""}
      <div class="note-block__text note-block__text--clamped" data-note-text>${esc(
        note
      )}</div>
      <button class="note-block__toggle" type="button" data-note-toggle hidden aria-expanded="false">더보기</button>
    </div>`;
  }

  function detailTastingsHTML(wine) {
    const entries = knownTastingEntries(wine);
    if (!entries.length) return "";
    const featuredId = featuredTasterIdFor(wine);
    return `<div class="tasting-detail-list">
      ${entries
        .map(({ person, tasting }) => {
          if (tasting.status === TASTING_STATUS.SKIPPED) {
            return `<section class="tasting-detail tasting-detail--skipped">
              <div class="tasting-detail__head">
                <span class="tasting-detail__person">${personMarkHTML(
                  person,
                  tasting
                )}</span>
                <span class="tasting-detail__state">안마심</span>
              </div>
            </section>`;
          }
          return `<section class="tasting-detail">
            <div class="tasting-detail__head">
              <span class="tasting-detail__person">${personMarkHTML(
                person,
                tasting,
                person.id === featuredId && tasting.status === TASTING_STATUS.DRUNK
              )}</span>
              <span class="tasting-detail__rating">${starsHTML(
                tasting.rating || 0
              )}</span>
            </div>
            ${
              tasting.drunkDate
                ? `<div class="tasting-detail__date">${fmtDate(tasting.drunkDate)}</div>`
                : ""
            }
            ${tasting.note ? noteBlockHTML("", tasting.note) : ""}
          </section>`;
        })
        .join("")}
    </div>`;
  }

  function bindNoteBlocks(root) {
    root.querySelectorAll("[data-note-block]").forEach((block) => {
      const text = block.querySelector("[data-note-text]");
      const toggle = block.querySelector("[data-note-toggle]");
      if (!text || !toggle) return;

      requestAnimationFrame(() => {
        toggle.hidden = text.scrollHeight <= text.clientHeight + 2;
      });

      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        text.classList.toggle("note-block__text--clamped", expanded);
        toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
        toggle.textContent = expanded ? "더보기" : "접기";
      });
    });
  }

  function cell(label, val, full) {
    return `<div class="dcell ${
      full ? "dcell--full" : ""
    }"><div class="dlabel">${label}</div><div class="dvalue">${val}</div></div>`;
  }

  /* ---------- Drink form (mark as drunk) ---------- */
  function openDrinkForm(w) {
    const defaults = defaultDrinkTastings(w);

    openSheet(`
      <h2 class="sheet__title sheet__title--question">${esc(w.name)}, 어땠나요?</h2>

      <form id="drinkForm">
        <div class="form-section form-section--drink">
          <div class="form-section__title">사람별 기록</div>
          ${tastingsFormHTML(w, defaults)}
        </div>

        <div class="btn-stack">
          <button type="button" class="btn btn--quiet" data-close>취소</button>
          <button type="submit" class="btn btn--dark">저장</button>
        </div>
      </form>
    `);

    const tastingRatingGetters = bindTastingForms(sheet);

    $("#drinkForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const backup = Object.assign({}, w);
      const nextTastings = collectTastingsFromForm(f, tastingRatingGetters);
      if (!hasDrunkTasting(nextTastings)) {
        alert("마신 사람을 한 명 이상 선택해 주세요.");
        return;
      }
      updateWineTastings(w, nextTastings, collectFeaturedTasterFromForm(f, nextTastings));
      markWineModified(w);
      if (!persist(makeAuditLog("markDrunk", backup, w))) {
        restoreObject(w, backup);
        quotaAlert();
        return;
      }
      closeSheet();
      setTab("drunk");
    });
  }

  /* ---------- Wiring ---------- */
  function bindCards() {
    view.querySelectorAll(".card[data-id], .wine-tile[data-id]").forEach((c) => {
      c.addEventListener("click", () => {
        state.lastViewedId = c.dataset.id;
        markViewedCard();
        openDetail(c.dataset.id);
      });
    });
  }

  document.querySelectorAll(".tab").forEach((b) => {
    b.addEventListener("click", () => {
      const nextTab = b.dataset.tab;
      if (nextTab === state.tab) {
        scrollCurrentTabToTop();
        return;
      }
      setTab(nextTab);
    });
  });
  $("#addBtn").addEventListener("click", () => openForm(null));
  setupTabSwipeNavigation();
  backdrop.addEventListener("click", closeSheet);
  document.addEventListener("keydown", onSheetKeyDown);
  sheet.addEventListener("touchstart", onSheetTouchStart, { passive: true });
  sheet.addEventListener("touchmove", onSheetTouchMove, { passive: false });
  sheet.addEventListener("touchend", onSheetTouchEnd);
  sheet.addEventListener("touchcancel", onSheetTouchEnd);
  sheet.addEventListener("click", (e) => {
    const clearDate = e.target.closest("[data-clear-date]");
    if (clearDate) {
      e.preventDefault();
      const input = sheet.querySelector(`[name="${clearDate.dataset.clearDate}"]`);
      if (input) {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
      }
      return;
    }
    if (e.target.closest("[data-close]")) closeSheet();
  });
  document.addEventListener(
    "click",
    (e) => {
      if (!state.filterPanel || sheetOpen) return;
      if (e.target.closest(".filterbar") || e.target.closest(".filter-options")) return;
      e.preventDefault();
      e.stopPropagation();
      state.filterPanel = null;
      render();
    },
    true
  );

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
      const scroller = appScroller();
      return (scroller.scrollTop || 0) <= 0;
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
