cd module
tinygo build -o wrap.wasm -target ../wasm-memory.json ./main/main.go
wasm-snip -o ./wrap_snip.wasm wrap.wasm -p syscall runtime.ticks fd_write
