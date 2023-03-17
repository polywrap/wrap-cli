FROM node:17.9.1-alpine as base

RUN apk --no-cache --virtual build-dependencies add bash 
RUN npm -g config set user root
RUN npm -g install --unsafe-perm assemblyscript@0.19.23 json
WORKDIR /project