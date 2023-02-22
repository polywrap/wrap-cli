---
id: Ethereum_module
title: Ethereum Module
sidebar_position: 1
---

### awaitTransaction 

```graphql
awaitTransaction(
  txHash: String! 
  confirmations: UInt32! 
  timeout: UInt32 
  connection: Ethereum_Connection 
): Ethereum_TxReceipt!
```

### callContractMethod 

```graphql
callContractMethod(
  address: String! 
  method: String! 
  args: String[] 
  options: Ethereum_TxOptions 
  connection: Ethereum_Connection 
): Ethereum_TxResponse!
```

### callContractMethodAndWait 

```graphql
callContractMethodAndWait(
  address: String! 
  method: String! 
  args: String[] 
  options: Ethereum_TxOptions 
  connection: Ethereum_Connection 
): Ethereum_TxReceipt!
```

### callContractStatic 

```graphql
callContractStatic(
  address: String! 
  method: String! 
  args: String[] 
  options: Ethereum_TxOptions 
  connection: Ethereum_Connection 
): Ethereum_StaticTxResult!
```

### callContractView 

```graphql
callContractView(
  address: String! 
  method: String! 
  args: String[] 
  connection: Ethereum_Connection 
): String!
```

### checkAddress 

```graphql
checkAddress(
  address: String! 
  connection: Ethereum_Connection 
): Boolean!
```

### decodeFunction 

```graphql
decodeFunction(
  method: String! 
  data: String! 
  connection: Ethereum_Connection 
): String[]!
```

### deployContract 

```graphql
deployContract(
  abi: String! 
  bytecode: String! 
  args: String[] 
  options: Ethereum_TxOptions 
  connection: Ethereum_Connection 
): String!
```

### encodeFunction 

```graphql
encodeFunction(
  method: String! 
  args: String[] 
  connection: Ethereum_Connection 
): String!
```

### encodeParams 

```graphql
encodeParams(
  types: String[]! 
  values: String[]! 
  connection: Ethereum_Connection 
): String!
```

### estimateContractCallGas 

```graphql
estimateContractCallGas(
  address: String! 
  method: String! 
  args: String[] 
  options: Ethereum_TxOptions 
  connection: Ethereum_Connection 
): BigInt!
```

### estimateEip1559Fees 

```graphql
estimateEip1559Fees(
  connection: Ethereum_Connection 
): Ethereum_Eip1559FeesEstimate!
```

### estimateTransactionGas 

```graphql
estimateTransactionGas(
  tx: Ethereum_TxRequest! 
  connection: Ethereum_Connection 
): BigInt!
```

### getBalance 

```graphql
getBalance(
  address: String! 
  blockTag: BigInt 
  connection: Ethereum_Connection 
): BigInt!
```

### getChainId 

```graphql
getChainId(
  connection: Ethereum_Connection 
): String!
```

### getGasPrice 

```graphql
getGasPrice(
  connection: Ethereum_Connection 
): BigInt!
```

### getSignerAddress 

```graphql
getSignerAddress(
  connection: Ethereum_Connection 
): String!
```

### getSignerBalance 

```graphql
getSignerBalance(
  blockTag: BigInt 
  connection: Ethereum_Connection 
): BigInt!
```

### getSignerTransactionCount 

```graphql
getSignerTransactionCount(
  blockTag: BigInt 
  connection: Ethereum_Connection 
): BigInt!
```

### sendRpc 

```graphql
sendRpc(
  method: String! 
  params: String[]! 
  connection: Ethereum_Connection 
): String!
```

### sendTransaction 

```graphql
sendTransaction(
  tx: Ethereum_TxRequest! 
  connection: Ethereum_Connection 
): Ethereum_TxResponse!
```

### sendTransactionAndWait 

```graphql
sendTransactionAndWait(
  tx: Ethereum_TxRequest! 
  connection: Ethereum_Connection 
): Ethereum_TxReceipt!
```

### signMessage 

```graphql
signMessage(
  message: String! 
  connection: Ethereum_Connection 
): String!
```

### signMessageBytes 

```graphql
signMessageBytes(
  bytes: Bytes! 
  connection: Ethereum_Connection 
): String!
```

### signTransaction 

_Sign a transaction and return the signature. Requires wallet signer (i.e. signer with private key)_

```graphql
signTransaction(
  tx: Ethereum_TxRequest! 
  connection: Ethereum_Connection 
): String!
```

### toEth 

```graphql
toEth(
  wei: String! 
): String!
```

### toWei 

```graphql
toWei(
  eth: String! 
): String!
```

