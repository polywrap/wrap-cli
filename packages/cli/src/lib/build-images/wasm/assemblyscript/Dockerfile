# Web3API Defaults
ARG web3api_manifests
ARG web3api_query_dir
ARG web3api_mutation_dir

# Custom Arguments
ARG include
ARG node_version

FROM node:${node_version}-alpine as base

RUN apk --no-cache --virtual build-dependencies add \
    bash \
    git \
    openssh \
    make \
    g++

WORKDIR /project

# Install deps in its own step, making rebuilds faster
# when just the Web3API schema & implementation files change
COPY package.json .
RUN yarn

# Copy all manifest files
COPY ${web3api_manifests} .

# Copy all source files
COPY ${include} .

# TODO: generate schema + code before building w/ w3 codegen

# Build the query module
RUN if [[ -n "${web3api_query_dir}" ]]; \
    then asc ${web3api_query_dir}/w3/entry.ts --path ./node_modules --outFile ./build/query.wasm --use abort=src/query/w3/entry/w3Abort --optimize --debug --importMemory --runtime stub; \
    fi

# Build the mutation module
RUN if [[ -n "${web3api_mutation_dir}" ]]; \
    then asc ${web3api_mutation_dir}/w3/entry.ts --path ./node_modules --outFile ./build/mutation.wasm --use abort=src/mutation/w3/entry/w3Abort --optimize --debug --importMemory --runtime stub; \
    fi
