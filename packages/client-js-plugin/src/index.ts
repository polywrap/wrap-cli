export interface Resolvers {
  // TODO: tighten up the typing
  Query: {
    [name: string]: (input: any) => any
  }

  Mutation: {
    [name: string]: (input: any) => any
  }
}

export abstract class Web3APIClientPlugin {
  abstract getResolvers(): Resolvers;
}

// TODO:
/*
// dApp
import { EthereumPlugin } from "@web3api/ethereum-plugin-js"

const ethPlugin = new EthereumPlugin({
  provider
})

new Web3APIClient({
  plugins: [
    {
      uris: ["*ethereum.*"],
      ethPlugin
    }
  ]
});

// plugins-js/ethereum/src/index.ts
*/
