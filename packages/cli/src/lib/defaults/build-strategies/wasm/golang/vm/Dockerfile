FROM rust:1.60.0 as rust

RUN cargo install -f wasm-snip

FROM tinygo/tinygo:0.24.0

# Copy wasm-snip
COPY --from=rust /usr/local/cargo/bin/wasm-snip /usr/local/bin/
COPY wasm-memory.json /usr/local/tinygo/targets/
WORKDIR /project
