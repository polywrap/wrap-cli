FROM namesty/w3api-node:latest
COPY . /app

RUN npm i && npm i -g assemblyscript@0.17.13
RUN asc ./src/query/w3/entry.ts --path ./node_modules --outFile ./build/query.wasm --optimize --debug --importMemory --runtime stub
RUN asc ./src/mutation/w3/entry.ts --path ./node_modules --outFile ./build/mutation.wasm --optimize --debug --importMemory --runtime stub