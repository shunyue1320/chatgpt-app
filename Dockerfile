FROM node:lts-alpine AS build-all

RUN npm install pnpm -g

WORKDIR /app

COPY ./package.json /app

COPY ./pnpm-lock.yaml /app

RUN pnpm install

COPY . /app

# build frontend
RUN pnpm run build

# build backend
RUN pnpm -F chatgpt-app-service run build

# service
FROM node:lts-alpine

RUN npm install pnpm -g

WORKDIR /app

COPY /service/package.json /app

COPY /pnpm-lock.yaml /app

RUN pnpm install --production && rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache /tmp/*

COPY --from=build-all /app/service/dist /app/dist

COPY --from=build-all /app/dist /app/dist/public

EXPOSE 3010

CMD ["pnpm", "run", "start"]

