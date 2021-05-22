/* eslint-disable import/no-extraneous-dependencies */
import { query, mutation } from "./resolvers";
import { manifest } from "./manifest";
import { Connection as ConnectionOverride, TxOverrides } from "./types";
import {
  Address,
  AccountIndex,
  EthereumSigner,
  EthereumProvider,
  Connection,
  Connections,
  ConnectionConfig,
  ConnectionConfigs,
} from "./Connection";
import { SerializableTxRequest } from "./serialize";

import {
  Client,
  Plugin,
  PluginManifest,
  PluginModules,
  PluginFactory,
} from "@web3api/core-js";
import { ethers } from "ethers";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Log } from "@ethersproject/abstract-provider";
import { defaultAbiCoder } from "ethers/lib/utils";

// Export all types that are nested inside of EthereumConfig.
// This is required for the extractPluginConfigs.ts script.
export {
  Address,
  AccountIndex,
  EthereumSigner,
  EthereumProvider,
  ConnectionConfig,
  ConnectionConfigs,
};

export interface EthereumConfig {
  networks: ConnectionConfigs;
  defaultNetwork?: string;
}

export type SendOptions = Partial<{
  wait: boolean;
}>;

export class EthereumPlugin extends Plugin {
  private _connections: Connections;
  private _defaultNetwork: string;

  constructor(config: EthereumConfig) {
    super();
    this._connections = Connection.fromConfigs(config.networks);

    // Assign the default network (mainnet if not provided)
    if (config.defaultNetwork) {
      this._defaultNetwork = config.defaultNetwork;
    } else {
      this._defaultNetwork = "mainnet";
    }

    // Create a connection for the default network if none exists
    if (!this._connections[this._defaultNetwork]) {
      this._connections[this._defaultNetwork] = Connection.fromNetwork(
        this._defaultNetwork
      );
    }
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
    connectionOverride?: ConnectionOverride
  ): Promise<Address> {
    const connection = await this.getConnection(connectionOverride);
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
    connectionOverride?: ConnectionOverride
  ): Promise<string> {
    const connection = await this.getConnection(connectionOverride);
    const contract = connection.getContract(address, [method], false);
    const funcs = Object.keys(contract.interface.functions);
    const res = await contract[funcs[0]](...args);
    return res.toString();
  }

  public async callContractMethod(
    address: Address,
    method: string,
    args: string[],
    connectionOverride?: ConnectionOverride,
    txOverrides?: TxOverrides
  ): Promise<ethers.providers.TransactionResponse> {
    const connection = await this.getConnection(connectionOverride);
    const contract = connection.getContract(address, [method]);
    const funcs = Object.keys(contract.interface.functions);
    const res: ethers.providers.TransactionResponse = await contract[funcs[0]](
      ...args,
      {
        gasPrice: txOverrides?.gasPrice,
        gasLimit: txOverrides?.gasLimit,
        value: txOverrides?.value,
        none: txOverrides?.nonce,
      }
    );

    return res;
  }

  public async callContractMethodAndWait(
    address: Address,
    method: string,
    args: string[],
    connectionOverride?: ConnectionOverride,
    txOverrides?: TxOverrides
  ): Promise<ethers.providers.TransactionReceipt> {
    const response = await this.callContractMethod(
      address,
      method,
      args,
      connectionOverride,
      txOverrides
    );

    return response.wait();
  }

  public async getConnection(
    connectionOverride?: ConnectionOverride
  ): Promise<Connection> {
    if (!connectionOverride) {
      return this._connections[this._defaultNetwork];
    }

    const { networkNameOrChainId, node } = connectionOverride;
    let connection: Connection;

    // If a custom network is provided, either get an already
    // established connection, or a create a new one
    if (networkNameOrChainId) {
      if (this._connections[networkNameOrChainId]) {
        connection = this._connections[networkNameOrChainId];
      } else {
        const chainId = Number.parseInt(networkNameOrChainId);

        if (!isNaN(chainId)) {
          connection = Connection.fromNetwork(chainId);
        } else {
          connection = Connection.fromNetwork(networkNameOrChainId);
        }
      }
    } else {
      connection = this._connections[this._defaultNetwork];
    }

    // If a custom node endpoint is provided, create a combined
    // connection with the node's endpoint and a connection's signer
    // (if one exists for the network)
    if (node) {
      const nodeConnection = Connection.fromNode(node);
      const nodeNetwork = await nodeConnection.getProvider().getNetwork();

      const establishedConnection =
        this._connections[nodeNetwork.chainId.toString()] ||
        this._connections[nodeNetwork.name];

      if (establishedConnection) {
        try {
          nodeConnection.setSigner(establishedConnection.getSigner());
        } catch (e) {
          // It's okay if there isn't a signer available.
        }
      }

      connection = nodeConnection;
    }

    return connection;
  }

