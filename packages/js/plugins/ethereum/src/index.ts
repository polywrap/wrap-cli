import {
  CoreClient,
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
  Args_requestAccounts,
  Args_callContractMethod,
  Args_callContractMethodAndWait,
  Args_deployContract,
  Args_sendRPC,
  Args_sendTransaction,
  Args_sendTransactionAndWait,
  Args_signMessage,
  Args_signMessageBytes,
  Args_signTypedData,
  Args_splitSignature,
  TxResponse,
  BigInt,
  StaticTxResult,
  EventNotification,
  TxReceipt,
  Network,
  SplitSignature,
  Connection as SchemaConnection,
  manifest,
} from "./wrap";
import { Connection } from "./Connection";
import * as Mapping from "./utils/mapping";
import { constructAbi, parseArgs, parseResult } from "./utils/parsing";
import { Connections } from "./Connections";

import { ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";

export * from "./Connection";
export * from "./Connections";

export interface EthereumPluginConfig {
  connections: Connections;
}

export class EthereumPlugin extends Module<EthereumPluginConfig> {
  private _connections: Connections;

  constructor(config: EthereumPluginConfig) {
    super(config);
    this._connections = config.connections;
  }

  async callContractView(
    args: Args_callContractView,
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    const abi = constructAbi(args.method);
    const contract = connection.getContract(args.address, abi, false);
    const funcs = Object.keys(contract.interface.functions);
    const result = await contract[funcs[0]](...parseArgs(args.args));
    return parseResult(result);
  }

  async callContractStatic(
    args: Args_callContractStatic,
    _client: CoreClient
  ): Promise<StaticTxResult> {
    const connection = await this._getConnection(args.connection);
    const abi = constructAbi(args.method);
    const contract = connection.getContract(args.address, abi);
    const funcs = Object.keys(contract.interface.functions);

    try {
      const result = await contract.callStatic[funcs[0]](
        ...parseArgs(args.args),
        {
          gasPrice: args.txOverrides?.gasPrice
            ? ethers.BigNumber.from(args.txOverrides.gasPrice)
            : undefined,
          gasLimit: args.txOverrides?.gasLimit
            ? ethers.BigNumber.from(args.txOverrides.gasLimit)
            : undefined,
          value: args.txOverrides?.value
            ? ethers.BigNumber.from(args.txOverrides.value)
            : undefined,
        }
      );
      return {
        result: result.length ? parseResult(result) : "",
        error: false,
      };
    } catch (e) {
      return {
        result: e.reason,
        error: true,
      };
    }
  }

  async getBalance(
    args: Args_getBalance,
    _client: CoreClient
  ): Promise<BigInt> {
    const connection = await this._getConnection(args.connection);
    return (
      await connection
        .getProvider()
        .getBalance(args.address, args.blockTag || undefined)
    ).toString();
  }

  async encodeParams(
    args: Args_encodeParams,
    _client: CoreClient
  ): Promise<string> {
    return defaultAbiCoder.encode(args.types, parseArgs(args.values));
  }

  async encodeFunction(
    args: Args_encodeFunction,
    _client: CoreClient
  ): Promise<string> {
    const functionInterface = ethers.Contract.getInterface([args.method]);
    return functionInterface.encodeFunctionData(
      functionInterface.functions[Object.keys(functionInterface.functions)[0]],
      parseArgs(args.args)
    );
  }

  async solidityPack(
    args: Args_solidityPack,
    _client: CoreClient
  ): Promise<string> {
    return ethers.utils.solidityPack(args.types, parseArgs(args.values));
  }

  async solidityKeccak256(
    args: Args_solidityKeccak256,
    _client: CoreClient
  ): Promise<string> {
    return ethers.utils.solidityKeccak256(args.types, parseArgs(args.values));
  }

  async soliditySha256(
    args: Args_soliditySha256,
    _client: CoreClient
  ): Promise<string> {
    return ethers.utils.soliditySha256(args.types, parseArgs(args.values));
  }

  async getSignerAddress(
    args: Args_getSignerAddress,
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return await connection.getSigner().getAddress();
  }

  async getSignerBalance(
    args: Args_getSignerBalance,
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return (
      await connection.getSigner().getBalance(args.blockTag || undefined)
    ).toString();
  }

  async getSignerTransactionCount(
    args: Args_getSignerTransactionCount,
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return (
      await connection
        .getSigner()
        .getTransactionCount(args.blockTag || undefined)
    ).toString();
  }

  async getGasPrice(
    args: Args_getGasPrice,
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return (await connection.getSigner().getGasPrice()).toString();
  }

  async estimateTransactionGas(
    args: Args_estimateTransactionGas,
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return (
      await connection.getSigner().estimateGas(Mapping.fromTxRequest(args.tx))
    ).toString();
  }

  async estimateContractCallGas(
    args: Args_estimateContractCallGas,
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    const abi = constructAbi(args.method);
    const contract = connection.getContract(args.address, abi);
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
    _client: CoreClient
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

  async toWei(args: Args_toWei, _client: CoreClient): Promise<string> {
    const weiAmount = ethers.utils.parseEther(args.eth);
    return weiAmount.toString();
  }

  async toEth(args: Args_toEth, _client: CoreClient): Promise<string> {
    const etherAmount = ethers.utils.formatEther(args.wei);
    return etherAmount.toString();
  }

  async waitForEvent(
    args: Args_waitForEvent,
    _client: CoreClient
  ): Promise<EventNotification> {
    const connection = await this._getConnection(args.connection);
    const abi = constructAbi(args.event);
    const contract = connection.getContract(args.address, abi);
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
    _client: CoreClient
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

  async getNetwork(
    args: Args_getNetwork,
    _client: CoreClient
  ): Promise<Network> {
    const connection = await this._getConnection(args.connection);
    const provider = connection.getProvider();
    const network = await provider.getNetwork();
    return {
      name: network.name,
      chainId: network.chainId.toString(),
      ensAddress: network.ensAddress,
    };
  }

  async requestAccounts(
    args: Args_requestAccounts,
    _client: CoreClient
  ): Promise<string[]> {
    const connection = await this._getConnection(args.connection);
    const provider = connection.getProvider();
    return provider.send("eth_requestAccounts", []);
  }

  public async callContractMethod(
    args: Args_callContractMethod,
    _client: CoreClient
  ): Promise<TxResponse> {
    const res = await this._callContractMethod(args);
    return Mapping.toTxResponse(res);
  }

  public async callContractMethodAndWait(
    args: Args_callContractMethodAndWait,
    _client: CoreClient
  ): Promise<TxReceipt> {
    const response = await this._callContractMethod(args);
    const res = await response.wait();
    return Mapping.toTxReceipt(res);
  }

  public async sendTransaction(
    args: Args_sendTransaction,
    _client: CoreClient
  ): Promise<TxResponse> {
    const connection = await this._getConnection(args.connection);
    const signer = connection.getSigner();
    const res = await signer.sendTransaction(Mapping.fromTxRequest(args.tx));
    return Mapping.toTxResponse(res);
  }

  public async sendTransactionAndWait(
    args: Args_sendTransactionAndWait,
    _client: CoreClient
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
    _client: CoreClient
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
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return await connection.getSigner().signMessage(args.message);
  }

  public async signMessageBytes(
    args: Args_signMessageBytes,
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    return await connection.getSigner().signMessage(args.bytes);
  }

  public async signTypedData(
    args: Args_signTypedData,
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    const provider = connection.getProvider();
    const signerAddress = await connection.getSigner().getAddress();
    const response = await provider.send("eth_signTypedData", [
      signerAddress,
      JSON.parse(args.payload),
    ]);
    return response.toString();
  }

  public async splitSignature(
    args: Args_splitSignature,
    _client: CoreClient
  ): Promise<SplitSignature> {
    const signature = ethers.utils.splitSignature(args.signature);
    return {
      r: signature.r,
      s: signature.s,
      v: signature.v,
    };
  }

  public async sendRPC(
    args: Args_sendRPC,
    _client: CoreClient
  ): Promise<string> {
    const connection = await this._getConnection(args.connection);
    const provider = connection.getProvider();
    const response = await provider.send(args.method, args.params);
    return response.toString();
  }

  private async _callContractMethod(
    args: Args_callContractMethod
  ): Promise<ethers.providers.TransactionResponse> {
    const connection = await this._getConnection(args.connection);
    const abi = constructAbi(args.method);
    const contract = connection.getContract(args.address, abi);
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
    // When a `node` is not specified within `connection`, but an env variable defines a custom node with the same network name, use the envs node when getting connections
    // This behavior is a consequence of how the ens-resolver uses the Ethereum plugin, always specifying the connection network name (e.g. mainnet)
    if (
      !connection?.node &&
      this.env?.connection &&
      this.env?.connection.networkNameOrChainId ===
        connection?.networkNameOrChainId
    ) {
      return this._connections.getConnection(this.env?.connection);
    }

    return this._connections.getConnection(connection || this.env?.connection);
  }
}

export const ethereumPlugin: PluginFactory<EthereumPluginConfig> = (
  config: EthereumPluginConfig
) => new PluginPackage(new EthereumPlugin(config), manifest);

export const plugin = ethereumPlugin;
