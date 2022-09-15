asc src/wrap/entry.ts \
    --path ./node_modules \
    --outFile ./build/wrap.wasm \
    --use abort=src/wrap/entry/wrapAbort \
    --optimize --importMemory \
    --runtime stub \
    --runPasses asyncify