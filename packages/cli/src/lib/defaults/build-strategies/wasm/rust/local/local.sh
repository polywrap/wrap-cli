#!/bin/sh
rustup target add wasm32-unknown-unknown
export RUSTFLAGS="-C link-arg=-z -C link-arg=stack-size=65536 -C link-arg=--import-memory"
cargo install toml-cli
cargo install wasm-snip

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
wasm-snip "$1"/target/wasm32-unknown-unknown/release/module.wasm -o "$2"/snipped_module.wasm
npx wasm-opt --asyncify -Os "$2"/snipped_module.wasm -o "$2"/wrap.wasm
  rm -rf "$2"/snipped_module.wasm