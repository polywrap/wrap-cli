# Web3 API
![](https://raw.githubusercontent.com/Web3-API/branding/master/img/web3api.png?token=ABKEFUDHBMJG5SMI5O63JSC7ANZ3U)  
> The power of Web3, the ease of Web2.

**Use any Web3 smart contract protocol with REST or GraphQL, in any language, no smart contract SDKs required**.

## App Devs
**Use Web3 APIs...**
```typescript
import { request, query } from '@web3api/client-js';

// REST
request('api.1inch.eth/swap?from=’USDC’&to=’ETH’&amount=500');

// GraphQL
query('api.1inch.eth', `{ swap(“USDC”, “ETH”, 500) { slippage } }`);
```
**BUIDL** dynamic applications.  

**Forget about** embedding smart contract SDKs & ABIs.  

**Focus on** building a better user experience.  

## Smart Contract Devs
**Define Web3 APIs...**
```graphql
type Mutation {
  swap(
    from: String!
    to: String!
    amount: Number!
  ): SwapInfo!
}

interface SwapInfo {
  slippage: Percentage!
  gasCost: WEI!
}

type Exchange @entity {
  id: ID! @address("exchange")
  swaps: [Swap!]! @deriveFrom("exchange")
}

type Swap @entity {
  id: ID!
  exchange: Exchange!
}
```

**BUIDL** multi-platform APIs.  

**Forget about** authoring language specific APIs.  

**Focus on** authoring & testing smart contracts.  

## Features
A single schema for reading and interacting with smart contract protocols, complete with:  
* [GraphQL Schema](./packages/docs/protocol-specification/graphql-schema.md)  
* [REST Interface](./packages/docs/protocol-specification/rest-interface.md)  
* [Smart Contract ABI Binding](./packages/docs/protocol-specification/abi-binding.md)  
* [Smart Contract Event Processing (Subgraph)](./packages/docs/protocol-specification/event-processing.md)  
* [Multi-Platform Logic Modules](./packages/docs/protocol-specification/multi-platform-logic-modules.md)  
* [Complex Multi-Step Transactions & Queries](./packages/docs/protocol-specification/complex-transactions-and-queries.md)  
* [Combining Smart Contract Protocols](./packages/docs/protocol-specification/combine-protocols.md)  
* [3rd Party Extensions](./packages/docs/protocol-specification/extend-protocols.md)  
