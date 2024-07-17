# build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm cache clean --force

RUN npm install

COPY . .

RUN npm run build

# runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/tsconfig.json ./dist/tsconfig.json
COPY --from=build /app/src/mikro-orm.config.ts ./dist/mikro-orm.config.ts

EXPOSE 3000

CMD [ "node", "dist/main" ]