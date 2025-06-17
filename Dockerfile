# Node.js를 이용해 React 빌드
FROM node:18-alpine AS build

WORKDIR /app

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