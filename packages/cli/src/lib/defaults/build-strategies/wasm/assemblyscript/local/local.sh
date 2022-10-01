#!/bin/sh
yarn
asc "$1"/wrap/entry.ts \
  --path ./node_modules \
  --outFile "$2"/wrap.wasm \
  --use abort="$1"/wrap/entry/wrapAbort \
  --optimize --importMemory \
  --runtime stub \
  --runPasses asyncify