---
id: types
title: Object Types
---


### NextTickResult

_Return value of nextInitializedTickWithinOneWord(...)_

```graphql
type NextTickResult {
  index: Int32! # Tick index of returned next tick
  found: Boolean! # True if the returned tick index represents an initialized tick, or false if max or min tick are returned instead
}
```

### PoolChangeResult

_Input or output amount and next pool state; return value of getPoolInputAmount(...) and getPoolOutputAmount(...)_

```graphql
type PoolChangeResult {
  amount: TokenAmount! # input or output amount resulting from simulated swap
  nextPool: Pool! # Pool state after simulated swap
}
```

### TradeRoute

_Input used to create a trade_

```graphql
type TradeRoute {
  route: Route! # The route of the trade
  amount: TokenAmount! # The amount being passed in or out, depending on the trade type
}
```

### IncentiveKey

_Represents a unique staking program._

```graphql
type IncentiveKey {
  rewardToken: Token! # The token rewarded for participating in the staking program.
  pool: Pool! # The pool that the staked positions must provide in.
  startTime: BigInt! # The time when the incentive program begins.
  endTime: BigInt! # The time that the incentive program ends.
  refundee: String! # The address which receives any remaining reward tokens at `endTime`.
}
```

### ClaimOptions

_Options to specify when claiming rewards._

```graphql
type ClaimOptions {
  tokenId: BigInt! # The id of the NFT
  recipient: String! # Address to send rewards to.
  amount: BigInt # The amount of `rewardToken` to claim. 0 claims all.
}
```

### FullWithdrawOptions

_Options to specify when withdrawing tokens_

```graphql
type FullWithdrawOptions {
  owner: String! # Set when withdrawing. The position will be sent to `owner` on withdraw.
  data: String # Set when withdrawing. `data` is passed to `safeTransferFrom` when transferring the position from contract back to owner.
  tokenId: BigInt! 
  recipient: String! 
  amount: BigInt 
}
```

### QuoteOptions

_Optional arguments to send to the quoter._

```graphql
type QuoteOptions {
  sqrtPriceLimitX96: BigInt # The optional price limit for the trade.
}
```

### CommonAddLiquidityOptions

_Options for producing the calldata to add liquidity._

```graphql
type CommonAddLiquidityOptions {
  slippageTolerance: String! # How much the pool price is allowed to move.
  deadline: BigInt! # When the transaction expires, in epoch seconds.
  useNative: Token # Whether to spend ether. If true, one of the pool tokens must be WETH, by default false
  token0Permit: PermitOptions # The optional permit parameters for spending token0
  token1Permit: PermitOptions # The optional permit parameters for spending token1
}
```

### AddLiquidityOptions

_Union of MintOptions and IncreaseOptions; one of either recipient or tokenId is required._

```graphql
type AddLiquidityOptions {
  recipient: String # The account that should receive the minted NFT.
  createPool: Boolean # Creates pool if not initialized before mint. Ignored if recipient is not null.
  tokenId: BigInt # Indicates the ID of the position to increase liquidity for. Ignored if recipient is not null.
  slippageTolerance: String! 
  deadline: BigInt! 
  useNative: Token 
  token0Permit: PermitOptions 
  token1Permit: PermitOptions 
}
```

### SafeTransferOptions

_Options to specify when calling safeTransferFrom(...) to transfer an NFT_

```graphql
type SafeTransferOptions {
  sender: String! # The account sending the NFT.
  recipient: String! # The account that should receive the NFT.
  tokenId: BigInt! # The id of the token being sent.
  data: String # The optional parameter that passes data to the `onERC721Received` call for the staker
}
```

### CollectOptions

_Options to specify when calling collectCallParameters(...) to collect liquidity provider rewards or removeCallParameters(...) to exit a liquidity position._

