---
id: intro
title: Polywrap Generated Documentation
---

## Overview

Welcome to your generated Polywrap documentation!

Developers integrating wrappers into their app would use [GraphQL](https://graphql.org/) queries to execute functions provided by the wrappers. This documentation shows you which **query** and **mutation** functions are declared or imported in your schema, and how to use them.

Functions are executed by a Polywrap Client. The first Polywrap client is for JavaScript(`@web3api/client-js`) and it can run in any environment that can execute JavaScript. In the future, there will be Polywrap clients for other environments (Python, Go, and more).

## Polywrap wrapper vs. Language-specific SDK

Polywrap wrappers aim to be a substantial improvement over a language-specific SDK.

While a language-specific SDK bundles all classes, necessary data fields, and helper functions into the application, Polywrap wrappers do not. Instead, all business logic is deployed on a decentralized endpoint, like IPFS, and is downloaded at runtime when the client application launches.

You can learn more about the benefits of using Polywrap [here](https://docs.polywrap.io).

## Usage

In general, to use _any_ Polywrap wrapper in your application, all you need is the Polywrap Client.

The Polywrap JavaScript Client works in both Node.js and browser applications.

Start by installing the client using your favorite package manager.
```
npm install --save @web3api/client-js
```

Then, initialize the client.

```typescript
import { Web3ApiClient } from '@web3api/client-js';
const client = new Web3ApiClient();
```

Now, you're able to send queries to the wrapper!

```typescript
client.query({
  uri: 'ens/mywrapper.eth',
  query: `{
    foo(
      tokenA: ${tokenA}
      tokenB: ${tokenB}
    )
  }`,
});
```

Take a look at more sophisticated tooling, such as Polywrap's `useWeb3ApiQuery` hook, in the [Create a JS dApp](/guides/create-js-dapp/install-client) guide.

## Code

The **Pre-alpha** [Polywrap source code is available on GitHub](https://github.com/polywrap/monorepo).
