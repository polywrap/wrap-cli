go mod tidy

tinygo build -o ./build/main.wasm -target ./.polywrap/wasm/build/strategy-used/wasm-memory.json ./module/wrap/main/main.go

wasm-snip -o ./build/wrap.wasm ./build/main.wasm -p syscall runtime.ticks fd_write tinygo

rm ./build/main.wasm
