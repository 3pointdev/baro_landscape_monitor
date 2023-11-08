# 프로젝트

#### 개발환경

- JavaScript
- TypeScript
- React -18.2.0
- Next.JS -13.2.1
- Styled-components
- MobX State Management Library
- M-V-VM Design Pattern
- Docker Local Development Environment
- Google Cloud Platform App Engine Deploy Environment
- Google Cloud Build CI/CD Environment
- npm Package Manager

#### 개발 스크립트

- 의존성 설치가 필요한 경우 yarn install or npm install 실행
- yarn or npm 사용
- yarn dev 혹은 npm run dev
- 스크립트는 package.json 에서 확인 및 편집가능

#### 배포 스크립트

- GCP GAE로 배포설정 됨
- GCP Cloud Build CICD설정 됨
- git push를 통해서 배포가능
- 스크립트는 package.json 에서 확인 및 편집가능

#### 버전관리툴

- Git Flow 사용
- develop에서 git flow feature start (featrue_name)으로 branch 생성
- git flow feature finish로 브랜치삭제 및 develop merge
- git flow release start (tag version)으로 릴리즈 branch 생성
- git flow release finish로 릴리즈브랜치 삭제 및 develop, main merge
- git push --tags로 tag version push

#### 프로젝트 주요 경로

- /admin_docker 로컬 도커 셋팅 경로
- /app_prd.yaml 배포환경설정 파일 (PRD)
- /app_dev.yaml 배포환경설정 파일 (DEV)
- /app.js 빌드OUT파일 실행용 NODE
- /resource/components 모든 컴포넌트가 포함된 경로
- /resource/config url,상수 등 모든 설정이 포함된 경로
- /resource/pages next.js router 경로
- /resource/public font, image 같은 asset 이 존재하는 경로
- /resource/styles CSS 경로 \* styled-components 사용으로 각 View, Component에 스타일이 적용되어 있음.
- /resource/src/modules 자주 사용되는 기능 함수 모듈 경로
- /resource/src/dto 서버 요청 관련 DTO
- /resource/src/mobx mobx(state 관리) 관련
- /resource/src/models 서버 응답 관련 모델
- /resource/src/viewModels ViewModel 관련

####

# 참고

#### 리팩토링

- 초기 개발된 환경은 VueJS 기반으로 개발이 진행됬으며, 현 소스코드는 타입 스트립트로 전환 및 프로젝트 구조를 부분 리팩토링을 진행하고 있는 상태
- 명확한 타입 정의, 기존 수많은 분기점 대신 의존성을 주입하여 사용하는 방식으로 변경, 중복 코딩된 소스 코드 재사용 및 캡슐화가 목적

#### 사이트 설정

- /resource/pages/\_app.tsx 에서 처리됨
