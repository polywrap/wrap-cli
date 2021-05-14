ARG modules_to_build

FROM node:12.20.1-alpine3.10 as base

ARG buildDir
ENV build_dir=${buildDir}

RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    make \
    g++

WORKDIR /app

# Install deps in its own step, making rebuilds faster
# when just the Web3API schema & implementation files change
COPY package.json ./
RUN npm i && npm i -g assemblyscript@0.17.13

# Copy the rest of the Web3API source files
COPY . ./

FROM base as query
ONBUILD RUN asc ./src/query/w3/entry.ts --path ./node_modules --outFile ${build_dir}/query.wasm --use abort=src/query/w3/entry/w3Abort --optimize --debug --importMemory --runtime stub

FROM base as mutation
ONBUILD RUN asc ./src/mutation/w3/entry.ts --path ./node_modules --outFile ${build_dir}/mutation.wasm --use abort=src/mutation/w3/entry/w3Abort --optimize --debug --importMemory --runtime stub

FROM base as all
RUN echo ${build_dir}
ONBUILD RUN asc ./src/query/w3/entry.ts --path ./node_modules --outFile ${build_dir}/query.wasm --use abort=src/query/w3/entry/w3Abort --optimize --debug --importMemory --runtime stub
ONBUILD RUN asc ./src/mutation/w3/entry.ts --path ./node_modules --outFile ${build_dir}/mutation.wasm --use abort=src/mutation/w3/entry/w3Abort --optimize --debug --importMemory --runtime stub

FROM ${modules_to_build}