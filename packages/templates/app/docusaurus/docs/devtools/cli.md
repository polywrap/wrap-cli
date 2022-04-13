---
id: polywrap-cli
title: '@web3api/cli'
---

<a href="https://www.npmjs.com/package/@web3api/cli" target="_blank" rel="noopener noreferrer">
<img src="https://img.shields.io/npm/v/@web3api/cli.svg" alt="npm"/>
</a>

<br/>
<br/>
Command line interface for Polywrap.

## Installation

```bash
npm install @web3api/cli
```

## Usage

Install it and then in your project directory, see the list of available CLI commands by using the command:

```bash
w3 help
```

The following menu will appear in your terminal window:

```sh
w3 version 0.0.1-prealpha.12

  w3             🔥 Web3API CLI 🔥
  help (h)       -
  test-env (t)   Manage a test environment for Web3API
  query (q)      Query Web3APIs using recipe scripts
  create (c)     Create a new project with w3 CLI
  codegen (g)    Auto-generate API Types
  build (b)      Builds a Web3API and (optionally) uploads it to IPFS
```

Let's take a look at each of these options individually.

### `test-env (t)`

This command allows you to manage a test environment for Web3API.

```sh
w3 test-env command

Commands:
  up    Startup the test env
  down  Shutdown the test env
```

When the Web3API CLI starts or shuts down a test environment, it uses [Docker Compose](https://docs.docker.com/compose/). Compose is a tool for defining and running multi-container Docker applications. In this case, it will create an environment for Ethereum using [Ganache](https://www.trufflesuite.com/ganache) and IPFS using `localhost:5001`.

### `query (q)`

This command queries Web3APIs using recipe scripts, typically for testing purposes.

You can specific your recipe path, for example, with:

```sh
w3 query ./recipes/e2e.json
```

A simple `e2e.json` recipe file looks like the following:

```json title="./recipes/e2e.json"
[
  {
    "api": "ens/testnet/simplestorage.eth",
    "constants": "./constants.json"
  },
  {
    "query": "./get.graphql",
    "variables": {
      "address": "$SimpleStorageAddr",
      "network": "testnet"
    }
  },
  {
    "query": "./set.graphql",
    "variables": {
      "address": "$SimpleStorageAddr",
      "value": 5,
      "network": "testnet"
    }
  }
]
```

In the above example, the `constants.json` file could include the following:

```json
{
  "SimpleStorageAddr": "0x0E696947A06550DEf604e82C26fd9E493e576337"
}
```

### `create (c)`

Creates a new project with the Web3API CLI.

```sh
w3 create command <project-name> [options]

Commands:
  api <lang>     Create a Web3API project
    langs: assemblyscript
  app <lang>     Create a Web3API application
    langs: react
  plugin <lang>  Create a Web3API plugin
    langs: typescript

Options:
  -h, --help               Show usage information
  -o, --output-dir <path>  Output directory for the new project
```

### `codegen (g)`

TODO

### `build (b)`

Builds a Web3API and (optionally) uploads it to IPFS.

```sh
w3 build

Options:
  -h, --help
  -i, --ipfs
  -o, --output-dir
  -e, --test-ens
  -w, --watch
```

If you wanted to deploy to IPFS, simply use the command `-ipfs <ipfs uri>`.
