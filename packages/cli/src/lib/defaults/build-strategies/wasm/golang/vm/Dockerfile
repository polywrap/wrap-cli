FROM rust:1.60.0 as rust

# Install wasm-snip
RUN cargo install -f wasm-snip

# Install Wasm Binary Toolkit
RUN wget https://github.com/WebAssembly/wabt/releases/download/1.0.33/wabt-1.0.33-ubuntu.tar.gz && \
    tar xfv wabt-1.0.33-ubuntu.tar.gz -C /usr/local

# Add it to the path
ENV PATH=${PATH}:/usr/local/wabt-1.0.33/bin

FROM polywrap/tinygo:0.28.1-polywrap.2

# Copy wasm-snip
COPY --from=rust /usr/local/cargo/bin/wasm-snip /usr/local/bin/

# Copy wasm-target.json
COPY wasm-target.json /usr/local/tinygo/targets/

USER root

WORKDIR /project
