/* eslint-disable import/no-extraneous-dependencies */
import { query, mutation } from "./resolvers";
import { manifest } from "./manifest";

import {
  Client,
  Plugin,
  PluginManifest,
  PluginModules,
  PluginFactory,
} from "@web3api/core-js";
import { Signer, ethers } from "ethers";
import {
  ExternalProvider,
  JsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";
import { defaultAbiCoder } from "ethers/lib/utils";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type Address = string;
export type AccountIndex = number;
export type EthereumSigner = Signer | Address | AccountIndex;
export type EthereumProvider = string | ExternalProvider;
export type EthereumClient = JsonRpcProvider | Web3Provider;

export type SerializableTxReceipt = Overwrite<
  ethers.providers.TransactionReceipt,
  {
    gasUsed: string;
    cumulativeGasUsed: string;
  }
>;

export interface EthereumConfig {
  provider: EthereumProvider;
  signer?: EthereumSigner;
}

export class EthereumPlugin extends Plugin {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: initialized within setProvider
  private _client: EthereumClient;

  constructor(private _config: EthereumConfig) {
    super();
    const { provider, signer } = _config;

    // Sanitize Provider & Signer
    this.setProvider(provider, signer !== undefined ? signer : 0);
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

  public setProvider(
    provider: EthereumProvider,
    signer?: EthereumSigner
  ): void {
    this._config.provider = provider;

    if (typeof provider === "string") {
      this._client = new JsonRpcProvider(provider);
    } else {
      this._client = new Web3Provider(provider);
    }

    if (signer !== undefined) {
      this.setSigner(signer);
    }
  }

  public setSigner(signer: EthereumSigner): void {
    if (typeof signer === "string") {
      this._config.signer = getAddress(signer);
    } else if (Signer.isSigner(signer)) {
      this._config.signer = signer;

      if (signer.provider !== this._config.provider) {
        throw Error(
          `Signer's connected provider does not match the config's ` +
            `provider. Please call "setProvider(...)" before calling ` +
            `"setSigner(...)" if a different provider is desired.`
        );
      }
    } else {
      this._config.signer = signer;
    }
  }

  public getSigner(): ethers.Signer {
    const { signer } = this._config;

    if (this._config.signer === undefined) {
      throw Error("Signer is undefined, this should never happen.");
    }

    if (typeof signer === "string" || typeof signer === "number") {
      return this._client.getSigner(signer);
    } else if (Signer.isSigner(signer)) {
      return signer;
    } else {
      throw Error(
        `Signer is an unrecognized type, this should never happen. \n${signer}`
      );
    }
  }

  public getContract(
    address: Address,
    abi: string[],
    signer = true
  ): ethers.Contract {
    if (signer) {
      return new ethers.Contract(address, abi, this.getSigner());
    } else {
      return new ethers.Contract(address, abi, this._client);
    }
  }

  public async deployContract(
    abi: ethers.ContractInterface,
    bytecode: string,
    ...args: unknown[]
  ): Promise<Address> {
    const signer = this.getSigner();
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...args);
    await contract.deployTransaction.wait();
    return contract.address;
  }

  public async callView(
    address: Address,
    method: string,
    args: string[]
  ): Promise<string> {
    console.log(await this.getSigner().getAddress());
    const contract = this.getContract(address, [method], false);
    const funcs = Object.keys(contract.interface.functions);
    const res = await contract[funcs[0]](...args);
    return res.toString();
  }

  public async callContractMethod(
    address: Address,
    method: string,
    args: string[]
  ): Promise<ethers.providers.TransactionReceipt> {
    const contract = this.getContract(address, [method]);
    const funcs = Object.keys(contract.interface.functions);
    const tx = await contract[funcs[0]](...args);
    const res: ethers.providers.TransactionReceipt = await tx.wait();

    return res;
  }

  public async estimateContractCallGas(
    address: Address,
    method: string,
    args: string[]
  ): Promise<string> {
    const contract = this.getContract(address, [method]);
    const funcs = Object.keys(contract.interface.functions);
    const gas = await contract.estimateGas[funcs[0]](...args);

    return gas.toString();
  }

  public async sendTransaction(
    tx: ethers.providers.TransactionRequest
  ): Promise<ethers.providers.TransactionReceipt> {
    const signer = this.getSigner();

    const res = await signer.sendTransaction(tx);
    return await res.wait();
  }

  public async sendRPC(method: string, params: string[]): Promise<unknown> {
    const provider = this.getSigner().provider;

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

  public async signMessage(message: string): Promise<string> {
    const messageHash = ethers.utils.id(message);
    const messageHashBytes = ethers.utils.arrayify(messageHash);

    return await this.getSigner().signMessage(messageHashBytes);
  }

  public encodeParams(types: string[], values: string[]): string {
    return defaultAbiCoder.encode(types, values);
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
