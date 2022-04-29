import {
  Client,
  Module,
  Input_callContractMethod,
  Input_callContractMethodAndWait,
  Input_sendTransaction,
  Input_sendTransactionAndWait,
  Input_deployContract,
  Input_signMessage,
  Input_sendRPC,
  TxResponse,
  TxReceipt,
  Connection as SchemaConnection,
} from "./w3";
import { EthereumConfig } from "../common/EthereumConfig";
import { Connections, Connection, getConnection } from "../common/Connection";
import * as Mapping from "../common/mapping";
import { parseArgs } from "../common/parsing";

import { ethers } from "ethers";

export interface MutationConfig
  extends EthereumConfig,
    Record<string, unknown> {}

export class Mutation extends Module<MutationConfig> {
  private _connections: Connections;
  private _defaultNetwork: string;

  constructor(config: MutationConfig) {
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

  public async callContractMethod(
    input: Input_callContractMethod,
    _client: Client
  ): Promise<TxResponse> {
    const res = await this._callContractMethod(input);
    return Mapping.toTxResponse(res);
  }

  public async callContractMethodAndWait(
    input: Input_callContractMethodAndWait,
    _client: Client
  ): Promise<TxReceipt> {
    const response = await this._callContractMethod(input);
    const res = await response.wait();
    return Mapping.toTxReceipt(res);
  }

  public async sendTransaction(
    input: Input_sendTransaction,
    _client: Client
  ): Promise<TxResponse> {
    const connection = await this._getConnection(input.connection);
    const signer = connection.getSigner();
    const res = await signer.sendTransaction(Mapping.fromTxRequest(input.tx));
    return Mapping.toTxResponse(res);
  }

  public async sendTransactionAndWait(
    input: Input_sendTransactionAndWait,
    _client: Client
  ): Promise<TxReceipt> {
    const connection = await this._getConnection(input.connection);
    const signer = connection.getSigner();
    const response = await signer.sendTransaction(
      Mapping.fromTxRequest(input.tx)
    );
    const receipt = await response.wait();
    return Mapping.toTxReceipt(receipt);
  }

  public async deployContract(
    input: Input_deployContract,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(input.connection);
    const signer = connection.getSigner();
    const factory = new ethers.ContractFactory(
      input.abi,
      input.bytecode,
      signer
    );
    const contract = await factory.deploy(...parseArgs(input.args));

    await contract.deployTransaction.wait();
    return contract.address;
  }

  public async signMessage(
    input: Input_signMessage,
    _client: Client
  ): Promise<string> {
    const connection = await this._getConnection(input.connection);
    return await connection.getSigner().signMessage(input.message);
  }

  public async sendRPC(input: Input_sendRPC, _client: Client): Promise<string> {
    const connection = await this._getConnection(input.connection);
    const provider = connection.getProvider();
    const response = await provider.send(input.method, input.params);
    return response.toString();
  }

  private async _callContractMethod(
    input: Input_callContractMethod
  ): Promise<ethers.providers.TransactionResponse> {
    const connection = await this._getConnection(input.connection);
    const contract = connection.getContract(input.address, [input.method]);
    const funcs = Object.keys(contract.interface.functions);

    const gasPrice: string | null | undefined = input.txOverrides?.gasPrice;
    const gasLimit: string | null | undefined = input.txOverrides?.gasLimit;
    const value: string | null | undefined = input.txOverrides?.value;

    return await contract[funcs[0]](...parseArgs(input.args), {
      gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice) : undefined,
      gasLimit: gasLimit ? ethers.BigNumber.from(gasLimit) : undefined,
      value: value ? ethers.BigNumber.from(value) : undefined,
    });
  }

  private async _getConnection(
    connection?: SchemaConnection | null
  ): Promise<Connection> {
    return getConnection(this._connections, this._defaultNetwork, connection);
  }
}
