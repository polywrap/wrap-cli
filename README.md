# Web3 API  
![](https://github.com/Web3-API/branding/blob/master/logo/Web3API_On_Black_BG.jpg?raw=true)  
> The Power of Web3,
The Ease of Web2  

**Web3API is in Pre-Alpha**  
**[Join Early Access](https://web3api.dev)**

## What?  
[Web3API](https://web3api.dev) allows smart contract developers to implement user-friendly, multi-platform, wrappers for their protocols in a language agnostic. Use Web3APIs in your favorite platforms and programming languages:  
Browser JS, Node.JS, Rust, Python, Go, C/C++, C#, etc  

At core of [Web3API](https://web3api.dev) is a WASM runtime that enables interactions with popular P2P networks:  
IPFS, Ethereum, Subgraph, etc  

These WASM modules, paired with a [subgraph](https://thegraph.com/) for historical data querying, combine together to **create a single GraphQL schema that defines the entirety of the protocol.**  

We call this GraphQL schema a [Web3API](https://web3api.dev).  

## How?  
Detailed user instructions will be available shortly. **[Join early access!](https://web3api.dev)**  

## Packages  
| Package | Version | Description |  
|---------|---------|-------------|  
| [@web3api/client-js](./packages/client-js) | pre-alpha | Javascript Client |  
| [@web3api/cli](./packages/cli) | pre-alpha | CLI |  
| [@web3api/wasm-ts](./packages/wasm-ts) | pre-alpha | Assemblyscript Runtime |  
| [@web3api/client-test-env](./packages/client-test-env) | pre-alpha | Dockerized Test Env |  

## Contributing  
### Prerequisites  
- `nvm`  
- `yarn`  
- `docker`
- `docker-compose`  

### Installation  
`nvm install && nvm use`  
`yarn`  

### Build  
`yarn build`  

### Test  
`yarn test:ci`  

or, if client-test-env is already running in the background:  
`yarn test`  

## Demos  

Each demo below showcases different aspects of Web3API. Please see the demo's README for further details and instructions.  

| Demo | Status |  
|------|--------|  
| [Simple Storage](./demos/simple-storage/README.md) | Running |  
| [Uniswap V2](./demos/uniswap-v2) | Not Running |  

## Contact  
For all inquiries, please email `jelli@dorg.tech` or create an issue in this repository.  
