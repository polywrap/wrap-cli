---
id: Ethereum_objects
title: Ethereum Object Types
sidebar_position: 2
---


### Ethereum_AccessItem 

```graphql
type Ethereum_AccessItem {
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

### Ethereum_Eip1559FeesEstimate 

```graphql
type Ethereum_Eip1559FeesEstimate {
  maxFeePerGas: BigInt! 
  maxPriorityFeePerGas: BigInt! 
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

### Ethereum_StaticTxResult 

```graphql
type Ethereum_StaticTxResult {
  result: String! 
  error: Boolean! 
}
```

### Ethereum_TxOptions 

```graphql
type Ethereum_TxOptions {
  gasLimit: BigInt # Gas supplied for the transaction
  maxFeePerGas: BigInt #   The max total fee to pay per unit of gas.
The difference between maxFeePerGas and baseFeePerGas + maxPriorityFeePerGas is “refunded” to the user.
This property is ignored when gasPrice is not null.
  maxPriorityFeePerGas: BigInt #   The gas price paid is baseFeePerGas + maxPriorityFeePerGas.
The difference between maxFeePerGas and baseFeePerGas + maxPriorityFeePerGas is “refunded” to the user.
This property is ignored when gasPrice is not null.
  gasPrice: BigInt #   The gas price for legacy transactions.
If this property is not null, a legacy transaction will be sent and maxFeePerGas and maxPriorityFeePerGas will be ignored.
  value: BigInt # Ether value sent with transaction
  nonce: UInt32 # Override default nonce
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
  type: UInt32! 
  status: UInt32 
}
```

### Ethereum_TxRequest 

```graphql
type Ethereum_TxRequest {
  to: String 
  from: String 
  data: String 
  type: UInt32 
  chainId: BigInt 
  accessList: Ethereum_AccessItem[] 
  gasLimit: BigInt # Gas supplied for the transaction
  maxFeePerGas: BigInt #   The max total fee to pay per unit of gas.
The difference between maxFeePerGas and baseFeePerGas + maxPriorityFeePerGas is “refunded” to the user.
This property is ignored when gasPrice is not null.
  maxPriorityFeePerGas: BigInt #   The gas price paid is baseFeePerGas + maxPriorityFeePerGas.
The difference between maxFeePerGas and baseFeePerGas + maxPriorityFeePerGas is “refunded” to the user.
This property is ignored when gasPrice is not null.
  gasPrice: BigInt #   The gas price for legacy transactions.
If this property is not null, a legacy transaction will be sent and maxFeePerGas and maxPriorityFeePerGas will be ignored.
  value: BigInt # Ether value sent with transaction
  nonce: UInt32 # Override default nonce
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
  maxFeePerGas: BigInt 
  maxPriorityFeePerGas: BigInt 
  gasPrice: BigInt 
  value: BigInt! 
  chainId: BigInt! 
  blockNumber: BigInt 
  blockHash: String 
  timestamp: UInt32 
  r: String 
  s: String 
  v: UInt32 
  type: UInt32 
  accessList: Ethereum_AccessItem[] 
}
```

