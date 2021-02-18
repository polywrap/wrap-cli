FROM node:14.15.5-alpine3.12
RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    make \
    g++

ARG script

COPY . /app
WORKDIR /app
RUN chmod +x $script && $script