FROM node:16-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk --no-cache --virtual build-dependencies add \
    bash

# Install deps
COPY ./scripts/package.json ./
RUN yarn

# Copy the rest of our source files
COPY ./scripts ./

# Build
RUN yarn build

# Deploy
CMD yarn deployEns
