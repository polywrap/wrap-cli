/*
TODO:
1. Deploy contract
2. Deploy subgraph
3. Deploy Web3API
4. initWeb3API(signer)
5. query("QmMY_API", "{ setData('hey') { id } }")
*/
it("e2e", () => {
  const Web3API = require("@web3api/client-js")

  await client.query(
    "myapi.name.eth",
    `{
      setData(100)
    }`
  )
})