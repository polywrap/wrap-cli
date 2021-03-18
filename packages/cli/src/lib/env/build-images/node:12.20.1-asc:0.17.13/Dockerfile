ARG modules_to_build

FROM node:12.20.1-alpine3.10 as base
ONBUILD RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    make \
    g++
ONBUILD COPY . /app
ONBUILD WORKDIR /app
ONBUILD RUN npm i && npm i -g assemblyscript@0.17.13

FROM base as query
ONBUILD RUN asc ./src/query/w3/entry.ts --path ./node_modules --outFile ./build/query.wasm --optimize --debug --importMemory --runtime stub

FROM base as mutation
ONBUILD RUN asc ./src/mutation/w3/entry.ts --path ./node_modules --outFile ./build/mutation.wasm --optimize --debug --importMemory --runtime stub

FROM base as both
ONBUILD RUN asc ./src/query/w3/entry.ts --path ./node_modules --outFile ./build/query.wasm --optimize --debug --importMemory --runtime stub
ONBUILD RUN asc ./src/mutation/w3/entry.ts --path ./node_modules --outFile ./build/mutation.wasm --optimize --debug --importMemory --runtime stub

FROM ${modules_to_build}