import {
  Client,
  Module,
  Input_callContractView,
  Input_callContractStatic,
  Input_getBalance,
  Input_encodeParams,
  Input_encodeFunction,
  Input_solidityPack,
  Input_solidityKeccak256,
  Input_soliditySha256,
  Input_getSignerAddress,
  Input_getSignerBalance,
  Input_getSignerTransactionCount,
  Input_getGasPrice,
  Input_estimateTransactionGas,
  Input_estimateContractCallGas,
  Input_checkAddress,
  Input_toWei,
  Input_toEth,
  Input_waitForEvent,
  Input_awaitTransaction,
  Input_getNetwork,
  BigInt,
  StaticTxResult,
  EventNotification,
  TxReceipt,
  Network,
  Connection as SchemaConnection,
} from "./w3";
import { EthereumConfig } from "../common/EthereumConfig";
import { Connections, Connection, getConnection } from "../common/Connection";
import * as Mapping from "../common/mapping";
import { parseArgs } from "../common/parsing";

import { ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";

export interface QueryConfig extends EthereumConfig, Record<string, unknown> {}

export class Query extends Module<QueryConfig> {
  private _connections: Connections;
  private _defaultNetwork: string;

  constructor(config: QueryConfig) {
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
    input: Input_callContractView,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(input.connection);
    const contract = connection.getContract(
      input.address,
      [input.method],
      false
    );
    const funcs = Object.keys(contract.interface.functions);
    const res = await contract[funcs[0]](...parseArgs(input.args));
    return res.toString();
  }

  async callContractStatic(
    input: Input_callContractStatic,
    _client: Client
  ): Promise<StaticTxResult> {
    const connection = await this._getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.method]);
    const funcs = Object.keys(contract.interface.functions);

    try {
      const res = await contract.callStatic[funcs[0]](
        ...parseArgs(input.args),
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

  async getBalance(input: Input_getBalance, _client: Client): Promise<BigInt> {
    const connection = await this._getConnection(input.connection);
    return (
      await connection
        .getProvider()
        .getBalance(input.address, input.blockTag || undefined)
    ).toString();
  }

  async encodeParams(
    input: Input_encodeParams,
    _client: Client
  ): Promise<string> {
    return defaultAbiCoder.encode(input.types, parseArgs(input.values));
  }

  async encodeFunction(
    input: Input_encodeFunction,
    _client: Client
  ): Promise<string> {
    const functionInterface = ethers.Contract.getInterface([input.method]);
    return functionInterface.encodeFunctionData(
      functionInterface.functions[Object.keys(functionInterface.functions)[0]],
      parseArgs(input.args)
    );
  }

  async solidityPack(
    input: Input_solidityPack,
    _client: Client
  ): Promise<string> {
    return ethers.utils.solidityPack(input.types, parseArgs(input.values));
  }

  async solidityKeccak256(
    input: Input_solidityKeccak256,
    _client: Client
  ): Promise<string> {
    return ethers.utils.solidityKeccak256(input.types, parseArgs(input.values));
  }

  async soliditySha256(
    input: Input_soliditySha256,
    _client: Client
  ): Promise<string> {
    return ethers.utils.soliditySha256(input.types, parseArgs(input.values));
  }

  async getSignerAddress(
    input: Input_getSignerAddress,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(input.connection);
    return await connection.getSigner().getAddress();
  }

  async getSignerBalance(
    input: Input_getSignerBalance,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(input.connection);
    return (
      await connection.getSigner().getBalance(input.blockTag || undefined)
    ).toString();
  }

  async getSignerTransactionCount(
    input: Input_getSignerTransactionCount,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(input.connection);
    return (
      await connection
        .getSigner()
        .getTransactionCount(input.blockTag || undefined)
    ).toString();
  }

  async getGasPrice(
    input: Input_getGasPrice,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(input.connection);
    return (await connection.getSigner().getGasPrice()).toString();
  }

  async estimateTransactionGas(
    input: Input_estimateTransactionGas,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(input.connection);
    return (
      await connection.getSigner().estimateGas(Mapping.fromTxRequest(input.tx))
    ).toString();
  }

  async estimateContractCallGas(
    input: Input_estimateContractCallGas,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.method]);
    const funcs = Object.keys(contract.interface.functions);

    const gasPrice: string | null | undefined = input.txOverrides?.gasPrice;
    const gasLimit: string | null | undefined = input.txOverrides?.gasLimit;
    const value: string | null | undefined = input.txOverrides?.value;

    const gas = await contract.estimateGas[funcs[0]](...parseArgs(input.args), {
      gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice) : undefined,
      gasLimit: gasLimit ? ethers.BigNumber.from(gasLimit) : undefined,
      value: value ? ethers.BigNumber.from(value) : undefined,
    });

    return gas.toString();
  }

  async checkAddress(
    input: Input_checkAddress,
    _client: Client
  ): Promise<boolean> {
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

  async toWei(input: Input_toWei, _client: Client): Promise<string> {
    const weiAmount = ethers.utils.parseEther(input.eth);
    return weiAmount.toString();
  }

  async toEth(input: Input_toEth, _client: Client): Promise<string> {
    const etherAmount = ethers.utils.formatEther(input.wei);
    return etherAmount.toString();
  }

  async waitForEvent(
    input: Input_waitForEvent,
    _client: Client
  ): Promise<EventNotification> {
    const connection = await this._getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.event]);
    const events = Object.keys(contract.interface.events);
    const filter = contract.filters[events[0]](...parseArgs(input.args));

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
            `Waiting for event "${input.event}" on contract "${input.address}" timed out`
          );
        }, input.timeout || 60000);
      }),
    ]);
  }

  async awaitTransaction(
    input: Input_awaitTransaction,
    _client: Client
  ): Promise<TxReceipt> {
    const connection = await this._getConnection(input.connection);
    const provider = connection.getProvider();

    const res = await provider.waitForTransaction(
      input.txHash,
      input.confirmations,
      input.timeout
    );

    return Mapping.toTxReceipt(res);
  }

  async getNetwork(input: Input_getNetwork, _client: Client): Promise<Network> {
    const connection = await this._getConnection(input.connection);
    const provider = connection.getProvider();
    const network = await provider.getNetwork();
    return {
      name: network.name,
      chainId: network.chainId.toString(),
      ensAddress: network.ensAddress,
    };
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
