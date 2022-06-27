import {
  Client,
  Module,
  Args_callContractView,
  Args_callContractStatic,
  Args_getBalance,
  Args_encodeParams,
  Args_encodeFunction,
  Args_solidityPack,
  Args_solidityKeccak256,
  Args_soliditySha256,
  Args_getSignerAddress,
  Args_getSignerBalance,
  Args_getSignerTransactionCount,
  Args_getGasPrice,
  Args_estimateTransactionGas,
  Args_estimateContractCallGas,
  Args_checkAddress,
  Args_toWei,
  Args_toEth,
  Args_waitForEvent,
  Args_awaitTransaction,
  Args_getNetwork,
  Args_callContractMethod,
  Args_callContractMethodAndWait,
  Args_deployContract,
  Args_sendRPC,
  Args_sendTransaction,
  Args_sendTransactionAndWait,
  Args_signMessage,
  TxResponse,
  BigInt,
  StaticTxResult,
  EventNotification,
  TxReceipt,
  Network,
  Connection as SchemaConnection,
  manifest,
} from "./wrap";
import {
  Connections,
  Connection,
  getConnection,
  ConnectionConfigs,
} from "./Connection";
import * as Mapping from "./utils/mapping";
import { parseArgs } from "./utils/parsing";

import { ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { PluginFactory } from "@polywrap/core-js";

export interface EthereumPluginConfig {
  networks: ConnectionConfigs;
  defaultNetwork?: string;
}

export class EthereumPlugin extends Module<EthereumPluginConfig> {
  private _connections: Connections;
  private _defaultNetwork: string;

  constructor(config: EthereumPluginConfig) {
    super(config);
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

  async callContractView(
    args: Args_callContractView,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    const contract = connection.getContract(args.address, [args.method], false);
    const funcs = Object.keys(contract.interface.functions);
    const res = await contract[funcs[0]](...parseArgs(args.args));
    return res.toString();
  }

  async callContractStatic(
    args: Args_callContractStatic,
    _client: Client
  ): Promise<StaticTxResult> {
    const connection = await this._getConnection(args.connection);
    const contract = connection.getContract(args.address, [args.method]);
    const funcs = Object.keys(contract.interface.functions);

    try {
      const res = await contract.callStatic[funcs[0]](...parseArgs(args.args), {
        gasPrice: args.gasPrice
          ? ethers.BigNumber.from(args.gasPrice)
          : undefined,
        gasLimit: args.gasLimit
          ? ethers.BigNumber.from(args.gasLimit)
          : undefined,
        value: args.value ? ethers.BigNumber.from(args.value) : undefined,
      });
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

  async getBalance(args: Args_getBalance, _client: Client): Promise<BigInt> {
    const connection = await this._getConnection(args.connection);
    return (
      await connection
        .getProvider()
        .getBalance(args.address, args.blockTag || undefined)
    ).toString();
  }

  async encodeParams(
    args: Args_encodeParams,
    _client: Client
  ): Promise<string> {
    return defaultAbiCoder.encode(args.types, parseArgs(args.values));
  }

  async encodeFunction(
    args: Args_encodeFunction,
    _client: Client
  ): Promise<string> {
    const functionInterface = ethers.Contract.getInterface([args.method]);
    return functionInterface.encodeFunctionData(
      functionInterface.functions[Object.keys(functionInterface.functions)[0]],
      parseArgs(args.args)
    );
  }

  async solidityPack(
    args: Args_solidityPack,
    _client: Client
  ): Promise<string> {
    return ethers.utils.solidityPack(args.types, parseArgs(args.values));
  }

  async solidityKeccak256(
    args: Args_solidityKeccak256,
    _client: Client
  ): Promise<string> {
    return ethers.utils.solidityKeccak256(args.types, parseArgs(args.values));
  }

  async soliditySha256(
    args: Args_soliditySha256,
    _client: Client
  ): Promise<string> {
    return ethers.utils.soliditySha256(args.types, parseArgs(args.values));
  }

  async getSignerAddress(
    args: Args_getSignerAddress,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return await connection.getSigner().getAddress();
  }

  async getSignerBalance(
    args: Args_getSignerBalance,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return (
      await connection.getSigner().getBalance(args.blockTag || undefined)
    ).toString();
  }

  async getSignerTransactionCount(
    args: Args_getSignerTransactionCount,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return (
      await connection
        .getSigner()
        .getTransactionCount(args.blockTag || undefined)
    ).toString();
  }

  async getGasPrice(args: Args_getGasPrice, _client: Client): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return (await connection.getSigner().getGasPrice()).toString();
  }

  async estimateTransactionGas(
    args: Args_estimateTransactionGas,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return (
      await connection.getSigner().estimateGas(Mapping.fromTxRequest(args.tx))
    ).toString();
  }

  async estimateContractCallGas(
    args: Args_estimateContractCallGas,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    const contract = connection.getContract(args.address, [args.method]);
    const funcs = Object.keys(contract.interface.functions);

    const gasPrice: string | null | undefined = args.txOverrides?.gasPrice;
    const gasLimit: string | null | undefined = args.txOverrides?.gasLimit;
    const value: string | null | undefined = args.txOverrides?.value;

    const gas = await contract.estimateGas[funcs[0]](...parseArgs(args.args), {
      gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice) : undefined,
      gasLimit: gasLimit ? ethers.BigNumber.from(gasLimit) : undefined,
      value: value ? ethers.BigNumber.from(value) : undefined,
    });

    return gas.toString();
  }

  async checkAddress(
    args: Args_checkAddress,
    _client: Client
  ): Promise<boolean> {
    let address = args.address;

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

  async toWei(args: Args_toWei, _client: Client): Promise<string> {
    const weiAmount = ethers.utils.parseEther(args.eth);
    return weiAmount.toString();
  }

  async toEth(args: Args_toEth, _client: Client): Promise<string> {
    const etherAmount = ethers.utils.formatEther(args.wei);
    return etherAmount.toString();
  }

  async waitForEvent(
    args: Args_waitForEvent,
    _client: Client
  ): Promise<EventNotification> {
    const connection = await this._getConnection(args.connection);
    const contract = connection.getContract(args.address, [args.event]);
    const events = Object.keys(contract.interface.events);
    const filter = contract.filters[events[0]](...parseArgs(args.args));

    return Promise.race([
      new Promise<EventNotification>((resolve) => {
        contract.once(
          filter,
          (data: string, address: string, log: ethers.providers.Log) => {
            resolve({
              data,
              address,
              log: Mapping.toLog(log),
            } as EventNotification);
          }
        );
      }),
      new Promise<EventNotification>((_, reject) => {
        setTimeout(function () {
          reject(
            `Waiting for event "${args.event}" on contract "${args.address}" timed out`
          );
        }, args.timeout || 60000);
      }),
    ]);
  }

  async awaitTransaction(
    args: Args_awaitTransaction,
    _client: Client
  ): Promise<TxReceipt> {
    const connection = await this._getConnection(args.connection);
    const provider = connection.getProvider();

    const res = await provider.waitForTransaction(
      args.txHash,
      args.confirmations,
      args.timeout
    );

    return Mapping.toTxReceipt(res);
  }

  async getNetwork(args: Args_getNetwork, _client: Client): Promise<Network> {
    const connection = await this._getConnection(args.connection);
    const provider = connection.getProvider();
    const network = await provider.getNetwork();
    return {
      name: network.name,
      chainId: network.chainId.toString(),
      ensAddress: network.ensAddress,
    };
  }

  public async callContractMethod(
    args: Args_callContractMethod,
    _client: Client
  ): Promise<TxResponse> {
    const res = await this._callContractMethod(args);
    return Mapping.toTxResponse(res);
  }

  public async callContractMethodAndWait(
    args: Args_callContractMethodAndWait,
    _client: Client
  ): Promise<TxReceipt> {
    const response = await this._callContractMethod(args);
    const res = await response.wait();
    return Mapping.toTxReceipt(res);
  }

  public async sendTransaction(
    args: Args_sendTransaction,
    _client: Client
  ): Promise<TxResponse> {
    const connection = await this._getConnection(args.connection);
    const signer = connection.getSigner();
    const res = await signer.sendTransaction(Mapping.fromTxRequest(args.tx));
    return Mapping.toTxResponse(res);
  }

  public async sendTransactionAndWait(
    args: Args_sendTransactionAndWait,
    _client: Client
  ): Promise<TxReceipt> {
    const connection = await this._getConnection(args.connection);
    const signer = connection.getSigner();
    const response = await signer.sendTransaction(
      Mapping.fromTxRequest(args.tx)
    );
    const receipt = await response.wait();
    return Mapping.toTxReceipt(receipt);
  }

  public async deployContract(
    args: Args_deployContract,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    const signer = connection.getSigner();
    const factory = new ethers.ContractFactory(args.abi, args.bytecode, signer);
    const contract = await factory.deploy(...parseArgs(args.args));

    await contract.deployTransaction.wait();
    return contract.address;
  }

  public async signMessage(
    args: Args_signMessage,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return await connection.getSigner().signMessage(args.message);
  }

  public async sendRPC(args: Args_sendRPC, _client: Client): Promise<string> {
    const connection = await this._getConnection(args.connection);
    const provider = connection.getProvider();
    const response = await provider.send(args.method, args.params);
    return response.toString();
  }

  private async _callContractMethod(
    args: Args_callContractMethod
  ): Promise<ethers.providers.TransactionResponse> {
    const connection = await this._getConnection(args.connection);
    const contract = connection.getContract(args.address, [args.method]);
    const funcs = Object.keys(contract.interface.functions);

    const gasPrice: string | null | undefined = args.txOverrides?.gasPrice;
    const gasLimit: string | null | undefined = args.txOverrides?.gasLimit;
    const value: string | null | undefined = args.txOverrides?.value;

    return await contract[funcs[0]](...parseArgs(args.args), {
      gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice) : undefined,
      gasLimit: gasLimit ? ethers.BigNumber.from(gasLimit) : undefined,
      value: value ? ethers.BigNumber.from(value) : undefined,
    });
  }

  private async _getConnection(
    connection?: SchemaConnection | null
  ): Promise<Connection> {
    return getConnection(
      this._connections,
      this._defaultNetwork,
      connection || this.env.connection
    );
  }
}

export const ethereumPlugin: PluginFactory<EthereumPluginConfig> = (
  config: EthereumPluginConfig
) => {
  return {
    factory: () => new EthereumPlugin(config),
    manifest,
  };
};

export const plugin = ethereumPlugin;
