#!/bin/sh
rustup target add wasm32-unknown-unknown
export RUSTFLAGS="-C link-arg=-z -C link-arg=stack-size=65536 -C link-arg=--import-memory"
cargo install toml-cli
cargo install wasm-snip
cargo install wasm-bindgen-cli

toml set "$1"/Cargo.toml lib.crate-type ["cdylib"] > "$1"/Cargo-local.toml && \
  rm -rf "$1"/Cargo.toml && \
  mv "$1"/Cargo-local.toml "$1"/Cargo.toml

# Clean up artifacts left by the toml CLI program ("["cdylib"]" -> ["cdylib"])
sed -i 's/"\[cdylib\]"/\["cdylib"\]/g' "$1"/Cargo.toml

# Ensure the package name = "module"
toml set "$1"/Cargo.toml package.name "module" > "$1"/Cargo-local.toml && \
  rm -rf "$1"/Cargo.toml && \
  mv "$1"/Cargo-local.toml "$1"/Cargo.toml

cargo build --manifest-path "$1"/Cargo.toml \
  --target wasm32-unknown-unknown --release
export WASM_INTERFACE_TYPES=1
wasm-bindgen "$1"/target/wasm32-unknown-unknown/release/module.wasm --out-dir "$2" --out-name bg_module.wasm
wasm-snip "$2"/bg_module.wasm -o "$2"/snipped_module.wasm && \
  rm -rf "$2"/bg_module.wasm
npx wasm-opt --asyncify -Os "$2"/snipped_module.wasm -o "$2"/wrap.wasm
  rm -rf "$2"/snipped_module.wasm