---
id: what-is-polywrap
title: What is Polywrap?
---

**Polywrap** is a developer tool that enables easy integration of Web3 protocols into any application. It makes it possible for applications on any platform, written in any language, to read and write data to Web3 protocols.

:::tip
Polywrap is in **pre-alpha**, meaning our code and documentation are rapidly changing.

Polywrap is a recent rebrand of Web3API. While using the toolchain, you'll notice that `web3api` or `w3` is still used - we will be updating these soon!

Have questions or want to get involved? Join our [Discord](https://discord.com/invite/Z5m88a5qWu) or [open an issue](https://github.com/polywrap/monorepo/issues) on our GitHub repo.
:::

## Web3 protocol integration

Web3 developers may want to integrate functions into their own dapp that allows users to perform a token swap, for example. The main way that developers do this today is by installing a JavaScript SDK like the Uniswap SDK as a dependency into their dapp. While JavaScript SDKs is one way for dapps to interact with protocols, they come with major disadvantages.

## What's inside a Polywrap wrapper?

A Polywrap "wrapper" consists of the following files:

- **Query and mutation wasm modules** containing the protocol's business logic functions (e.g. Uniswap's swap functions)
- **GraphQL** schema to provide types and parameters for the query and mutation functions
- **Manifest** files that orchestrate the wrapper

## Where is it deployed?

We currently support deploying wrappers to decentralized endpoints, [Ethereum Name Service (ENS)](https://ens.domains/), a decentralized Ethereum-based naming system and [InterPlanetary File System (IPFS)](https://ipfs.io/), a distributed P2P file system. For an example of a deployed wrapper, take a look at the ENS domain below:

[ENS: Uniswap Polywrapper](https://app.ens.domains/name/v2.uniswap.web3api.eth)

The ENS domain above resolves to the IPFS content holding our Polywrap wrapper! Below is a link to the IPFS storage:

[IPFS: Uniswap Polywrapper](https://bafybeifwqlolknl7yvth452s63ujnx45xypgxaisbbgdb6izqjyfvn4igy.ipfs.dweb.link/)

## How can dapps integrate this deployed wrapper?

In a JavaScript application, a developer would first install the Polywrap JavaScript client. At that point, a Polywrap-enabled dapp will be able to download and use the protocol's functions. These functions are exported from query and mutation WebAssembly (wasm) modules, and can be used in any environment that can execute wasm functions (like your web browser!).

:::tip
The Polywrap JavaScript client allows the dapp to use **any** deployed wrapper. After instantiating the client, the dapp can call queries to the wrapper using familiar GraphQL. All that is needed in this query is:

1. The URI specifying the ENS or IPFS resolving to content containing the wrapper
2. Specifying the function and arguments provided by that wrapper

For detailed information on how to integrate in dapps, take a look at our [Create a JS Dapp](../../guides/create-js-dapp/install-client) guide.

For a guide on how to build your own Polywrap and deploy it for other developers to integrate into their own dapp, see our [Creating a wrapper guide](http://docs.polywrap.io.ipns.localhost:48084/guides/create-as-wrapper/project-setup).

:::
