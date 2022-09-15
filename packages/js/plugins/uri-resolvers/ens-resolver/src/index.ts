import {
  Client,
  Module,
  Args_tryResolveUri,
  Args_getFile,
  UriResolver_MaybeUriOrManifest,
  Bytes,
  Ethereum_Module,
  manifest,
} from "./wrap";

import { ethers } from "ethers";
import { Base58 } from "@ethersproject/basex";
import { getAddress } from "@ethersproject/address";
import { PluginFactory, PluginPackage } from "@polywrap/plugin-js";

export type Address = string;

export interface Addresses {
  [network: string]: Address;
}

export interface EnsResolverPluginConfig {
  addresses?: Addresses;
}

export class EnsResolverPlugin extends Module<EnsResolverPluginConfig> {
  public static defaultAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

  constructor(config: EnsResolverPluginConfig) {
    super(config);

    // Sanitize address
    if (this.config.addresses) {
      this._setAddresses(this.config.addresses);
    }
  }

  async tryResolveUri(
    args: Args_tryResolveUri,
    client: Client
  ): Promise<UriResolver_MaybeUriOrManifest | null> {
    if (args.authority !== "ens") {
      return null;
    }

    try {
      const cid = await this.ensToCID(args.path, client);

      if (!cid) {
        return null;
      }

      return {
        uri: `ipfs/${cid}`,
        manifest: null,
      };
    } catch (e) {
      // TODO: logging https://github.com/polywrap/monorepo/issues/33
    }

    // Nothing found
    return { uri: null, manifest: null };
  }

  getFile(_args: Args_getFile, _client: Client): Bytes | null {
    return null;
  }

  async ensToCID(domain: string, client: Client): Promise<string> {
    const ensAbi = {
      resolver:
        "function resolver(bytes32 node) external view returns (address)",
    };
    const resolverAbi = {
      contenthash:
        "function contenthash(bytes32 nodehash) view returns (bytes)",
      content: "function content(bytes32 nodehash) view returns (bytes32)",
    };

    let ensAddress = EnsResolverPlugin.defaultAddress;

    // Remove the ENS URI scheme & authority
    domain = domain.replace("wrap://", "");
    domain = domain.replace("ens/", "");

    // Check for non-default network
    let network = "mainnet";
    const hasNetwork = /^[A-Za-z0-9]+\//i.exec(domain);
    if (hasNetwork) {
      network = domain.substring(0, domain.indexOf("/"));

      // Remove the network from the domain URI's path
      domain = domain.replace(network + "/", "");

      // Lowercase only
      network = network.toLowerCase();

      // Check if we have a custom address configured
      // for this network
      if (this.config.addresses && this.config.addresses[network]) {
        ensAddress = this.config.addresses[network];
      }
    }

    const domainNode = ethers.utils.namehash(domain);

    const callContractView = async (
      address: string,
      method: string,
      args: string[],
      networkNameOrChainId?: string
    ): Promise<string> => {
      const { data, error } = await Ethereum_Module.callContractView(
        {
          address,
          method,
          args,
          connection: networkNameOrChainId
            ? {
                networkNameOrChainId,
              }
            : undefined,
        },
        client
      );

      if (error) {
        throw error;
      }

      if (data) {
        if (typeof data !== "string") {
          throw Error(
            `Malformed data returned from Ethereum.callContractView: ${data}`
          );
        }

        return data;
      }

      throw Error(
        `Ethereum.callContractView returned nothing.\nData: ${data}\nError: ${error}`
      );
    };

    // Get the node's resolver address
    const resolverAddress = await callContractView(
      ensAddress,
      ensAbi.resolver,
      [domainNode],
      network
    );

    // Get the CID stored at this domain
    let hash;
    try {
      hash = await callContractView(
        resolverAddress,
        resolverAbi.contenthash,
        [domainNode],
        network
      );
    } catch (e) {
      try {
        // Fallback, contenthash doesn't exist, try content
        hash = await callContractView(
          resolverAddress,
          resolverAbi.content,
          [domainNode],
          network
        );
      } catch (err) {
        // The resolver contract is unknown...
        throw Error(`Incompatible resolver ABI at address ${resolverAddress}`);
      }
    }

    if (hash === "0x") {
      return "";
    }

    if (
      hash.substring(0, 10) === "0xe3010170" &&
      ethers.utils.isHexString(hash, 38)
    ) {
      return Base58.encode(ethers.utils.hexDataSlice(hash, 4));
    } else {
      throw Error(`Unknown CID format, CID hash: ${hash}`);
    }
  }

  private _setAddresses(addresses: Addresses): void {
    this.config.addresses = {};

    for (const network of Object.keys(addresses)) {
      this.config.addresses[network] = getAddress(addresses[network]);
    }
  }
}

export const ensResolverPlugin: PluginFactory<EnsResolverPluginConfig> = (
  config: EnsResolverPluginConfig
) => new PluginPackage(manifest, new EnsResolverPlugin(config));

export const plugin = ensResolverPlugin;
