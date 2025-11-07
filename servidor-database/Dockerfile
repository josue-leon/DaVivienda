FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD sh -c "npx prisma generate && npx prisma migrate deploy && pnpm start:dev"
