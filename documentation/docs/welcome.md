---
id: welcome
title: Welcome!
description: TODOTODOTODO
slug: /
---

**Web3API** is a developer toolchain that allows for data querying and manipulation of Web3 protocols using any programming language.
<br/>

> _**⚠️ Heads up!** <br/> <br/>
> Web3API is in pre-alpha, meaning our code and documentation are rapidly changing. Have questions or want to get involved? Join our [Discord](https://discord.com/invite/Z5m88a5qWu) or [open an issue](https://github.com/Web3-API/monorepo/issues) on our GitHub repo._

<br/>

### **Getting started**

We know software docs can be overwhelming, especially for something as technical as a developer toolchain. That's why we've made this guide user-friendly for anyone interested in Web3API, whether you're a non-techie or an experienced programmer.

### **For: the casually interested reader**

[Website Demo](#website-demo)

### **For: developers**

_This section is under construction_

- Try the demo!
- Building on Web3API
- Create a Web3API [WASM Package, dApp, JS Plugin]

### **For: technical specification information**

_This section is under construction_

- Link to spec

---

<br/>

## **Website demo**

[Back to top](#getting-started)

We believe in learning by doing so we've put together a simple tutorial that should only take a few minutes of your time.

### **Prerequisites**<br/>

> _If you're an experienced Web3 dev, chances are you've already done this and can skip these pre-reqs._

1. Install the MetaMask Chrome extension [here](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) and set up your wallet.<br/>

   - **MetaMask** is a crypto wallet and gateway to blockchain apps. We'll be using it to connect to our demo. Learn more about MetaMask on their [homepage](https://metamask.io/).

2. Get some test ETH.<br/>

   - Log into MetaMask and switch your network to the **Rinkeby Test Network**.
   - We can get test ETH at a faucet like this [one](http://rinkeby-faucet.com/).
   - Copy your Rinkeby address from MetaMask and paste it into the website then click the "Submit" button.

And that's it 🎉! You're ready to use the Web3API website demo.

### **Website demo**<br/>

🏁 To begin, visit our Simple Storage dApp that's deployed on this website: [Web3API Demo](https://demo-simplestorage-web3api.on.fleek.co/). <br/>

**Here's an overview of our demo:**<br/>

<img
  src={require('./assets/demo_01.png').default}
  alt="Demo Screenshot"
  width="650"
/>

1. ENS Domain: `api.simplestorage.eth`
   - This is the ENS domain name that will be resolved to the underlying IPFS content identifier.
   - If you're unfamiliar with ENS and IPFS, this article does a great job explaining how they work: [A Guide to ENS Domains + IPFS by Fleek](https://medium.com/fleek/guide-ens-domains-ipfs-ethereum-name-service-26d6092cfadf).
2. IPFS
   - Once the Simple Storage smart contract has been deployed, you can view the storage on IPFS, which contains the downloaded Web3API.
3. Deploy `SimpleStorage.sol`
   - Clicking this button will initialize the Web3API client, sending a request to the ENS domain which resolves to the IPFS content identifier. At that point, our dApp will download the Web3API from IPFS.
4. GraphQL query
   - We've added a codeblock to help you see the GraphQL query that will be fired off when you click the deploy button.
   - [GraphQL](https://graphql.org/) is a query language for APIs. Access to GraphQL's simple data querying and manipulation is one of the reasons that Web3API is so easy to use -- Web3API enables the use a tool that's popular amongst Web2 developers to be used on Web3 projects.

Once you click the deploy button, you'll be prompted by MetaMask to send a transaction using your test ether (make sure you're still on the Rinkeby network).

After a few moments, an Etherscan link will appear to let you know that the `SimpleStorage.sol` smart contract has been deployed, and if you check the `api.simplestorage.eth` domain again, you'll see that it's been resolved to the IPFS content identifier. Click on the IPFS link to see the Web3API that was downloaded.

### **A quick note on the Web3API package**

After clicking the IPFS link, you'll be redirected to the IPFS storage containing the Web3API. It consists of the following files:

- `mutation.wasm`
- `query.wasm`
- `schema.graphql`
- `web3api.yaml`

We'll cover these files in detail in the _For: Developers_ section. These files are the core of Web3API -- they allow Web3 developers to build dApps that can easily query any blockchain, using _any_ programming language.

### **Back to the demo**

Now that your smart contract has been deployed and your application has downloaded the Web3API, your app has access to a new query to set the storage value on the smart contract.

Press the up or down arrow on the value input and then click the "Set Value" button to send a GraphQL "mutation" which modifies the storage value.

### **Demo conclusion**

We hope this demo gave you an idea of the simplicity that Web3API introduces to your dev team. By hosting the Web3API package on IPFS, we're able to reduce the size of your dApp, improve security, and enable Web3 queries using GraphQL. If you have any comments or feedback on what you saw, feel free to message our team on Discord.
