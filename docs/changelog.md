# Changelog for inkcloud-front (by GitHub Copilot)

## 2025-05-25

### Login 기능 관련 주요 변경 내역

1. **Keycloak OIDC 로그인 연동**
   - `src/api/memberApi.js`에 Keycloak OIDC 토큰 발급용 `login` 함수 구현
   - .env 파일에 `REACT_APP_KEYCLOAK_CLIENT_ID`, `REACT_APP_KEYCLOAK_CLIENT_SECRET` 환경변수 사용 안내

2. **로그인 페이지 구현 및 개선**
   - `src/components/menus/LoginPage.jsx`에서 로그인 폼 구현
   - 로그인 성공 시 access_token을 쿠키(`js-cookie`)에 저장
   - 로그인 성공 시 Redux 상태(`loginSlice`)에 로그인 정보 저장
   - 로그인 성공 시 루트(`/`) 페이지로 이동

3. **Redux 로그인 상태 관리**
   - `src/store/loginSlice.js`에 로그인 상태 관리용 slice(`setLogin`, `logout` 액션 포함) 구현
   - `src/store/index.js`에서 Redux store에 loginReducer 등록
   - `src/index.js`에서 Provider로 앱 전체를 감싸도록 안내

4. **라우팅 및 메뉴 연동**
   - `src/router/root.js`에 LoginPage 라우트 추가
   - `src/components/menus/BasicMenu.js`에서 로그인 메뉴 라우팅 연동

5. **문서화 및 관리**
   - 변경 내역 및 작업 내역은 이 파일(`docs/changelog.md`)에 기록

---

> 이 changelog는 inkcloud-front 프로젝트의 주요 커스텀/수정 내역을 기록합니다. 추가 변경사항 발생 시 이 파일에 계속 기록해 주세요.
