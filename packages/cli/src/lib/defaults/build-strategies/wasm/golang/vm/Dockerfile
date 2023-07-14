FROM ubuntu:22.10 as ubuntu

# Install build essentials (needed by wasm binary toolkit)
RUN apt-get update && apt-get install -y \
    build-essential \
    libstdc++6 \
    wget

# Install Wasm Binary Toolkit
RUN wget https://github.com/WebAssembly/wabt/releases/download/1.0.33/wabt-1.0.33-ubuntu.tar.gz && \
    tar xfv wabt-1.0.33-ubuntu.tar.gz -C /usr/local

# Add it to the path
ENV PATH=${PATH}:/usr/local/wabt-1.0.33/bin

FROM rust:1.60.0 as rust

# Install wasm-snip
RUN cargo install -f wasm-snip

FROM polywrap/tinygo:0.28.1-polywrap.2

# Copy wasm-snip
COPY --from=rust /usr/local/cargo/bin/wasm-snip /usr/local/bin/

# Copy wasm binary toolkit
COPY --from=ubuntu /usr/local/wabt-1.0.33/bin /usr/local/bin/

# Copy wasm-target.json
COPY wasm-target.json /usr/local/tinygo/targets/

USER root

WORKDIR /project
