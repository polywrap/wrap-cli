FROM node:14.16.0-alpine as base

RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    make \
    g++

WORKDIR /linked-packages

COPY .w3/web3api/build/linked-packages/@web3api/wasm-as ./@web3api/wasm-as

WORKDIR /project

# Install deps in its own step, making rebuilds faster
# when just the Web3API schema & implementation files change
COPY package.json .
RUN npx json -I -f package.json -e "this.dependencies['@web3api/wasm-as']='../linked-packages/@web3api/wasm-as'"
RUN yarn

# Copy all manifest files
COPY web3api.no-docker.yaml .
COPY web3api.build.no-docker.yaml .

# Copy all source files
COPY ./src ./src
COPY ./package.json ./package.json

# Build the module at src/mutation
RUN ./node_modules/.bin/asc src/mutation/w3/entry.ts \
    --path ./node_modules \
    --outFile ./build/mutation.wasm \
    --use abort=src/mutation/w3/entry/w3Abort \
    --optimize --debug --importMemory \
    --runtime stub \
    --runPasses asyncify
# Build the module at src/query
RUN ./node_modules/.bin/asc src/query/w3/entry.ts \
    --path ./node_modules \
    --outFile ./build/query.wasm \
    --use abort=src/query/w3/entry/w3Abort \
    --optimize --debug --importMemory \
    --runtime stub \
    --runPasses asyncify
