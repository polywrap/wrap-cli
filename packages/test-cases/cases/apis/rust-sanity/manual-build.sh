# Build the module at {{dir}}
cd query && cargo build --target wasm32-unknown-unknown

wasm-opt -O2 --asyncify