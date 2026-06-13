# Yomi
૮₍ •̀ ⩊ •́ ₎ა

## 일본어 단어 암기 웹앱 (jp-vocab)

React + Vite로 만든 프론트엔드 전용 일본어 단어 암기 앱입니다.
백엔드 없이 모든 데이터(폴더, 단어, 학습 통계, 설정)는 브라우저 **localStorage**에 저장됩니다.

### 1. 실행 방법

```bash
nvm use
npm install
npm run dev
```

브라우저에서 안내된 주소(기본 http://localhost:5173)로 접속하면 됩니다.

배포용 빌드:

```bash
npm run build
npm run preview
```

> ⚠️ 음성 재생(`speechSynthesis`)은 브라우저/OS에 설치된 일본어 음성 엔진에 따라 품질이 달라집니다.
> Chrome 등에서 더 자연스러운 일본어 음성이 제공되는 경우가 많습니다.

### 2. 프로젝트 구조

```
jp-vocab/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # 엔트리포인트
    ├── App.jsx               # 최상위 상태 관리 + 탭 네비게이션
    ├── App.css               # 전체 스타일 (노션풍 + 부드러운 레드 포인트)
    ├── data/
    │   └── dictionary.js     # 한국어→일본어 자동완성용 로컬 사전
    ├── utils/
    │   ├── storage.js        # localStorage 입출력 헬퍼
    │   ├── quiz.js            # 퀴즈 모드/필터/채점 로직
    │   └── speech.js          # Web Speech API 일본어 발음 재생
    └── components/
        ├── FolderBar.jsx      # 폴더 탭 (선택/추가/이름 수정/단어 수)
        ├── WordForm.jsx       # 단어 추가/수정 폼 (사전 자동완성, 중복 검사)
        ├── WordList.jsx       # 단어 목록 (검색, 배지, 즐겨찾기/수정/삭제)
        ├── Toolbar.jsx        # 설정(한자 토글, 최근 개수), 내보내기/가져오기/전체삭제
        ├── Library.jsx        # 위 컴포넌트들을 묶은 "단어장" 탭
        ├── StudyConfig.jsx    # 퀴즈 모드 + 출제 범위 선택 화면
        ├── StudySession.jsx   # 실제 퀴즈 진행 (입력, 채점, 음성)
        ├── SessionSummary.jsx # 세션 종료 후 결과/오답노트
        ├── StudyPage.jsx      # 설정→세션→결과 흐름을 관리하는 "공부하기" 탭
        ├── StatsPage.jsx      # "통계" 탭
        └── ConfirmModal.jsx   # 공용 확인 모달 (전체 삭제 등)
```

### 3. 주요 컴포넌트 설명

- **App.jsx**
  - `folders`, `words`, `settings`, `lastSessionWrong`(폴더별 최근 세션 오답 id 목록), `dailyStats`(날짜별 학습 문제 수)를 최상위 state로 관리합니다.
  - 각 state는 변경될 때마다 `useEffect`로 localStorage에 저장됩니다.
  - 탭(단어장 / 공부하기 / 통계)을 전환합니다.

- **Library.jsx (단어장 탭)**
  - `FolderBar` : 폴더 선택, 새 폴더 추가, 더블클릭/연필 아이콘으로 이름 수정, 폴더별 단어 수 표시.
  - `WordForm` : 한국어를 입력하면 내장 사전(`dictionary.js`)에서 일치하는 항목을 찾아 일본어/한자를 자동으로 채워줍니다(일본어 칸이 비어있을 때만). 같은 폴더 내 일본어 표기가 중복되면 추가를 막고 에러 메시지를 표시합니다. 다른 폴더에는 동일 단어를 자유롭게 추가할 수 있습니다.
  - `WordList` : 최신 추가 순 정렬, 검색, "최근 N단어"/"즐겨찾기"/"난이도" 배지, 마지막 학습일, 즐겨찾기·수정·삭제.
  - `Toolbar` : 한자 표시 토글, "최근 추가 단어" 기준 개수 조절, JSON 내보내기/가져오기, 전체 삭제(확인 모달 포함).

- **StudyPage.jsx (공부하기 탭)**
  - `StudyConfig` : 5가지 퀴즈 모드(한자→일본어, 한자→한국어, 일본어→한국어, 한국어→일본어, 발음→한국어)와 5가지 출제 범위(전체 랜덤, 오답 위주, 즐겨찾기만, 최근 추가 단어만, 최근 세션 오답)를 선택하고, 조건에 맞는 단어 수를 미리 보여줍니다. 한자 기반 모드는 한자가 등록된 단어만 출제합니다.
  - `StudySession` : 선택된 조건의 단어를 세션 시작 시 한 번 섞어 큐를 만들고(세션 내 전체 1회 순회), 사용자가 답을 입력 → 자동 채점 → 정답 공개 → "맞음/틀림/애매함"으로 직접 확정하는 흐름입니다. 발음 모드는 화면에 일본어를 바로 보여주지 않고 음성을 먼저 들려준 뒤, 정답 확인 시 한자/일본어/한국어를 모두 표시합니다. "다시 듣기" 버튼으로 재생할 수 있습니다.
  - `SessionSummary` : 전체 문항, 정답/오답/애매함 수, 정답률, 오답노트를 보여주고 "오답만 다시 풀기"를 누르면 바로 "최근 세션 오답" 필터로 재학습할 수 있습니다.
  - 세션이 끝나면 자동으로 `lastSessionWrong[폴더id]`가 갱신되어 다음에 "최근 세션 오답" 필터를 선택할 수 있게 됩니다.

- **StatsPage.jsx (통계 탭)**
  - 선택한 폴더의 전체 단어 수, 오늘 푼 문제 수, 전체 정답률, 자주 틀리는 단어 TOP 5를 보여줍니다.

### 4. localStorage 저장 방식

`src/utils/storage.js`에서 아래 키로 JSON을 저장/조회합니다.

| 키 | 내용 |
| --- | --- |
| `jpvoca_folders` | 폴더 목록 `{ id, name, createdAt }[]` |
| `jpvoca_words` | 단어 목록 `{ id, folderId, kanji, japanese, korean, createdAt, updatedAt, favorite, stats: { correctCount, wrongCount, lastStudiedAt, difficultyScore } }[]` |
| `jpvoca_settings` | `{ recentCount, showKanji }` |
| `jpvoca_last_session_wrong` | `{ [folderId]: wordId[] }` — 폴더별 최근 세션 오답 |
| `jpvoca_daily_stats` | `{ 'YYYY-MM-DD': number }` — 날짜별 학습(채점) 문제 수 |

- 모든 state 변경은 `App.jsx`의 `useEffect`를 통해 즉시 해당 키에 JSON으로 직렬화되어 저장됩니다.
- "내보내기"는 `folders` + `words` + `settings`를 하나의 JSON 파일로 다운로드합니다.
- "가져오기"는 JSON 파일을 검증 후 동일한 키에 덮어쓰고, React state를 다시 불러옵니다.
- "전체 삭제"는 단어/폴더/오답기록/일별통계를 초기화하고 기본 폴더 하나를 다시 생성합니다(한자 표시 설정 등은 유지).

### 5. 난이도 점수(difficultyScore) 계산

- 정답: `max(0, score - 1)`
- 오답: `score + 2`
- 애매함: 누적 횟수에는 반영하지 않고 `lastStudiedAt`만 갱신

이 값을 기준으로 "오답 위주" 필터가 내림차순 정렬되고, 단어 목록에는 "낮음/보통/높음" 난이도 배지로 표시됩니다.

### 6. 사전 자동완성 데이터 확장

`src/data/dictionary.js`의 `LOCAL_DICTIONARY` 배열에 `{ korean, japanese, kanji }` 형태로 항목을 추가하면 자동완성 대상이 늘어납니다.
