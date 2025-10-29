FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

FROM node:20-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

COPY next.config.* ./
COPY tsconfig.json ./

RUN npm run build

FROM node:20-alpine AS final

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY next.config.* ./

COPY --from=build /app/public ./public

COPY --from=build /app/.next ./.next

EXPOSE 3000

CMD ["npm", "run", "start"]