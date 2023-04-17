#!/bin/sh
yarn
npx asc "$1"/wrap/entry.ts \
  --path ./node_modules \
  --outFile "$2"/wrap.wasm \
  --use abort="$1"/wrap/entry/wrapAbort \
  --optimize --optimizeLevel 3 --shrinkLevel 2 \
  --importMemory \
  --runtime stub \
  --runPasses asyncify