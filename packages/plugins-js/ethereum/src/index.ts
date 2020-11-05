import { IEthereumConfig } from "../..";
import { Ethereum } from "../../portals";

const client = new Ethereum(config);

export const EthereumJSModule = async (config: IEthereumConfig) => {

  const sendTransaction = async (input: {address: string, method: string, args: string[]}) => {
    const {address, method, args} = input;
    const res = await client.sendTransaction(address, method, args);
    return res;
  }

  const deployContract = async (input: {abi: string, bytecode: string}) => {
    const {abi, bytecode} = input;

    const res = await client.deployContract(abi, bytecode);
    return res;
  }

  const callView = async (input: {address: string, method: string, args: string[]}) => {
    const {address, method, args} = input;

    const res = await client.callView(address, method, args);
    return res;
  }

  return {
    Mutate: {
      sendTransaction,
      deployContract
    },
    Query: {
      callView
    }
  }
}

// TODO:
/*
import { EthereumPlugin } from "@web3api/ethereum-plugin-js"

const plugin = new EthereumPlugin({
  provider
})

new Web3APIClient({
  plugins: [{
    uris: ["ethereum.*"],
    plugin
  }]
});

class EthereumPlugin extends Web3APIPlugin {
  // getResolvers() => {
    return {
      Query: {
        doTheThing: doTheThing(this)
      }
    }
  }
}
*/
