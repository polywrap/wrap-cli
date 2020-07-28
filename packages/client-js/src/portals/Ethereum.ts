import { Signer } from "ethers";
import {
  ExternalProvider,
  JsonRpcProvider,
  Web3Provider,
} from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";

type Address = string;
type AccountIndex = number;

export type EthereumSigner = Signer | Address | AccountIndex;
export type EthereumProvider = string | ExternalProvider;
export type EthereumClient = JsonRpcProvider | Web3Provider;

export interface IEthereumConfig {
  provider: EthereumProvider;
  signer?: EthereumSigner;
  ens?: Address;
}

export class Ethereum {

  // @ts-ignore: initialized within setProvider
  private _client: EthereumClient;

  constructor(private _config: IEthereumConfig) {
    const { provider, signer, ens } = _config;

    // Sanitize Provider & Signer
    this.setProvider(provider, signer ? signer : 0);

    // Sanitize ENS address
    if (ens) {
      this.setENS(ens);
    }
  }

  public setProvider(provider: EthereumProvider, signer?: EthereumSigner) {
    this._config.provider = provider;

    if (typeof provider === "string") {
      this._client = new JsonRpcProvider(provider);
    } else {
      this._client = new Web3Provider(provider);
    }

    if (signer) {
      this.setSigner(signer);
    }
  }

  public setSigner(signer: EthereumSigner) {
    if (typeof signer === "string") {
      this._config.signer = getAddress(signer);
    } else if (Signer.isSigner(signer)) {
      this._config.signer = signer;

      if (signer.provider !== this._config.provider) {
        throw Error(
          `Signer's connected provider does not match the config's ` +
          `provider. Please call "setProvider(...)" before calling `+
          `"setSigner(...)" if a different provider is desired.`
        )
      }
    } else {
      this._config.signer = signer;
    }
  }

  public setENS(ens: Address) {
    this._config.ens = getAddress(ens);
  }

  public static isENSDomain(ens: string) {
    return ens.indexOf('.eth') !== -1;
  }
}
