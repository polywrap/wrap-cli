FROM rust:1.56 as base

# Install nightly rust
RUN rustup toolchain install nightly

# Update all installed rust toolchains
RUN rustup update

# Set the nightly channel as the default
RUN rustup override set nightly

# Install the wasm32 rust build target
RUN rustup target add wasm32-unknown-unknown

WORKDIR /linked-packages

COPY .w3/build/linked-packages/polywrap-wasm-rs ./polywrap-wasm-rs

WORKDIR /build-deps

# Install wasm-opt
RUN curl -L https://github.com/WebAssembly/binaryen/releases/download/version_101/binaryen-version_101-x86_64-linux.tar.gz | tar -xz \
    && chmod +x binaryen-version_101/bin/wasm-opt \
    && cp binaryen-version_101/bin/wasm-opt /usr/local/bin/ \
    && rm -rf binary-version_101

WORKDIR /project

# Copy all manifest files
COPY web3api.yaml .
COPY web3api.build.yaml .

# Copy all source files
COPY mutation mutation
COPY query query

# Install the toml-cli
RUN cargo install toml-cli

# Link any local packages
RUN PACKAGE_NAME=polywrap-wasm-rs; \
    toml set ./mutation/Cargo.toml dependencies.$PACKAGE_NAME.path /linked-packages/$PACKAGE_NAME > ./mutation/Cargo-local.toml && \
    rm -rf ./mutation/Cargo.toml && \
    mv ./mutation/Cargo-local.toml ./mutation/Cargo.toml && \
    toml set ./query/Cargo.toml dependencies.$PACKAGE_NAME.path /linked-packages/$PACKAGE_NAME > ./query/Cargo-local.toml && \
    rm -rf ./query/Cargo.toml && \
    mv ./query/Cargo-local.toml ./query/Cargo.toml && \
    true

# Remove any Cargo.lock files
RUN rm -rf mutation/Cargo.lock
RUN rm -rf query/Cargo.lock

# Build the module at mutation
RUN cargo +nightly build --manifest-path ./mutation/Cargo.toml \
    --release --target wasm32-unknown-unknown
# Build the module at query
RUN cargo +nightly build --manifest-path ./query/Cargo.toml \
    --release --target wasm32-unknown-unknown

# Make the build directory
RUN mkdir ./build

# Use wasm-opt to perform the "asyncify" post-processing step over all modules
RUN wasm-opt --asyncify -O2 ./mutation/target/wasm32-unknown-unknown/release/mutation.wasm -o ./build/mutation.wasm
RUN wasm-opt --asyncify -O2 ./query/target/wasm32-unknown-unknown/release/query.wasm -o ./build/query.wasm