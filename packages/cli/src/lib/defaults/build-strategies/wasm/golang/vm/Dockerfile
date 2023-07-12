FROM rust:1.60.0 as rust

RUN cargo install -f wasm-snip

FROM polywrap/tinygo:0.28.1-polywrap.2

# Copy wasm-snip
COPY --from=rust /usr/local/cargo/bin/wasm-snip /usr/local/bin/

# Copy wasm-target.json
COPY wasm-target.json /usr/local/tinygo/targets/

WORKDIR /project
