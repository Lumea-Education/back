# 1. Node.js 베이스 이미지 사용
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일 복사
COPY package.json pnpm-lock.yaml ./

# 4. pnpm을 사용해 의존성 설치
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# 5. 애플리케이션 코드 복사
COPY . .

# 6. 애플리케이션 실행
EXPOSE 3000
CMD ["npm", "run", "start"]
