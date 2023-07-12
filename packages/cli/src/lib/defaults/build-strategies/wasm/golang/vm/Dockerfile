FROM rust:1.60.0 as rust

RUN cargo install -f wasm-snip

FROM polywrap/tinygo:latest

# Copy wasm-snip
COPY --from=rust /usr/local/cargo/bin/wasm-snip /usr/local/bin/

# Copy wasm-target.json
COPY wasm-target.json /usr/local/tinygo/targets/

WORKDIR /project
