/* eslint-disable import/no-extraneous-dependencies */
import { query, mutation } from "./resolvers";
import { manifest, Query, Mutation } from "./w3";
import * as Types from "./w3";
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

  public getModules(
    _client: Client
  ): {
    query: Query.Module;
    mutation: Mutation.Module;
  } {
    return {
      query: query(this),
      mutation: mutation(this),
    };
  }

  /// Mutation

  public async callContractMethod(
    input: Mutation.Input_callContractMethod
  ): Promise<Types.TxResponse> {
    const res = await this._callContractMethod(input);
    return Mapping.toTxResponse(res);
  }

  public async callContractMethodAndWait(
    input: Mutation.Input_callContractMethodAndWait
  ): Promise<Types.TxReceipt> {
    const response = await this._callContractMethod(input);
    const res = await response.wait();
    return Mapping.toTxReceipt(res);
  }

  public async sendTransaction(
    input: Mutation.Input_sendTransaction
  ): Promise<Types.TxResponse> {
    const connection = await this.getConnection(input.connection);
    const signer = connection.getSigner();
    const res = await signer.sendTransaction(Mapping.fromTxRequest(input.tx));
    return Mapping.toTxResponse(res);
  }

  public async sendTransactionAndWait(
    input: Mutation.Input_sendTransactionAndWait
  ): Promise<Types.TxReceipt> {
    const connection = await this.getConnection(input.connection);
    const signer = connection.getSigner();
    const response = await signer.sendTransaction(
      Mapping.fromTxRequest(input.tx)
    );
    const receipt = await response.wait();
    return Mapping.toTxReceipt(receipt);
  }

  public async deployContract(
    input: Mutation.Input_deployContract
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

  public async signMessage(input: Mutation.Input_signMessage): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return await connection.getSigner().signMessage(input.message);
  }

  public async sendRPC(input: Mutation.Input_sendRPC): Promise<string> {
    const connection = await this.getConnection(input.connection);
    const provider = connection.getProvider();
    const response = await provider.send(input.method, input.params);
    return response.toString();
  }

  /// Query

  public async getNetwork(
    input: Query.Input_getNetwork
  ): Promise<Types.Network> {
    const connection = await this.getConnection(input.connection);
    const provider = connection.getProvider();
    const network = await provider.getNetwork();
    return {
      name: network.name,
      chainId: network.chainId,
      ensAddress: network.ensAddress,
    };
  }

  public async callContractView(
    input: Query.Input_callContractView
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
    input: Query.Input_callContractStatic
  ): Promise<Types.StaticTxResult> {
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

  public encodeParams(input: Query.Input_encodeParams): string {
    return defaultAbiCoder.encode(input.types, this.parseArgs(input.values));
  }

  public encodeFunction(input: Query.Input_encodeFunction): string {
    const functionInterface = ethers.Contract.getInterface([input.method]);
    return functionInterface.encodeFunctionData(
      functionInterface.functions[Object.keys(functionInterface.functions)[0]],
      this.parseArgs(input.args)
    );
  }

  public solidityPack(input: Query.Input_solidityPack): string {
    return ethers.utils.solidityPack(input.types, this.parseArgs(input.values));
  }

  public solidityKeccak256(input: Query.Input_solidityKeccak256): string {
    return ethers.utils.solidityKeccak256(
      input.types,
      this.parseArgs(input.values)
    );
  }

  public soliditySha256(input: Query.Input_soliditySha256): string {
    return ethers.utils.soliditySha256(
      input.types,
      this.parseArgs(input.values)
    );
  }

  public async getSignerAddress(
    input: Query.Input_getSignerAddress
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return await connection.getSigner().getAddress();
  }

  public async getSignerBalance(
    input: Query.Input_getSignerBalance
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return (
      await connection.getSigner().getBalance(input.blockTag || undefined)
    ).toString();
  }

  public async getSignerTransactionCount(
    input: Query.Input_getSignerTransactionCount
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return (
      await connection
        .getSigner()
        .getTransactionCount(input.blockTag || undefined)
    ).toString();
  }

  public async getGasPrice(input: Query.Input_getGasPrice): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return (await connection.getSigner().getGasPrice()).toString();
  }

  public async estimateTransactionGas(
    input: Query.Input_estimateTransactionGas
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return (
      await connection.getSigner().estimateGas(Mapping.fromTxRequest(input.tx))
    ).toString();
  }

  public async estimateContractCallGas(
    input: Query.Input_estimateContractCallGas
  ): Promise<string> {
    const connection = await this.getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.method]);
    const funcs = Object.keys(contract.interface.functions);

    const gasPrice: string | null | undefined = input.txOverrides?.gasPrice;
    const gasLimit: string | null | undefined = input.txOverrides?.gasLimit;
    const value: string | null | undefined = input.txOverrides?.value;

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

  public checkAddress(input: Query.Input_checkAddress): boolean {
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

  public toWei(input: Query.Input_toWei): string {
    const weiAmount = ethers.utils.parseEther(input.eth);
    return weiAmount.toString();
  }

  public toEth(input: Query.Input_toEth): string {
    const etherAmount = ethers.utils.formatEther(input.wei);
    return etherAmount.toString();
  }

  public async waitForEvent(
    input: Query.Input_waitForEvent
  ): Promise<Types.EventNotification> {
    const connection = await this.getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.event]);
    const events = Object.keys(contract.interface.events);
    const filter = contract.filters[events[0]](...this.parseArgs(input.args));

    return Promise.race([
      new Promise<Types.EventNotification>((resolve) => {
        contract.once(
          filter,
          (data: string, address: string, log: ethers.providers.Log) => {
            resolve({
              data,
              address,
              log: Mapping.toLog(log),
            } as Types.EventNotification);
          }
        );
      }),
      new Promise<Types.EventNotification>((_, reject) => {
        setTimeout(function () {
          reject(
            `Waiting for event "${input.event}" on contract "${input.address}" timed out`
          );
        }, input.timeout || 60000);
      }),
    ]);
  }

  public async awaitTransaction(
    input: Query.Input_awaitTransaction
  ): Promise<Types.TxReceipt> {
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
    connection?: Types.Connection | null
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

  public parseArgs(args?: string[] | null): unknown[] {
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
    input: Mutation.Input_callContractMethod
  ): Promise<ethers.providers.TransactionResponse> {
    const connection = await this.getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.method]);
    const funcs = Object.keys(contract.interface.functions);

    const gasPrice: string | null | undefined = input.txOverrides?.gasPrice;
    const gasLimit: string | null | undefined = input.txOverrides?.gasLimit;
    const value: string | null | undefined = input.txOverrides?.value;

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
