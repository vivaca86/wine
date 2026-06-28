# 🍷 와인 셀러 (Wine Cellar)

내 와인 컬렉션과 시음 기록을 관리하는 **모바일 전용 웹앱**입니다.
별도 설치 없이 동작하며, 기본 데이터는 기기 브라우저(localStorage)에 저장됩니다.
Firebase 동기화를 연결하면 여러 기기에서 같은 와인 목록을 실시간으로 보고 수정할 수 있습니다.

## 기능
- **셀러 탭** — 보유한 와인 목록 (이름·생산자·종류·빈티지·구입가·구입일)
- **마신 와인 탭** — 마신 와인을 별점·시음 노트·마신 날짜와 함께 따로 보관
- **기록 탭** — 보유/마신 병 수, 셀러 가치, 평균 별점, 가장 많이 마신 종류 등 통계
- 와인 상세에서 **마셨어요** → 별점·노트 입력 후 마신 와인으로 이동
- 수정 / 삭제 / 셀러로 되돌리기 지원
- **동기화 설정** — Firebase 로그인 후 Firestore로 실시간 목록 공유

## 폰에서 여는 방법

**가장 간단한 방법 — 파일 직접 열기**
1. `wine-cellar` 폴더를 휴대폰으로 옮깁니다 (또는 클라우드 동기화).
2. `index.html`을 모바일 브라우저로 엽니다.

**같은 와이파이에서 PC로 서빙해 폰으로 접속**
```bash
cd wine-cellar
python -m http.server 8077
```
폰 브라우저에서 `http://<PC의 IP>:8077` 접속.

**홈 화면에 앱처럼 추가**
브라우저 메뉴 → "홈 화면에 추가" 를 누르면 전체화면 앱처럼 실행됩니다.

## 파일 구성
- `index.html` — 화면 구조
- `styles.css` — Lovable 디자인 시스템(크림 배경·차콜 텍스트·인셋 섀도우)
- `app.js` — 앱 로직 + 데이터 저장
- `manifest.json` — 홈 화면 추가/PWA 설정

## 데이터
- 입력한 와인은 해당 브라우저에만 저장됩니다(기기·브라우저가 바뀌면 보이지 않음).
- 캐시/브라우저 데이터를 지우면 기록도 삭제되니 주의하세요.
- 동기화를 켜면 Firebase Firestore의 `cellars/main` 문서에 목록이 저장됩니다.
- 한 기기에서 저장하면 로그인된 다른 기기에 실시간으로 반영됩니다.
- Firestore 보안 규칙에서 허용한 Firebase Auth 사용자만 읽고 쓸 수 있습니다.
- 로그인/로그아웃/등록/수정/삭제/마신 기록은 `cellars/main/logs` 서브컬렉션에 행동 로그로 저장됩니다.

## 사진 자동 입력 배포 메모
와인 추가 화면에서 병 사진을 선택한 뒤 `사진으로 자동 입력`을 누르면 Firebase Callable Function
`analyzeWineLabel`이 OpenAI Responses API로 라벨을 분석해 와인 이름, 빈티지, 종류, 국가, 품종 후보를 폼에 채웁니다.
분석 결과는 자동 저장되지 않으며 저장 전 직접 확인할 수 있습니다.

서버 함수는 로그인된 Firebase Auth 사용자만 호출할 수 있고, 사용자별 하루 8회로 제한됩니다.
OpenAI API 키는 프론트 코드에 넣지 않고 Firebase Secret `OPENAI_API_KEY`로만 읽습니다.

배포 전 준비:
```bash
firebase login
firebase use wine-974c5
firebase functions:secrets:set OPENAI_API_KEY
firebase deploy --only functions
```

기본 모델은 `gpt-4o-mini`입니다. 배포 환경에서 `OPENAI_VISION_MODEL`을 설정하면 다른 모델로 바꿀 수 있습니다.
