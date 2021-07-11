# [**Polywrap**](https://polywrap.io) &middot; The Web3 Integration Standard

> ⚠️ _Polywrap is in pre-alpha, meaning our code and documentation are rapidly changing._
>
> Have questions or want to get involved? Join our community [Discord](https://discord.com/invite/Z5m88a5qWu) or [open an issue](https://github.com/polywrap/monorepo/issues) on Github.

**Polywrap** is a developer tool that enables easy integration of Web3 protocols into any application. It makes it possible for applications on any platform, written in any language, to read and write data to Web3 protocols.

## Documentation

For detailed information about our toolchain, visit our [developer documentation](https://docs.polywrap.io/).

The documentation is divided into helpful sections:

- [What is Polywrap?](https://docs.polywrap.io/whatis)
- [Creating a wrapper](https://docs.polywrap.io/guides/create-as-wrapper/pt1)
- [Integrating into a JS dapp](https://docs.polywrap.io/guides/create-js-dapp/01)

## Overview of the Polywrap project

The Polywrap project is completely open-source and we welcome contributors of all levels.

Come visit our [Github issues](https://github.com/polywrap/monorepo/issues) to see the problems we're focused on solving. Here are some of our tags for issues and what they mean:

- `good first issue` - These are good first issues for newcomers to learn about how our project works

- `pri-0`, `pri-1` and `pri-2` - These are our priority issues, with `pri-0` being our highest priority and `pri-2` being lower.

- `alpha-blocker` - We're in pre-alpha right now and to get to alpha, we need to resolve all alpha blocker issues

- `beta-blocker` - After our alpha release, we'll start working towards releasing our beta! These are the blockers for us in reaching that milestone.

Below are a series of steps to get started with our monorepo after you've cloned it into your local repository.

## Pre-reqs

You'll need the following installed before building your wrapper:

`nvm`

`yarn`

`docker`

`docker-compose`

## Installation

To ensure all of your project's dependencies are installed, from inside your project's directory, simply run:

```
nvm install && nvm use
yarn
```

## Build

Run the following to compile the monorepo:

`yarn build`

## Test

Run the following to test if the build worked:

```
yarn test:ci
```

Or, if the client test environment (`client-test-env`) is already running in the background, then simply run:

```
yarn test
```

## Lint

To lint your project directory, run the following:

```
yarn lint
```

To auto-fix lint errors:

```
yarn lint: fix
```

---

## Resources to contribute or learn more about our project

- [Website](https://polywrap.io/)
- [Documentation](https://docs.polywrap.io/)
- [Forum](https://forum.polywrap.io/)
