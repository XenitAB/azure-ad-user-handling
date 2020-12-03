FROM node:lts-slim as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY ./src ./src
COPY ./tsconfig.json ./
RUN yarn build

RUN yarn install --production --prefer-offline && rm -rf .cache

FROM node:lts-slim as runtime

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app /usr/src/app
CMD node ./build/index.js
