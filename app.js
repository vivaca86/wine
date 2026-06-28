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
  const FIREBASE_FUNCTIONS_REGION = "asia-northeast3";
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
  const SEED_VERSION = "user-wine-list-2026-06-28-henri-giraud-fut-de-chene";
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

  const varietyForName = (name) => VARIETY_BY_WINE_NAME[(name || "").trim()] || "";

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

  const VARIETY_OPTIONS = Array.from(
    new Set(
      Object.values(VARIETY_BY_WINE_NAME).flatMap((varieties) =>
        varieties
          .split(",")
          .map((variety) => variety.trim())
          .filter(Boolean)
      )
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

  function applySeedCorrections(wines) {
    if (!Array.isArray(wines)) return [];
    return wines.map((wine) => {
      const correction = wine && SEED_CORRECTIONS[wine.id];
      if (!correction) return wine;

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

      if (!matchesOldSeed) return wine;

      const nextWine = Object.assign({}, wine, correction.next);
      const mappedVariety = varietyForName(nextWine.name);
      if (mappedVariety && !(nextWine.variety || "").trim()) {
        nextWine.variety = mappedVariety;
      }
      return nextWine;
    });
  }

  function enrichWinesWithVariety(wines) {
    if (!Array.isArray(wines)) return [];
    return wines.map((wine) => {
      if (!wine || typeof wine !== "object") return wine;
      const variety = varietyForName(wine.name);
      const photo = defaultPhotoForWineId(wine.id) || defaultPhotoForWineName(wine.name);
      const updates = {};
      if (variety && !(wine.variety || "").trim()) updates.variety = variety;
      if (photo && (!(wine.photo || "").trim() || isDefaultPhoto(wine.photo))) {
        updates.photo = photo;
      }
      if (!photo && isDefaultPhoto(wine.photo)) updates.photo = null;
      if (!DEFAULT_PHOTO_AUTOFILL_ENABLED && isDefaultPhoto(wine.photo)) updates.photo = null;
      return Object.keys(updates).length ? Object.assign({}, wine, updates) : wine;
    });
  }

  function normalizeWines(wines) {
    return enrichWinesWithVariety(applySeedCorrections(wines));
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

  function seedWines() {
    return SEED_TSV.trim()
      .split(/\r?\n/)
      .slice(1)
      .map((line, idx) => {
        const [status, type, country, , name, vintage] = line.split("\t");
        const trimmedName = name.trim();
        const id = `seed-${String(idx + 1).padStart(3, "0")}`;
        const wine = {
          id,
          status,
          name: trimmedName,
          country: country || "",
          type,
          vintage: (vintage || "").trim(),
          variety: varietyForName(trimmedName),
          price: null,
          purchaseDate: "",
          photo: defaultPhotoForWineId(id),
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
      const existing = normalizeWines(JSON.parse(raw) || []);
      const seedById = new Map(seeds.map((seed) => [seed.id, seed]));
      const existingIds = new Set(existing.map((w) => w.id));
      existing.forEach((wine) => {
        const seed = seedById.get(wine.id);
        if (seed && !wine.variety && seed.variety) {
          wine.variety = seed.variety;
        }
        if (seed && !wine.photo && seed.photo) {
          wine.photo = seed.photo;
        }
      });
      seeds.forEach((seed) => {
        if (!existingIds.has(seed.id)) {
          existing.push(seed);
        }
      });
      state.wines = normalizeWines(existing);
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
        if (raw) state.wines = normalizeWines(JSON.parse(raw) || []);
      }
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
    } catch (e) {
      state.wines = seedWines();
    }
  }
  function savePref() {
    try {
      localStorage.setItem(
        PREF_KEY,
        JSON.stringify({
          sortBy: state.sortBy,
          sortDir: state.sortDir,
          viewMode: state.viewMode,
        })
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
      variety: w.variety || "",
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
    variety: "품종",
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
    state.wines = normalizeWines(state.wines);
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
        const normalizedWines = normalizeWines(data.wines);
        const shouldBackfillCloud = JSON.stringify(data.wines) !== JSON.stringify(normalizedWines);
        applyingRemote = true;
        state.wines = normalizedWines;
        if (!persistLocalOnly()) quotaAlert();
        applyingRemote = false;
        render();
        if (shouldBackfillCloud) writeCloudWines().catch(handleSyncError);
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
    state.typeFilters = [];
    state.countryFilters = [];
    state.varietyFilters = [];
    state.filterPanel = null;
    state.searchOpen = false;
    state.searchQuery = "";
    document.querySelectorAll(".tab").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.tab === tab);
    });
    savePref();
    render();
  }

  function scrollCurrentTabToTop() {
    const scroller = document.scrollingElement || document.documentElement;
    if (window.scrollTo) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scroller.scrollTop = 0;
    }
  }

  function render() {
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
        w.note,
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
  function renderList(wines, kind) {
    normalizeSortForKind(kind);
    if (state.viewMode !== "list" && state.viewMode !== "image") state.viewMode = "list";
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
        ? `<span class="wine-tile__rating">${starsHTML(w.rating || 0)}</span>`
        : `<span class="wine-tile__name">${esc(w.name)}</span>`;
    return `<button class="wine-tile wine-tile--${kind}${viewed}" type="button" data-id="${
      w.id
    }" aria-label="${esc(label)}">
      <span class="wine-tile__image">${photo}</span>
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
    const w = existing || { type: "red", purchaseDate: "" };
    const isEdit = !!existing;
    const isDrunkEdit = isEdit && existing.status === "drunk";
    const selectedType = FORM_TYPE_IDS.includes(w.type) ? w.type : "red";
    const initialVariety = w.variety || varietyForName(w.name) || "";
    let photo = (existing && existing.photo) || null;
    let lastAutoVariety = initialVariety;
    let aiBusy = false;
    let aiStatus = "";

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
          <div class="photo-assist" id="photoAssist" aria-live="polite"></div>
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

        <div class="field field--variety">
          <label class="field__label">품종 <span class="opt">(선택)</span></label>
          <input class="input" name="variety" id="varietyInput" autocomplete="off" placeholder="예: 피노 누아, 샤르도네" value="${esc(
            initialVariety
          )}" />
          <div class="variety-suggest" id="varietySuggest" hidden></div>
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
          <div class="date-row">
            <input class="input" name="purchaseDate" type="date" value="${esc(
              w.purchaseDate || ""
            )}" />
            <button type="button" class="date-clear" data-clear-date="purchaseDate" aria-label="구입일 비우기" title="구입일 비우기">-</button>
          </div>
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
                  <div class="date-row">
                    <input class="input" name="drunkDate" type="date" value="${esc(
                      w.drunkDate || ""
                    )}" />
                    <button type="button" class="date-clear" data-clear-date="drunkDate" aria-label="마신 날 비우기" title="마신 날 비우기">-</button>
                  </div>
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
    const form = $("#wineForm");
    const nameInput = form.elements.name;
    const vintageInput = form.elements.vintage;
    const countryInput = form.elements.country;
    const typeInput = form.elements.type;
    const varietyInput = form.elements.variety;

    function setFormType(type) {
      if (!FORM_TYPE_IDS.includes(type)) return false;
      typeInput.value = type;
      sheet.querySelectorAll("[data-type]").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.type === type);
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
      if (setInputValue(varietyInput, normalizeVarietyInput(suggestion.variety))) {
        lastAutoVariety = varietyInput.value.trim();
        applied += 1;
      }
      return applied;
    }

    function aiErrorMessage(error) {
      const message = error && error.message ? error.message : "";
      if (message.includes("OPENAI_API_KEY")) return "아직 서버 키가 설정되지 않았어요.";
      if (message.includes("로그인")) return "로그인 후 사용할 수 있어요.";
      if (message.includes("8회")) return message;
      return "사진 분석에 실패했어요.";
    }

    function renderPhotoAssistant() {
      const assist = sheet.querySelector("#photoAssist");
      if (!assist) return;
      if (!photo) {
        assist.innerHTML = "";
        return;
      }
      const status = aiStatus
        ? `<span class="photo-assist__status">${esc(aiStatus)}</span>`
        : "";
      assist.innerHTML = `
        <button type="button" class="photo-assist__btn" id="photoAiBtn" ${
          aiBusy ? "disabled" : ""
        }>${aiBusy ? "분석 중..." : "사진으로 자동 입력"}</button>
        ${status}
      `;
      assist.querySelector("#photoAiBtn")?.addEventListener("click", async () => {
        if (aiBusy || !photo) return;
        aiBusy = true;
        aiStatus = "사진 라벨 분석 중";
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
          renderPhotoAssistant();
        }
      });
    }

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
          aiStatus = "";
          renderPhoto();
          renderPhotoAssistant();
        });
      });
      const rm = drop.querySelector("#photoRemove");
      if (rm)
        rm.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          photo = null;
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
          .forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        sheet.querySelector('[name="type"]').value = btn.dataset.type;
      });
    });

    // ----- variety autocomplete -----
    const varietySuggest = sheet.querySelector("#varietySuggest");
    let pickedVarietyValue = "";
    let pickedVarietyFragment = "";
    let suppressVarietyInputUntil = 0;
    let varietyChoiceHandledAt = 0;

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
      suppressVarietyInputUntil = Date.now() + 250;
      varietyInput.value = pickedVarietyValue;
      varietySuggest.hidden = true;
      varietySuggest.innerHTML = "";
      focusVarietyInputForAppend();
      requestAnimationFrame(() => {
        focusVarietyInputForAppend();
      });
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
      const suggested = varietyForName(nameInput.value.trim());
      const current = varietyInput.value.trim();
      if (suggested && (!current || current === lastAutoVariety)) {
        varietyInput.value = suggested;
        lastAutoVariety = suggested;
        renderVarietySuggestions();
      }
    });

    varietyInput.addEventListener("input", () => {
      if (pickedVarietyValue && Date.now() < suppressVarietyInputUntil) {
        const appended = varietyInput.value.startsWith(pickedVarietyValue)
          ? varietyInput.value.slice(pickedVarietyValue.length).trim()
          : "";
        if (pickedVarietyFragment && appended === pickedVarietyFragment) {
          varietyInput.value = pickedVarietyValue;
          moveVarietyCaretToEnd();
          return;
        }
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
      const f = e.target;
      const name = f.name.value.trim();
      if (!name) return;
      const data = {
        name,
        country: f.country.value,
        type: f.type.value,
        vintage: f.vintage.value.trim(),
        variety: normalizeVarietyInput(f.variety.value) || varietyForName(name),
        price: f.price.value.replace(/[^\d]/g, "") || null,
        purchaseDate: f.purchaseDate.value || "",
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
          <button class="detail-actions__delete" data-action="delete" aria-label="삭제" title="삭제">${trashIconHTML()}</button>
        ${
          isDrunk
            ? `<button class="detail-action detail-action--secondary" data-action="undo">셀러로 되돌리기</button>
               <button class="detail-action detail-action--primary" data-action="edit">수정</button>`
            : `<button class="detail-action detail-action--secondary" data-action="edit">수정</button>
               <button class="detail-action detail-action--primary" data-action="drink">🍷 마셨어요</button>`
        }
        </div>
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
        if (confirm(`정말 삭제할까요?\n\n${w.name}`)) {
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
          <div class="date-row">
            <input class="input" name="drunkDate" type="date" value="${esc(
              w.drunkDate || ""
            )}" />
            <button type="button" class="date-clear" data-clear-date="drunkDate" aria-label="마신 날 비우기" title="마신 날 비우기">-</button>
          </div>
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
      w.drunkDate = f.drunkDate.value || "";
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
  backdrop.addEventListener("click", closeSheet);
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
