---
id: objects
title: Object Types
---


### Ethereum_Access 

```graphql
type Ethereum_Access {
  address: String! 
  storageKeys: String[]! 
}
```

### Ethereum_Connection 

```graphql
type Ethereum_Connection {
  node: String 
  networkNameOrChainId: String 
}
```

### Ethereum_EventNotification 

```graphql
type Ethereum_EventNotification {
  data: String! 
  address: String! 
  log: Ethereum_Log! 
}
```

### Ethereum_Log 

```graphql
type Ethereum_Log {
  blockNumber: BigInt! 
  blockHash: String! 
  transactionIndex: UInt32! 
  removed: Boolean! 
  address: String! 
  data: String! 
  topics: String[]! 
  transactionHash: String! 
  logIndex: UInt32! 
}
```

### Ethereum_Network 

```graphql
type Ethereum_Network {
  name: String! 
  chainId: BigInt! 
  ensAddress: String 
}
```

### Ethereum_StaticTxResult 

```graphql
type Ethereum_StaticTxResult {
  result: String! 
  error: Boolean! 
}
```

### Ethereum_TxOverrides 

```graphql
type Ethereum_TxOverrides {
  gasLimit: BigInt 
  gasPrice: BigInt 
  value: BigInt 
}
```

### Ethereum_TxReceipt 

```graphql
type Ethereum_TxReceipt {
  to: String! 
  from: String! 
  contractAddress: String! 
  transactionIndex: UInt32! 
  root: String 
  gasUsed: BigInt! 
  logsBloom: String! 
  transactionHash: String! 
  logs: Ethereum_Log[]! 
  blockNumber: BigInt! 
  blockHash: String! 
  confirmations: UInt32! 
  cumulativeGasUsed: BigInt! 
  effectiveGasPrice: BigInt! 
  byzantium: Boolean! 
  type: UInt32! 
  status: UInt32 
}
```

### Ethereum_TxRequest 

```graphql
type Ethereum_TxRequest {
  to: String 
  from: String 
  nonce: UInt32 
  gasLimit: BigInt 
  gasPrice: BigInt 
  data: String 
  value: BigInt 
  chainId: BigInt 
  type: UInt32 
}
```

### Ethereum_TxResponse 

```graphql
type Ethereum_TxResponse {
  hash: String! 
  to: String 
  from: String! 
  nonce: UInt32! 
  gasLimit: BigInt! 
  gasPrice: BigInt 
  data: String! 
  value: BigInt! 
  chainId: BigInt! 
  blockNumber: BigInt 
  blockHash: String 
  timestamp: UInt32 
  confirmations: UInt32! 
  raw: String 
  r: String 
  s: String 
  v: UInt32 
  type: UInt32 
  accessList: Ethereum_Access[] 
}
```

