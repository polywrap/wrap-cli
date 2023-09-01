FROM ubuntu:latest
RUN apt-get update && apt-get install -y curl git

RUN curl -L https://raw.githubusercontent.com/polywrap/pwr/main/pwrup/install | bash
RUN /bin/bash -i -c "source ~/.bashrc; pwrup"

WORKDIR /project
