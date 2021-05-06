FROM node:12.18-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./.env ./
COPY ./logging-server .

RUN yarn \
  && yarn build

EXPOSE ${DEV_SERVER_PORT}

ENTRYPOINT yarn server
