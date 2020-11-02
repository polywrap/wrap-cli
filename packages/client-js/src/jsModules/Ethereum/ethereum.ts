import { IEthereumConfig } from "../..";
import { Ethereum } from "../../portals";

export const EthereumJSModule = async (config: IEthereumConfig) => {
  const client = new Ethereum(config);

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
