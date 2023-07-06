cd module

tinygo build -o ../build/wrap.wasm -target ../.polywrap/wasm/build/strategy-used/wasm-memory.json ./main/main.go
wasm-snip -o ../build/wrap_snip.wasm ../build/wrap.wasm -p syscall runtime.ticks fd_write

cd ../build
rm wrap.wasm
mv wrap_snip.wasm wrap.wasm
