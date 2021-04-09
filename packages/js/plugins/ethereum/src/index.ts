/* eslint-disable import/no-extraneous-dependencies */
import { query, mutation } from "./resolvers";
import { manifest } from "./manifest";
import {
  Address,
  Connection,
  ConnectionConfig
} from "./Connection";

import {
  Client,
  Plugin,
  PluginManifest,
  PluginModules,
  PluginFactory,
} from "@web3api/core-js";
import { ethers } from "ethers";

export interface EthereumConfig extends ConnectionConfig { }

export class EthereumPlugin extends Plugin {

  private _connection: Connection;

  constructor(config: EthereumConfig) {
    super();
    this._connection = new Connection(config)
  }

  public static manifest(): PluginManifest {
    return manifest;
  }

  // TODO: generated types here from the schema.graphql to ensure safety `Resolvers<TQuery, TMutation>`
  // https://github.com/web3-api/monorepo/issues/101
  public getModules(_client: Client): PluginModules {
    return {
      query: query(this),
      mutation: mutation(this),
    };
  }

  public async deployContract(
    abi: ethers.ContractInterface,
    bytecode: string,
    args: string[],
    connectionOverride?: Connection
  ): Promise<Address> {
    let connection = connectionOverride || this._connection;
    const signer = connection.getSigner();
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...args);
    await contract.deployTransaction.wait();
    return contract.address;
  }

  public async callView(
    address: Address,
    method: string,
    args: string[],
    connectionOverride?: Connection
  ): Promise<string> {
    let connection = connectionOverride || this._connection;
    let contract = connection.getContract(address, [method], false);
    const funcs = Object.keys(contract.interface.functions);
    const res = await contract[funcs[0]](...args);
    return res.toString();
  }

  public async sendTransaction(
    address: Address,
    method: string,
    args: string[],
    connectionOverride?: Connection
  ): Promise<string> {
    let connection = connectionOverride || this._connection;
    const contract = connection.getContract(address, [method]);
    const funcs = Object.keys(contract.interface.functions);
    const tx = await contract[funcs[0]](...args);
    const res = await tx.wait();
    // TODO: improve this
    return res.transactionHash;
  }
}

export const ethereumPlugin: PluginFactory<EthereumConfig> = (
  opts: EthereumConfig
) => {
  return {
    factory: () => new EthereumPlugin(opts),
    manifest: manifest,
  };
};
export const plugin = ethereumPlugin;
