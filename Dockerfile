# Node.js를 이용해 React 빌드
FROM node:18-alpine AS build

WORKDIR /app

# 빌드 타임 환경변수 선언
ARG REACT_APP_KEYCLOAK_TOKEN_URL
ARG REACT_APP_KEYCLOAK_CLIENT_ID
ARG REACT_APP_STORE_ID
ARG REACT_APP_CHANNEL_ID
ARG REACT_APP_PREFIX_URL
ARG REACT_APP_KEYCLOAK_CLIENT_SECRET
ARG REACT_APP_V2_API_SECRET
ARG REACT_APP_V2_WEBHOOK_SECRET

ENV REACT_APP_KEYCLOAK_TOKEN_URL=$REACT_APP_KEYCLOAK_TOKEN_URL
ENV REACT_APP_KEYCLOAK_CLIENT_ID=$REACT_APP_KEYCLOAK_CLIENT_ID
ENV REACT_APP_STORE_ID=$REACT_APP_STORE_ID
ENV REACT_APP_CHANNEL_ID=$REACT_APP_CHANNEL_ID
ENV REACT_APP_PREFIX_URL=$REACT_APP_PREFIX_URL
ENV REACT_APP_KEYCLOAK_CLIENT_SECRET=$REACT_APP_KEYCLOAK_CLIENT_SECRET
ENV REACT_APP_V2_API_SECRET=$REACT_APP_V2_API_SECRET
ENV REACT_APP_V2_WEBHOOK_SECRET=$REACT_APP_V2_WEBHOOK_SECRET

# 의존성 설치
COPY package.json package-lock.json ./

RUN npm install

# 소스 코드 복사
COPY . .

# 실행 권한 부여 (vite 실행 문제 해결)
RUN chmod -R 777 node_modules/.bin

# npm rebuild 실행 (권한 문제 해결)
RUN npm rebuild

# React 빌드
RUN npm run build

# 2단계 : 실행 컨테이너
FROM nginx:1.21-alpine

# React 빌드 파일을 Nginx 경로로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 설정 변경 (SPA는 반드시 필요)
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]