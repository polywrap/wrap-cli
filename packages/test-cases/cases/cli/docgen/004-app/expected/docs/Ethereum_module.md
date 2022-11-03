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
  timeout: UInt32! 
  connection: Ethereum_Connection 
): Ethereum_TxReceipt!
```

### callContractMethod 

```graphql
callContractMethod(
  address: String! 
  method: String! 
  args: String[] 
  connection: Ethereum_Connection 
  txOverrides: Ethereum_TxOverrides 
): Ethereum_TxResponse!
```

### callContractMethodAndWait 

```graphql
callContractMethodAndWait(
  address: String! 
  method: String! 
  args: String[] 
  connection: Ethereum_Connection 
  txOverrides: Ethereum_TxOverrides 
): Ethereum_TxReceipt!
```

### callContractStatic 

```graphql
callContractStatic(
  address: String! 
  method: String! 
  args: String[] 
  connection: Ethereum_Connection 
  txOverrides: Ethereum_TxOverrides 
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
): Boolean!
```

### deployContract 

```graphql
deployContract(
  abi: String! 
  bytecode: String! 
  args: String[] 
  connection: Ethereum_Connection 
): String!
```

### encodeFunction 

```graphql
encodeFunction(
  method: String! 
  args: String[] 
): String!
```

### encodeParams 

```graphql
encodeParams(
  types: String[]! 
  values: String[]! 
): String!
```

### estimateContractCallGas 

```graphql
estimateContractCallGas(
  address: String! 
  method: String! 
  args: String[] 
  connection: Ethereum_Connection 
  txOverrides: Ethereum_TxOverrides 
): BigInt!
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

### getGasPrice 

```graphql
getGasPrice(
  connection: Ethereum_Connection 
): BigInt!
```

### getNetwork 

```graphql
getNetwork(
  connection: Ethereum_Connection 
): Ethereum_Network!
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

### requestAccounts 

```graphql
requestAccounts(
  connection: Ethereum_Connection 
): String[]!
```

### sendRPC 

```graphql
sendRPC(
  method: String! 
  params: String[]! 
  connection: Ethereum_Connection 
): String
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

### solidityKeccak256 

```graphql
solidityKeccak256(
  types: String[]! 
  values: String[]! 
): String!
```

### solidityPack 

```graphql
solidityPack(
  types: String[]! 
  values: String[]! 
): String!
```

### soliditySha256 

```graphql
soliditySha256(
  types: String[]! 
  values: String[]! 
): String!
```

### toEth 

```graphql
toEth(
  wei: BigInt! 
): String!
```

### toWei 

```graphql
toWei(
  eth: String! 
): BigInt!
```

### waitForEvent 

```graphql
waitForEvent(
  address: String! 
  event: String! 
  args: String[] 
  timeout: UInt32 
  connection: Ethereum_Connection 
): Ethereum_EventNotification!
```

