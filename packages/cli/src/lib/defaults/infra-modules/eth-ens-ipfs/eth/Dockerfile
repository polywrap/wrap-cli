FROM node:16-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g ganache@latest

CMD ["ganache", "--hostname", "0.0.0.0"]