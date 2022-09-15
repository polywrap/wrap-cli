FROM node:16.13.0-alpine as base

RUN apk --no-cache --virtual build-dependencies add bash && yarn add global assemblyscript json

WORKDIR /project
