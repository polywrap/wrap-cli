FROM node:10.15.3-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ens-scripts ./

RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    python \
    make \
    g++ \
    && yarn \
    && yarn build

ENTRYPOINT yarn deployEns
