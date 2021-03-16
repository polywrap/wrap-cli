FROM node:12.20.1-alpine3.10
RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    make \
    g++
WORKDIR /app