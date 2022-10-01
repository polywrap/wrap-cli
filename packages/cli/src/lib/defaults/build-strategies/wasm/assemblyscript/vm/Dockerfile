FROM node:16.13.0-alpine as base

RUN apk --no-cache --virtual build-dependencies add bash 
RUN npm -g config set user root
RUN npm -g install --unsafe-perm assemblyscript@0.19.1 json
WORKDIR /project