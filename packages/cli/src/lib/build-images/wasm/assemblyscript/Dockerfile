ARG web3api_manifests

# Custom Arguments
ARG node_version
ARG include

FROM node:${node_version}-alpine as base

# Web3API Defaults
ARG web3api_query_dir
ARG web3api_mutation_dir

# TODO: this is working, but not the web3api_manifests? It messes with the value when we assign it?
ENV env_web3api_query_dir=$web3api_query_dir
ENV env_web3api_mutation_dir=$web3api_mutation_dir

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

RUN echo $env_web3api_query_dir > query_dir.txt
RUN echo $env_web3api_mutation_dir > mutation_dir.txt

RUN echo test $env_web3api_query_dir > test.txt

RUN cat query_dir.txt
RUN cat mutation_dir.txt
RUN cat test.txt

RUN if [[ -z "$env_web3api_query_dir" ]] ; then echo Argument not provided ; else echo Argument is $env_web3api_query_dir ; fi

# Build the query module
#RUN if [[ -n "$env_web3api_query_dir" ]]; \
 #   then asc $env_web3api_query_dir/w3/entry.ts --path ./node_modules --outFile ./build/query.wasm --use abort=src/query/w3/entry/w3Abort --optimize --debug --importMemory --runtime stub; \
 #   fi

# Build the mutation module
#RUN if [[ -n "$env_web3api_mutation_dir" ]]; \
 #   then asc $env_web3api_mutation_dir/w3/entry.ts --path ./node_modules --outFile ./build/mutation.wasm --use abort=src/mutation/w3/entry/w3Abort --optimize --debug --importMemory --runtime stub; \
 #   fi
