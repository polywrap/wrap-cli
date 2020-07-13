import { ethereum, query } from "@web3api/js"

// connect wallet
ethereum.init(
  window.ethereum
)

const { result } = await query(
  "api.uniswap.eth",
  `{
    swap(
      "ETH",
      "DAI",
      500
    )
  }`
)
