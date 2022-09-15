toml set ./Cargo.toml lib.crate-type ["cdylib"] > ./Cargo-local.toml && \
  rm -rf ./Cargo.toml && \
  mv ./Cargo-local.toml ./Cargo.toml && \
  true

sed -i 's/"\[cdylib\]"/\["cdylib"\]/g' ./Cargo.toml

toml set ./Cargo.toml package.name "module" > ./Cargo-local.toml && \
  rm -rf ./Cargo.toml && \
  mv ./Cargo-local.toml ./Cargo.toml && \
  true

export RUSTFLAGS="-C link-arg=-z -C link-arg=stack-size=65536 -C link-arg=--import-memory"

cargo build --manifest-path ./Cargo.toml \
  --target wasm32-unknown-unknown --release

rm -rf ./build
mkdir ./build

export WASM_INTERFACE_TYPES=1

wasm-bindgen ./target/wasm32-unknown-unknown/release/module.wasm --out-dir ./build --out-name bg_module.wasm

wasm-snip ./build/bg_module.wasm -o ./build/snipped_module.wasm && \
  rm -rf ./build/bg_module.wasm

# Use wasm-opt to perform the "asyncify" post-processing step over all modules
wasm-opt --asyncify -Os ./build/snipped_module.wasm -o ./build/wrap.wasm && \
  rm -rf ./build/snipped_module.wasm