FROM node:14.16.0-alpine as base

RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    make \
    g++

WORKDIR /linked-packages

COPY .polywrap/web3api/build/linked-packages/@polywrap/wasm-as ./@polywrap/wasm-as

WORKDIR /project

# Install deps in its own step, making rebuilds faster
# when just the Web3API schema & implementation files change
COPY package.json .
RUN npx json -I -f package.json -e "this.dependencies['@polywrap/wasm-as']='../linked-packages/@polywrap/wasm-as'"
RUN yarn

# Copy all manifest files
COPY web3api.yaml .
COPY web3api.build.yaml .

# Copy all source files
COPY ./src ./src
COPY ./package.json ./package.json

# Build the module at src
RUN ./node_modules/.bin/asc src/polywrap/entry.ts \
    --path ./node_modules \
    --outFile ./build/module.wasm \
    --use abort=src/polywrap/entry/wrapAbort \
    --optimize --debug --importMemory \
    --runtime stub \
    --runPasses asyncify
