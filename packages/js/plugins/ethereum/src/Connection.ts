import { Signer, ethers } from "ethers";
import {
  ExternalProvider,
  JsonRpcProvider,
  Web3Provider,
  Networkish,
  getNetwork,
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

export interface ConnectionConfigs {
  [network: string]: ConnectionConfig;
}

export interface Connections {
  [network: string]: Connection;
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

  static fromConfigs(configs: ConnectionConfigs): Connections {
    const connections: Connections = {};

    for (const network of Object.keys(configs)) {
      // Create the connection
      const connection = new Connection(configs[network]);

      connections[network] = connection;

      // Handle the case where `network` is a number
      const networkNumber = Number.parseInt(network);

      if (networkNumber) {
        const namedNetwork = getNetwork(networkNumber);
        connections[namedNetwork.name] = connection;
      }
    }

    return connections;
  }

  static fromNetwork(networkish: Networkish): Connection {
    return new Connection({
      provider: (ethers.providers.getDefaultProvider(
        ethers.providers.getNetwork(networkish)
      ) as unknown) as JsonRpcProvider,
    });
  }

  static fromNode(node: string): Connection {
    return new Connection({
      provider: node,
    });
  }

  public setProvider(
    provider: EthereumProvider,
    signer?: EthereumSigner
  ): void {
    this._config.provider = provider;

    if (typeof provider === "string") {
      this._client = (ethers.providers.getDefaultProvider(
        provider
      ) as unknown) as JsonRpcProvider;
    } else {
      if ((provider as JsonRpcProvider).anyNetwork !== undefined) {
        this._client = provider as JsonRpcProvider;
      } else {
        this._client = new Web3Provider(provider as ExternalProvider);
      }
    }

    if (signer !== undefined) {
      this.setSigner(signer);
    }
  }

  public getProvider(): EthereumClient {
    return this._client;
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

    if (signer === undefined) {
      throw Error("Signer is undefined, this should never happen.");
    }

    if (typeof signer === "string" || typeof signer === "number") {
      if (!this._client.getSigner) {
        throw Error(
          "Connection.getSigner: Ethereum provider does not have a signer, " +
            "probably because it's an external RPC connection.\n" +
            `Network: ${JSON.stringify(this._client._network, null, 2)}`
        );
      }

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
