FROM ubuntu:latest
# Install curl and git
RUN apt-get update && apt-get install -y curl git

# Download and install pwrup and then use it to install pwr
RUN curl -L https://raw.githubusercontent.com/polywrap/pwr/main/pwrup/install | bash && /root/.pwr/bin/pwrup

WORKDIR /project
