---
id: mutation
title: Mutation
---

### approve

_Call the approve(...) function of an ERC20 token contract on-chain, allowing the Uniswap router contract to transfer tokens_

```graphql
approve(
  token: Token! # Token for which to approve the Uniswap router contract to transfer
  amount: BigInt # The amount to approve for transfer; defaults to maximum amount if null
  gasOptions: GasOptions # Transaction gas configuration
): Ethereum_TxResponse!
```

### execCall

_Send an Ethereum transaction to the given address_

```graphql
execCall(
  parameters: MethodParameters! # Transaction calldata and Ether value
  address: String! # Address of the target Ethereum contract
  chainId: ChainId! # Id of the chain on which to execute the transaction
  gasOptions: GasOptions # Transaction gas configuration
): Ethereum_TxResponse!
```

### execSwap

_Perform an on-chain swap with one or more trades in a single transaction_

```graphql
execSwap(
  trades: Trade[]! # Trades to encode into calldata
  swapOptions: SwapOptions! # Swap configuration
  gasOptions: GasOptions # Transaction gas configuration
): Ethereum_TxResponse!
```

### swap

_Perform an on-chain swap within a single pool by using token and fee amount information to find the correct pool_

```graphql
swap(
  inToken: Token! # Input token of the pool
  outToken: Token! # Output token of the pool
  fee: FeeAmount! # Fee amount of the pool being used for the swap
  amount: BigInt! # Amount being swapped in or out, depending on trade type
  tradeType: TradeType! # Type of trade, either exact input or exact output
  swapOptions: SwapOptions! # Swap configuration
  gasOptions: GasOptions # Transaction gas configuration
): Ethereum_TxResponse!
```

### swapWithPool

_Perform an on-chain swap using a single pool at provided address; requires ERC20-compliant input and output (i.e. no Ether)_

```graphql
swapWithPool(
  address: String! # Ethereum address of the pool used for the swap
  amount: TokenAmount! # Token amount being swapped in or out, depending on trade type
  tradeType: TradeType! # Type of trade, either exact input or exact output
  swapOptions: SwapOptions! # Swap configuration
  gasOptions: GasOptions # Transaction gas configuration
): Ethereum_TxResponse!
```

### deployPool

_Deploy a pool contract on-chain_

```graphql
deployPool(
  pool: Pool! # A representation of the pool to deploy
  gasOptions: GasOptions # Transaction gas configuration
): Ethereum_TxResponse!
```

### deployPoolFromTokens

_Deploy a pool contract on chain for the given tokens and fee amount_

```graphql
deployPoolFromTokens(
  tokenA: Token! # The first token of the pool, irrespective of sort order
  tokenB: Token! # The second token of the pool, irrespective of sort order
  fee: FeeAmount! # The fee tier of the pool
  gasOptions: GasOptions # Transaction gas configuration
): Ethereum_TxResponse!
```

