
---

# React netflix custom clone project

## 소개
이 프로젝트는 **React**를 기반으로 한 웹 애플리케이션입니다.

주요 기능으로는 **React Router**를 통한 라우팅,
**Axios**를 이용한 HTTP 요청 처리 등이 있습니다. 
---

## 설치 및 실행

### 1. 설치
이 프로젝트를 실행하려면 **Node.js**와 **npm**이 필요합니다. [Node.js 공식 사이트](https://nodejs.org/)에서 설치한 뒤, 아래 명령어를 실행하세요.

```bash
# 패키지 설치
npm install
```

### 2. 실행
로컬 개발 서버를 시작하려면 다음 명령어를 사용하세요.

```bash
npm start
```

서버가 실행되면 기본적으로 [http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 3. 빌드
프로덕션 환경을 위한 정적 파일을 생성하려면 아래 명령어를 실행하세요:

```bash
npm run build
```

생성된 파일은 `build` 디렉토리에 저장됩니다.

### 4. 테스트
테스트를 실행하려면 다음 명령어를 사용하세요:

```bash
npm test
```

---

## 주요 기술 스택

### Dependencies
- **React (`^18.3.1`)**: 사용자 인터페이스를 구축하기 위한 라이브러리.
- **React DOM (`^18.3.1`)**: React의 DOM 렌더링 지원.
- **React Router DOM (`^6.28.0`)**: 라우팅 관리.
- **Axios (`^1.7.7`)**: HTTP 요청을 처리하기 위한 라이브러리.
- **FontAwesome (`^0.2.2`)**: 아이콘 사용을 위한 라이브러리.

### DevDependencies
- **babel-plugin-module-resolver (`^5.0.2`)**: Babel을 이용한 경로 설정 단순화.

---

## 프로젝트 구조
```plaintext
WSD-movie/
├── .github/                    # GitHub 관련 워크플로 및 설정 파일
├── react-app/                  # React 애플리케이션 소스 코드 디렉토리
│   ├── public/                 # 정적 파일 (HTML, 이미지 등)
│   ├── src/                    # React 소스 코드
│   │   ├── api/                # API 호출 로직 관련 파일
│   │   ├── artifacts/          # 리소스 및 데이터 관련 파일
│   │   ├── content/            # 정적 콘텐츠 파일
│   │   ├── App.css             # 글로벌 스타일
│   │   ├── App.js              # 메인 앱 컴포넌트
│   │   ├── AppRoutes.js        # 라우팅 설정
│   │   ├── index.css           # 전역 스타일시트
│   │   ├── index.js            # 애플리케이션 진입점
│   │   └── routes.json         # 라우팅 관련 JSON 설정
│   ├── .env                    # 환경 변수 파일
│   ├── .gitignore              # Git에 포함되지 않을 파일 정의
│   ├── jsconfig.json           # 절대 경로 설정을 위한 JS 설정
│   ├── package.json            # 프로젝트 의존성과 스크립트
│   ├── package-lock.json       # 의존성 잠금 파일
│   └── README.md               # 프로젝트 설명 파일
├── CNAME                       # 도메인 이름 설정 파일
└── .gitignore                  # 최상위 Git 설정 파일
```

---

## Scripts

### `npm start`
- 개발 서버를 시작합니다.
- 기본 포트: **3000**

### `npm run build`
- 애플리케이션을 프로덕션용으로 빌드합니다.
- 최적화된 파일이 `build/` 디렉토리에 생성됩니다.

### `npm test`
- 애플리케이션의 테스트 스위트를 실행합니다.

### `npm run eject`
- React 앱의 숨겨진 설정을 공개합니다. **주의: 이 작업은 되돌릴 수 없습니다.**

---

## 브라우저 지원
이 프로젝트는 다음 브라우저를 지원합니다:

### Production
- `>0.2%`
- `not dead`
- `not op_mini all`

### Development
- 최신 Chrome 버전

---

## 추가 정보
- 이 프로젝트는 `create-react-app`을 기반으로 생성되었습니다.
- 아이콘은 `FontAwesome`을 통해 관리됩니다.
- 경로 설정은 Babel 플러그인을 사용해 최적화되었습니다.

--- 