```graphql
type CollectOptions {
  tokenId: BigInt! # Indicates the ID of the position to collect for. Ignored when CollectOptions is as property of RemoveLiquidityOptions for use in removeCallParameters(...).
  expectedCurrencyOwed0: TokenAmount! # Expected value of tokensOwed0, including as-of-yet-unaccounted-for fees/liquidity value to be burned
  expectedCurrencyOwed1: TokenAmount! # Expected value of tokensOwed1, including as-of-yet-unaccounted-for fees/liquidity value to be burned
  recipient: String! # The account that should receive the tokens.
}
```

### NFTPermitOptions

_Permission parameters for NFT transfers, in case the transaction is being sent by an account that does not own the NFT_

```graphql
type NFTPermitOptions {
  v: PermitV! 
  r: String! 
  s: String! 
  deadline: BigInt! 
  spender: String! 
}
```

### RemoveLiquidityOptions

_Options for producing the calldata to exit a position._

```graphql
type RemoveLiquidityOptions {
  tokenId: BigInt! # The ID of the token to exit
  liquidityPercentage: String! # The percentage of position liquidity to exit.
  slippageTolerance: String! # How much the pool price is allowed to move.
  deadline: BigInt! # When the transaction expires, in epoch seconds.
  burnToken: Boolean # Whether the NFT should be burned if the entire position is being exited, by default false.
  permit: NFTPermitOptions # The optional permit of the token ID being exited, in case the exit transaction is being sent by an account that does not own the NFT
  collectOptions: CollectOptions! # Parameters to be passed on to collect; tokenId is ignored.
}
```

### Currency

_Describes a token_

```graphql
type Currency {
  decimals: UInt8! # Token decimals
  symbol: String # Token symbol
  name: String # Token name
}
```

### Token

_ERC20-compliant token or Ether_

```graphql
type Token {
  chainId: ChainId! # Id of chain where token exists
  address: String! # Address of token's ERC20 contract
  currency: Currency! # Token description
}
```

### Price

_Represents price of a token in terms of another token. When used as a function argument, the 'price' property is ignored._

```graphql
type Price {
  baseToken: Token! # The base token of the price
  quoteToken: Token! # The quote token of the price
  denominator: BigInt! # Amount of base token used to calculate price
  numerator: BigInt! # Amount of quote token used to calculate price
  price: String! # A decimal string representation of the price
}
```

### TokenAmount

_An amount of a token_

```graphql
type TokenAmount {
  token: Token! # Token
  amount: BigInt! # Raw amount of the token, not adjusted for the token's decimals
}
```

### Tick

_A pool tick marks a section of the price curve. A liquidity provider may hold a position on a tick, rather than the full curve._

```graphql
type Tick {
  index: Int32! # Tick index
  liquidityGross: BigInt! # Gross liquidity in Pool at tick position
  liquidityNet: BigInt! # Net liquidity in Pool at tick position
}
```

### Pool

_A liquidity pool involving two tokens which can be exchanged for a price determined by a price curve and market dynamics_

```graphql
type Pool {
  token0: Token! # The first token of the pool
  token1: Token! # The second token of the pool
  fee: FeeAmount! # The fee amount liquidity providers receive as a share of swaps made in the pool
  sqrtRatioX96: BigInt! # An encoded representation of the current swap price
  liquidity: BigInt! # The total liquidity available in the pool
  tickCurrent: Int32! # The current tick
  tickDataProvider: Tick[]! # A list of all ticks in the pool
  token0Price: Price! # The current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
  token1Price: Price! # The current mid price of the pool in terms of token1, i.e. the ratio of token0 over token1
}
```

### Route

_An ordered path of pools through which a swap can occur_

```graphql
type Route {
  pools: Pool[]! # A list of pools, wherein each pool in the list has a token in common with its adjacent pool(s)
  path: Token[]! # The path of tokens that are swapped through the pools
  input: Token! # The input token, where the route begins
  output: Token! # The output token, where the route ends
  midPrice: Price! # The mid price of the output token, in terms of the input token, for this route
}
```

### TradeSwap

_A route, input, and output amount that compose the core elements of a trade_

