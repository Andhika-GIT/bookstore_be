# build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/tsconfig.json ./
COPY --from=build /app/tsconfig.build.json ./
COPY --from=build /app/src ./src

EXPOSE 3000

CMD [ "node", "dist/main" ]