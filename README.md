# Web3 API  
![](https://github.com/Web3-API/branding/blob/master/logo/Web3API_On_Black_BG.jpg?raw=true)  
**The Power of Web3,
The Ease of Web2**  
*The Universal Integration Standard for Web3*  

**Web3API is in Pre-Alpha**  
**[Join Early Access](https://web3api.dev)**

## What?  
[Web3API](https://web3api.dev) is a developer toolchain that brings the ease of Web2 to Web3. This project aims to make integrating Web3 protocols into your apps seamlessly, without sacrificing decentralization.  

In addition, Web3API is built with multi-platform support in mind. The Web3API standard allows Web3 protocols to run on all types of devices in your favorite programming language (Rust, Javascript, Python, Go, C, C#, etc).  

Our goal is to build a fluid and efficient environment that will bring Web2 developers and enterprises into the Web3 space. We are taking the one-dimensional and fragmented developer environment of Web3 and bringing standardization, composability, and multi-platform support.  

Here is a [video explainer](http://video.web3api.eth.link) for the visual learners.  

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

### Lint
`yarn lint`

To autofix lint errors:
`yarn lint:fix`

## Demos  

Each demo below showcases different aspects of Web3API. Please see the demo's README for further details and instructions.  

| Demo | Status |  
|------|--------|  
| [Simple Storage](./demos/simple-storage/README.md) | Running |  
| [Uniswap V2](./demos/uniswap-v2) | Not Running |  

## Contact  
For all inquiries, please email `jelli@dorg.tech` or create an issue in this repository.  
