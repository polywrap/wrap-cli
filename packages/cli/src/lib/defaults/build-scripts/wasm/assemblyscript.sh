#!/bin/sh
asc "$1"/src/wrap/entry.ts \
  --path ./node_modules \
  --outFile "$2"/wrap.wasm \
  --use abort="$3" \
  --optimize --importMemory \
  --runtime stub \
  --runPasses asyncify