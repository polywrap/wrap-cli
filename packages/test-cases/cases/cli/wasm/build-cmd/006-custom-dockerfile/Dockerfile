FROM node:14.16.0-alpine as base

RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    make \
    g++

WORKDIR /linked-packages

COPY .polywrap/wasm/build/linked-packages/@polywrap/wasm-as ./@polywrap/wasm-as

WORKDIR /project

# Install deps in its own step, making rebuilds faster
# when just the Polywrap schema & implementation files change
COPY package.json .
RUN npx json -I -f package.json -e "this.dependencies['@polywrap/wasm-as']='../linked-packages/@polywrap/wasm-as'"
RUN yarn

# Copy all manifest files
COPY polywrap.yaml .
COPY polywrap.build.yaml .

# Copy all source files
COPY ./src ./src
COPY ./package.json ./package.json

# Build the module at src
RUN ./node_modules/.bin/asc src/wrap/entry.ts \
    --path ./node_modules \
    --outFile ./build/wrap.wasm \
    --use abort=src/wrap/entry/wrapAbort \
    --optimize --debug --importMemory \
    --runtime stub \
    --runPasses asyncify
