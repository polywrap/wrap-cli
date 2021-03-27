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

export type Address = string;
export type AccountIndex = number;
export type EthereumSigner = Signer | Address | AccountIndex;
export type EthereumProvider = string | ExternalProvider;
export type EthereumClient = JsonRpcProvider | Web3Provider;

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

  public getContract(address: Address, abi: string[]): ethers.Contract {
    return new ethers.Contract(address, abi, this.getSigner());
  }

  public getProviderOnNetwork(network: string): ethers.providers.Provider {
    const re = /^(homestead|mainnet|ropsten|kovan|rinkeby|goerli|testnet)$/i;
    if (!re.exec(network) && isNaN(+network)) {
      throw Error(
        `Unrecognized network "${network}" is not an integer and does not match known networks: homestead, mainnet, ropsten, kovan, rinkeby, goerli, testnet`
      );
    }
    const networkish = +network || network.toLowerCase();
    const networkObject = ethers.providers.getNetwork(networkish);
    if (typeof this._config.provider === "string") {
      // TODO: get free api keys for provider or make it possible for users to provide api keys?
      return ethers.getDefaultProvider(networkObject);
    } else {
      // TODO: this branch is untested
      return new Web3Provider(this._config.provider, networkObject);
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
    args: string[],
    network?: string
  ): Promise<string> {
    let contract = this.getContract(address, [method]);
    if (network) {
      contract = contract.connect(this.getProviderOnNetwork(network));
    }
    const funcs = Object.keys(contract.interface.functions);
    const res = await contract[funcs[0]](...args);
    return res.toString();
  }

  public async sendTransaction(
    address: Address,
    method: string,
    args: string[]
  ): Promise<string> {
    const contract = this.getContract(address, [method]);
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
