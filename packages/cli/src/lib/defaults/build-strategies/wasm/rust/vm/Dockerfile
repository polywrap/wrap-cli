FROM rust:1.60.0 as base

# Install the wasm32 rust build target
RUN rustup target add wasm32-unknown-unknown

WORKDIR /build-deps

# Install curl
RUN apt-get update
RUN apt-get -y install curl clang llvm build-essential

# Install wasm-opt
RUN curl -L https://github.com/WebAssembly/binaryen/releases/download/version_101/binaryen-version_101-x86_64-linux.tar.gz | tar -xz \
    && chmod +x binaryen-version_101/bin/wasm-opt \
    && cp binaryen-version_101/bin/wasm-opt /usr/local/bin/ \
    && rm -rf binary-version_101

# Install the toml-cli
RUN cargo install -f toml-cli

# Install wasm-snip
RUN cargo install -f wasm-snip

# Install cargo-build-deps
RUN cargo install -f cargo-build-deps

ENV RUSTFLAGS="-C link-arg=-z -C link-arg=stack-size=65536 -C link-arg=--import-memory"

WORKDIR /project
