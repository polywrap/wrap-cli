import { Signer, ethers } from "ethers";
import {
  ExternalProvider,
  JsonRpcProvider,
  Web3Provider,
  Networkish,
  WebSocketProvider,
} from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";

export type Address = string;
export type AccountIndex = number;
export type EthereumSigner = Signer | Address | AccountIndex;
export type EthereumProvider = string | ExternalProvider | JsonRpcProvider;
export type EthereumClient = Web3Provider | JsonRpcProvider;

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
    this.setProvider(provider, signer);
  }

  static fromNetwork(networkish: Networkish): Connection {
    if (typeof networkish === "string") {
      networkish = networkish.toLowerCase();
    }

    const provider = (ethers.providers.getDefaultProvider(
      ethers.providers.getNetwork(networkish),
      {
        infura: "1xraqrFyjLg2yrVtsN543WdKqJC",
      }
    ) as unknown) as JsonRpcProvider;

    return new Connection({
      provider,
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
      this._client = (ethers.providers.getDefaultProvider(provider, {
        infura: "1xraqrFyjLg2yrVtsN543WdKqJC",
      }) as unknown) as JsonRpcProvider | WebSocketProvider;
    } else {
      if ((provider as JsonRpcProvider).anyNetwork !== undefined) {
        this._client = provider as JsonRpcProvider;
      } else {
        this._client = new Web3Provider(provider as ExternalProvider);
      }
    }

    this.setSigner(signer ?? 0);
  }

  public getProvider(): EthereumClient {
    return this._client;
  }

  public setSigner(signer: EthereumSigner): void {
    if (typeof signer === "string") {
      this._config.signer = getAddress(signer);
    } else if (Signer.isSigner(signer)) {
      this._config.signer = signer;

      // This should never happen
      if (!this._client) {
        throw Error(
          `Please call "setProvider(...)" before calling setSigner(...)`
        );
      }

      this._config.signer = signer.connect(this._client);
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