```graphql
type TradeSwap {
  route: Route! # The route of the trade
  inputAmount: TokenAmount! # The amount being passed in
  outputAmount: TokenAmount! # The amount returned by the trade when executed
}
```

### Trade

_A trade contains the information necessary to create an on-chain exchange of tokens_

```graphql
type Trade {
  swaps: TradeSwap[]! # A list of swaps to be executed atomically, all of which must have the same input and output tokens
  tradeType: TradeType! # Type of trade, either exact input or exact output
  inputAmount: TokenAmount! # The total input amount (sum of input amounts in swaps)
  outputAmount: TokenAmount! # The total output amount (sum of output amounts in swaps)
  executionPrice: Price! # The price of the trade, in terms of the input token
  priceImpact: Fraction! # The percent difference between the route's mid price and the price impact
}
```

### Fraction

_Represents fraction, typically a percent._

```graphql
type Fraction {
  numerator: BigInt! # Numerator of fraction
  denominator: BigInt! # Denominator of fraction
  quotient: String! # A decimal string representation of the fraction
}
```

### BestTradeOptions

_Options used when determining the best trade in bestTradeExactIn(...) and bestTradeExactOut(...)_

```graphql
type BestTradeOptions {
  maxNumResults: UInt32 # Maximum number of results to return
  maxHops: UInt32 # Maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pool
}
```

### Position

_A liquidity position between two ticks in a pool_

```graphql
type Position {
  pool: Pool! # The pool on which the position is held
  tickLower: Int32! # The lower tick, marking the lower boundary of the position
  tickUpper: Int32! # The upper tick, marking the upper boundary of the position
  liquidity: BigInt! # The maximum amount of liquidity received for a given amount of token0, token1, and the prices at the tick boundaries
  token0Amount: TokenAmount! # The amount in this position of the first token of the pool
  token1Amount: TokenAmount! # The amount in this position of the second token of the pool
  mintAmounts: MintAmounts! # The minimum amounts that must be sent in order to mint the amount of liquidity held by the position at the current price for the pool
  token0PriceLower: Price! # The price of token0 at the lower tick
  token0PriceUpper: Price! # The price of token0 at the upper tick
}
```

### MintAmounts

_The minimum amounts that must be sent in order to mint the amount of liquidity held by the position at the current price for the pool_

```graphql
type MintAmounts {
  amount0: BigInt! # Amount of the first token in the pool
  amount1: BigInt! # Amount of the second token in the pool
}
```

### PermitOptions

_Parameters for a permit allowing the transfer of tokens. Either amount and deadline OR nonce and expiry are required._

```graphql
type PermitOptions {
  v: PermitV! 
  r: String! 
  s: String! 
  amount: BigInt 
  deadline: BigInt 
  nonce: BigInt 
  expiry: BigInt 
}
```

### FeeOptions

_Fee configuration for encodeUnwrapWETH9(...) and encodeSweepToken(...)_

```graphql
type FeeOptions {
  fee: String! # The percent of the output that will be taken as a fee.
  recipient: String! # The recipient of the fee.
}
```

### SwapOptions

_Configuration for creating swap transaction calldata using swapCallParameters(...)_

```graphql
type SwapOptions {
  slippageTolerance: String! # How much the execution price is allowed to move unfavorably from the trade execution price.
  recipient: String! # The account that should receive the output.
  deadline: BigInt! # When the transaction expires, in epoch seconds.
  inputTokenPermit: PermitOptions # The optional permit parameters for spending the input.
  sqrtPriceLimitX96: BigInt # The optional price limit for the trade.
  fee: FeeOptions # Optional information for taking a fee on output.
}
```

### MethodParameters

_Transaction calldata and an ether value to be sent with the transaction_

```graphql
type MethodParameters {
  calldata: String! # The hex encoded calldata to perform the given operation
  value: String! # The amount of ether (wei) to send in hex.
}
```

### GasOptions

_Transaction gas configuration_

```graphql
type GasOptions {
  gasPrice: BigInt # The gas price to set for the transaction
  gasLimit: BigInt # The gas limit to set for the transaction
}
```

