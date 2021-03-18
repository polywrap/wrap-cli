ARG modules_to_build

FROM namesty/w3api-node:latest as base
ONBUILD COPY . /app
ONBUILD RUN npm i && npm i -g assemblyscript@0.17.13

# https://stackoverflow.com/questions/31528384/conditional-copy-add-in-dockerfile

FROM base as query
ONBUILD RUN asc ./src/query/w3/entry.ts --path ./node_modules --outFile ./build/query.wasm --optimize --debug --importMemory --runtime stub

FROM base as mutation
ONBUILD RUN asc ./src/mutation/w3/entry.ts --path ./node_modules --outFile ./build/mutation.wasm --optimize --debug --importMemory --runtime stub

FROM base as both
ONBUILD RUN asc ./src/query/w3/entry.ts --path ./node_modules --outFile ./build/query.wasm --optimize --debug --importMemory --runtime stub
ONBUILD RUN asc ./src/mutation/w3/entry.ts --path ./node_modules --outFile ./build/mutation.wasm --optimize --debug --importMemory --runtime stub

FROM ${modules_to_build}