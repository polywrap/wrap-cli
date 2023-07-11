go mod tidy

tinygo build -o ./build/main.wasm -target ./.polywrap/wasm/build/strategy-used/wasm-target.json ./module/wrap/main/main.go

wasm-snip -o ./build/wrap.wasm ./build/main.wasm -p fd_write clock_time_get args_sizes_get args_get

rm ./build/main.wasm
