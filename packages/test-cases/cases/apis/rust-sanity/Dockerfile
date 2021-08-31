FROM rust:1.45 as base

# Install the wasm32 rust build target
RUN rustup target add wasm32-unknown-unknown

WORKDIR /project

# Install wasm-opt
RUN curl -L https://github.com/WebAssembly/binaryen/releases/download/version_101/binaryen-version_101-x86_64-linux.tar.gz | tar -xz \
    && chmod +x binaryen-version_101/bin/wasm-opt \
    && cp binaryen-version_101/bin/wasm-opt /usr/local/bin/ \
    && rm -rf binary-version_101

# Copy all manifest files
COPY web3api.yaml .
COPY .w3/build/env/web3api.build.yaml .

# Copy all source files

COPY mutation mutation

# Remove any Cargo.lock files
RUN rm -rf mutation/Cargo.lock
COPY query query

# Remove any Cargo.lock files
RUN rm -rf query/Cargo.lock

# Build the module at mutation
RUN cargo build --manifest-path ./mutation/Cargo.toml \
    --release --target wasm32-unknown-unknown
# Build the module at query
RUN cargo build --manifest-path ./query/Cargo.toml \
    --release --target wasm32-unknown-unknown

# Make the build directory
RUN mkdir ./build

# Use wasm-opt to perform the "asyncify" post-processing step over all modules
RUN wasm-opt --asyncify -O2 ./mutation/target/wasm32-unknown-unknown/release/mutation.wasm -o ./build/mutation.wasm
RUN wasm-opt --asyncify -O2 ./query/target/wasm32-unknown-unknown/release/query.wasm -o ./build/query.wasm
