#!/bin/sh
yarn
./node_modules/.bin/asc ./wrap/entry.ts \
  --path ./node_modules \
  --outFile ./build/wrap.wasm \
  --use abort=./wrap/entry/wrapAbort \
  --optimize --importMemory \
  --runtime stub \
  --runPasses asyncify