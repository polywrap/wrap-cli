FROM rust:1.70-alpine as base

# Install the wasm32 rust build target
RUN rustup target add wasm32-unknown-unknown

WORKDIR /build-deps

# Install curl
RUN apk add curl pkgconfig openssl-dev bash

# Install clang
RUN apk add clang llvm build-base

# Install the toml-cli
RUN cargo install toml-cli

# Install wasm-snip
RUN cargo install wasm-snip

# Install wasm-tools
RUN cargo install wasm-tools

# Install wasm-bindgen
RUN cargo install wasm-bindgen-cli

# Install wasm-opt
RUN cargo install wasm-opt

# Ensure the Wasm module is configured to use imported memory
ENV RUSTFLAGS="-C link-arg=-z -C link-arg=stack-size=65536 -C link-arg=--import-memory"

# Enable the "WASM_INTERFACE_TYPES" feature, which will remove the __wbindgen_throw import.
# See: https://github.com/rustwasm/wasm-bindgen/blob/7f4663b70bd492278bf0e7bba4eeddb3d840c868/crates/cli-support/src/lib.rs#L397-L403
ENV WASM_INTERFACE_TYPES=1

WORKDIR /project
