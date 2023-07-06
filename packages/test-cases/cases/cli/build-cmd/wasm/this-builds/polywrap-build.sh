set -e

tinygo build -o main.wasm -target wasm-memory src/wrap/main.go

# Make the build directory
rm -rf ./build
mkdir ./build

wasm-snip -o ./build/wrap.wasm main.wasm -p syscall runtime.ticks fd_write
