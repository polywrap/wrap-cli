FROM node:12.18-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./.env ./
COPY . .

RUN yarn \
  && yarn build

EXPOSE ${TRACE_SERVER_PORT}

ENTRYPOINT yarn server