  public async estimateContractCallGas(
    address: Address,
    method: string,
    args: string[],
    connectionOverride?: ConnectionOverride
  ): Promise<string> {
    const connection = await this.getConnection(connectionOverride);
    const contract = connection.getContract(address, [method]);
    const funcs = Object.keys(contract.interface.functions);
    const gas = await contract.estimateGas[funcs[0]](...args);

    return gas.toString();
  }

  public async sendTransaction(
    tx: SerializableTxRequest,
    connectionOverride?: ConnectionOverride
  ): Promise<ethers.providers.TransactionResponse> {
    const connection = await this.getConnection(connectionOverride);
    const signer = connection.getSigner();

    return await signer.sendTransaction(tx);
  }

  public async awaitTransaction(
    txHash: string,
    confirmations: number,
    timeout: number,
    connectionOverride?: ConnectionOverride
  ): Promise<ethers.providers.TransactionReceipt> {
    const connection = await this.getConnection(connectionOverride);
    const provider = connection.getProvider();

    return await provider.waitForTransaction(txHash, confirmations, timeout);
  }

  public async sendTransactionAndWait(
    tx: SerializableTxRequest,
    connectionOverride?: ConnectionOverride
  ): Promise<ethers.providers.TransactionReceipt> {
    const res = await this.sendTransaction(tx, connectionOverride);
    return await res.wait();
  }

  public async sendRPC(
    method: string,
    params: string[],
    connectionOverride?: ConnectionOverride
  ): Promise<unknown> {
    const connection = await this.getConnection(connectionOverride);
    const provider = connection.getSigner().provider;

    if (
      provider instanceof JsonRpcProvider ||
      provider instanceof Web3Provider
    ) {
      const response = await provider.send(method, params);
      return response;
    } else {
      throw new Error("Provider is not compatible with method");
    }
  }

  public async signMessage(
    message: string,
    connectionOverride?: ConnectionOverride
  ): Promise<string> {
    const connection = await this.getConnection(connectionOverride);
    const messageHash = ethers.utils.id(message);
    const messageHashBytes = ethers.utils.arrayify(messageHash);

    return await connection.getSigner().signMessage(messageHashBytes);
  }

  public encodeParams(types: string[], values: string[]): string {
    return defaultAbiCoder.encode(types, values);
  }

  public checkAddress(address: string): boolean {
    try {
      // If the address is all upper-case, convert to lower case
      if (address.indexOf("0X") > -1) {
        address = address.toLowerCase();
      }

      const result = ethers.utils.getAddress(address);
      if (!result) {
        throw new Error("Invalid address");
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  public fromWei(amount: string): string {
    const etherAmount = ethers.utils.formatEther(amount.toString());
    return etherAmount.toString();
  }

  public toWei(amount: string): string {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    return weiAmount.toString();
  }

  public async waitForEvent(
    address: string,
    event: string,
    args: string[],
    timeout = 60000,
    connectionOverride?: ConnectionOverride
  ): Promise<{
    data: string;
    address: string;
    log: Log;
  }> {
    const connection = await this.getConnection(connectionOverride);
    const contract = connection.getContract(address, [event]);
    const events = Object.keys(contract.interface.events);
    const filter = contract.filters[events.slice(-1)[0]](...args);

    return Promise.race([
      new Promise((resolve) => {
        contract.once(filter, (data: string, address: string, log: Log) => {
          resolve({
            data,
            address,
            log,
          });
        });
      }),
      new Promise((_, reject) => {
        setTimeout(function () {
          reject(
            `Waiting for event "${event}" on contract "${address}" timed out`
          );
        }, timeout);
      }),
    ]) as Promise<{
      data: string;
      address: string;
      log: Log;
    }>;
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
