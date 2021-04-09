import { Connection as SchemaConnection } from "./types";

import { Signer, ethers } from "ethers";
import {
  ExternalProvider,
  JsonRpcProvider,
  WebSocketProvider,
  Web3Provider,
  Networkish
} from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";

export type Address = string;
export type AccountIndex = number;
export type EthereumSigner = Signer | Address | AccountIndex;
export type EthereumProvider = string | ExternalProvider | JsonRpcProvider;
export type EthereumClient = JsonRpcProvider;

export interface ConnectionConfig {
  provider: EthereumProvider;
  signer?: EthereumSigner;
}

export class Connection {

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: initialized within setProvider
  private _client: EthereumClient;

  constructor(private _config: ConnectionConfig) {
    const { provider, signer } = _config;

    // Sanitize Provider & Signer
    this.setProvider(provider, signer !== undefined ? signer : 0);
  }

  static fromSchemaConnection(config: SchemaConnection): Connection {
    if (config.network) {
      if (!config.network.chainId && !config.network.name) {
        throw Error(
          `fromSchemaConnection: Network config must have chainId or name defined`
        );
      }

      const networkish: Networkish = config.network.chainId || config.network.name || 0;

      return new Connection({
        provider: ethers.providers.getDefaultProvider(
          ethers.providers.getNetwork(networkish)
        ) as JsonRpcProvider
      });
    } else if (config.node) {
      return new Connection({
        provider: config.node
      })
    } else {
      throw Error(
        `fromSchemaConnection: Connection config must have network or node defined`
      )
    }
  }

  public setProvider(
    provider: EthereumProvider,
    signer?: EthereumSigner
  ): void {
    this._config.provider = provider;

    if (typeof provider === "string") {
      this._client = ethers.providers.getDefaultProvider(
        provider
      ) as JsonRpcProvider | WebSocketProvider;
    } else {
      if ((provider as JsonRpcProvider).anyNetwork !== undefined) {
        this._client = provider as JsonRpcProvider;
      } else {
        this._client = new Web3Provider(provider as ExternalProvider)
      }
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
}
