/* eslint-disable import/no-extraneous-dependencies */
import { query, mutation } from "./resolvers";
import { manifest } from "./manifest";
import * as Schema from "./types";
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
import * as Mapping from "./mapping";

import {
  Client,
  Plugin,
  PluginPackageManifest,
  PluginModules,
  PluginFactory,
} from "@web3api/core-js";
import { ethers } from "ethers";
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

  public static manifest(): PluginPackageManifest {
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

  /// Mutation

  public async callContractMethod(
    input: Schema.Input_callContractMethod
  ): Promise<Schema.TxResponse> {
    const res = await this._callContractMethod(input);
    return Mapping.toTxResponse(res);
  }

  public async callContractMethodAndWait(
    input: Schema.Input_callContractMethodAndWait
  ): Promise<Schema.TxReceipt> {
    const response = await this._callContractMethod(input);
    const res = await response.wait();
    return Mapping.toTxReceipt(res);
  }

  public async sendTransaction(
    input: Schema.Input_sendTransaction
  ): Promise<Schema.TxResponse> {
    const connection = await this.getConnection(input.connection);
    const signer = connection.getSigner();
    const res = await signer.sendTransaction(input.tx);
    return Mapping.toTxResponse(res);
  }

  public async sendTransactionAndWait(
    input: Schema.Input_sendTransactionAndWait
  ): Promise<Schema.TxReceipt> {
    const connection = await this.getConnection(input.connection);
    const signer = connection.getSigner();
    const response = await signer.sendTransaction(input.tx);
    const receipt = await response.wait();
    return Mapping.toTxReceipt(receipt);
  }

  public async deployContract(
    input: Schema.Input_deployContract
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    const signer = connection.getSigner();
    const factory = new ethers.ContractFactory(
      input.abi,
      input.bytecode,
      signer
    );
    const contract = await factory.deploy(...this.parseArgs(input.args));

    await contract.deployTransaction.wait();
    return contract.address;
  }

  public async signMessage(input: Schema.Input_signMessage): Promise<string> {
    const connection = await this.getConnection(input.connection);
    const messageHash = ethers.utils.id(input.message);
    const messageHashBytes = ethers.utils.arrayify(messageHash);
    return await connection.getSigner().signMessage(messageHashBytes);
  }

  public async sendRPC(input: Schema.Input_sendRPC): Promise<string> {
    const connection = await this.getConnection(input.connection);
    const provider = connection.getProvider();
    const response = await provider.send(input.method, input.params);
    return response.toString();
  }

  /// Query

  public async callContractView(
    input: Schema.Input_callContractView
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    const contract = connection.getContract(
      input.address,
      [input.method],
      false
    );
    const funcs = Object.keys(contract.interface.functions);
    const res = await contract[funcs[0]](...this.parseArgs(input.args));
    return res.toString();
  }

  public async callContractStatic(
    input: Schema.Input_callContractStatic
  ): Promise<Schema.StaticTxResult> {
    const connection = await this.getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.method]);
    const funcs = Object.keys(contract.interface.functions);

    try {
      const res = await contract.callStatic[funcs[0]](
        ...this.parseArgs(input.args),
        {
          gasPrice: input.gasPrice
            ? ethers.BigNumber.from(input.gasPrice)
            : undefined,
          gasLimit: input.gasLimit
            ? ethers.BigNumber.from(input.gasLimit)
            : undefined,
          value: input.value ? ethers.BigNumber.from(input.value) : undefined,
        }
      );
      return {
        result: res.toString(),
        error: false,
      };
    } catch (e) {
      return {
        result: e.reason,
        error: true,
      };
    }
  }

  public encodeParams(input: Schema.Input_encodeParams): string {
    return defaultAbiCoder.encode(input.types, input.values);
  }

  public async getSignerAddress(
    input: Schema.Input_getSignerAddress
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return await connection.getSigner().getAddress();
  }

  public async getSignerBalance(
    input: Schema.Input_getSignerBalance
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return (await connection.getSigner().getBalance(input.blockTag)).toString();
  }

  public async getSignerTransactionCount(
    input: Schema.Input_getSignerTransactionCount
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return (
      await connection.getSigner().getTransactionCount(input.blockTag)
    ).toString();
  }

  public async getGasPrice(input: Schema.Input_getGasPrice): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return (await connection.getSigner().getGasPrice()).toString();
  }

  public async estimateTransactionGas(
    input: Schema.Input_estimateTransactionGas
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return (
      await connection.getSigner().estimateGas(Mapping.fromTxRequest(input.tx))
    ).toString();
  }

  public async estimateContractCallGas(
    input: Schema.Input_estimateContractCallGas
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.method]);
    const funcs = Object.keys(contract.interface.functions);

    const gasPrice: string | undefined = input.txOverrides?.gasPrice;
    const gasLimit: string | undefined = input.txOverrides?.gasLimit;
    const value: string | undefined = input.txOverrides?.value;

    const gas = await contract.estimateGas[funcs[0]](
      ...this.parseArgs(input.args),
      {
        gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice) : undefined,
        gasLimit: gasLimit ? ethers.BigNumber.from(gasLimit) : undefined,
        value: value ? ethers.BigNumber.from(value) : undefined,
      }
    );

    return gas.toString();
  }

  public checkAddress(input: Schema.Input_checkAddress): boolean {
    let address = input.address;

    try {
      // If the address is all upper-case, convert to lower case
      if (address.indexOf("0X") > -1) {
        address = address.toLowerCase();
      }

      const result = ethers.utils.getAddress(address);
      if (!result) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  public toWei(input: Schema.Input_toWei): string {
    const weiAmount = ethers.utils.parseEther(input.eth);
    return weiAmount.toString();
  }

  public toEth(input: Schema.Input_toEth): string {
    const etherAmount = ethers.utils.formatEther(input.wei);
    return etherAmount.toString();
  }

  public async waitForEvent(
    input: Schema.Input_waitForEvent
  ): Promise<Schema.EventNotification> {
    const connection = await this.getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.event]);
    const events = Object.keys(contract.interface.events);
    const filter = contract.filters[events[0]](...this.parseArgs(input.args));

    return Promise.race([
      new Promise<Schema.EventNotification>((resolve) => {
        contract.once(
          filter,
          (data: string, address: string, log: ethers.providers.Log) => {
            resolve({
              data,
              address,
              log: Mapping.toLog(log),
            } as Schema.EventNotification);
          }
        );
      }),
      new Promise<Schema.EventNotification>((_, reject) => {
        setTimeout(function () {
          reject(
            `Waiting for event "${input.event}" on contract "${input.address}" timed out`
          );
        }, input.timeout || 60000);
      }),
    ]);
  }

  public async awaitTransaction(
    input: Schema.Input_awaitTransaction
  ): Promise<Schema.TxReceipt> {
    const connection = await this.getConnection(input.connection);
    const provider = connection.getProvider();

    const res = await provider.waitForTransaction(
      input.txHash,
      input.confirmations,
      input.timeout
    );

    return Mapping.toTxReceipt(res);
  }

  /// Utils

  public async getConnection(
    connection?: Schema.Connection
  ): Promise<Connection> {
    if (!connection) {
      return this._connections[this._defaultNetwork];
    }

    const { networkNameOrChainId, node } = connection;
    let result: Connection;

    // If a custom network is provided, either get an already
    // established connection, or a create a new one
    if (networkNameOrChainId) {
      const networkStr = networkNameOrChainId.toLowerCase();
      if (this._connections[networkStr]) {
        result = this._connections[networkStr];
      } else {
        const chainId = Number.parseInt(networkStr);

        if (!isNaN(chainId)) {
          result = Connection.fromNetwork(chainId);
        } else {
          result = Connection.fromNetwork(networkStr);
        }
      }
    } else {
      result = this._connections[this._defaultNetwork];
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

      result = nodeConnection;
    }

    return result;
  }

  public parseArgs(args?: string[]): unknown[] {
    if (!args) {
      return [];
    }

    return args.map((arg: string) =>
      (arg.startsWith("[") && arg.endsWith("]")) ||
      (arg.startsWith("{") && arg.endsWith("}"))
        ? JSON.parse(arg)
        : arg
    );
  }

  private async _callContractMethod(
    input: Schema.Input_callContractMethod
  ): Promise<ethers.providers.TransactionResponse> {
    const connection = await this.getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.method]);
    const funcs = Object.keys(contract.interface.functions);

    const gasPrice: string | undefined = input.txOverrides?.gasPrice;
    const gasLimit: string | undefined = input.txOverrides?.gasLimit;
    const value: string | undefined = input.txOverrides?.value;

    return await contract[funcs[0]](...this.parseArgs(input.args), {
      gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice) : undefined,
      gasLimit: gasLimit ? ethers.BigNumber.from(gasLimit) : undefined,
      value: value ? ethers.BigNumber.from(value) : undefined,
    });
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
