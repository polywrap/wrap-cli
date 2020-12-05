import { Query, Mutation } from "./schema";

import {
  QueryClient,
  Web3ApiClientPlugin,
  Resolvers
} from "@web3api/client-js";

import { ethers } from "ethers";
import { Base58 } from "@ethersproject/basex";
import { getAddress } from "@ethersproject/address";

export type Address = string;

export interface EnsConfig {
  address?: Address;
}

export class EnsPlugin extends Web3ApiClientPlugin {

  constructor(private _config: EnsConfig) {
    super({
      import: ["ethereum.web3api.eth"],
      implement: ["uri-resolver.core.web3api.eth"]
    });

    // Sanitize address
    if (this._config.address) {
      this.setAddress(this._config.address);
    }
  }

  // TODO: generated types here from the schema.graphql to ensure safety `Resolvers<TQuery, TMutation>`
  public getResolvers(client: QueryClient): Resolvers {
    return {
      Query: Query(this, client),
      Mutation: Mutation(this, client)
    };
  }

  public setAddress(address: Address) {
    this._config.address = getAddress(address);
  }

  public async ensToCID(domain: string, client: QueryClient): Promise<string> {
    const ensAddress = this._config.address || "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
    const ensAbi = {
      resolver: "function resolver(bytes32 node) external view returns (address)"
    };
    const resolverAbi = {
      contenthash: "function contenthash(bytes32 nodehash) view returns (bytes)",
      content: "function content(bytes32 nodehash) view returns (bytes32)"
    };
    const domainNode = ethers.utils.namehash(domain);

    const callView = async (address: string, method: string, args: string[]): Promise<string> => {
      const { data } = await client.query({
        uri: "ethereum.web3api.eth",
        query: `query {
          callView(
            address: "${address}",
            method: "${method}",
            args: ${args}
          ) { result }
        }`
      });

      return data.result;
    }

    // Get the node's resolver address
    const resolverAddress = await callView(ensAddress, ensAbi.resolver, [domainNode]);

    // Get the CID stored at this domain
    let hash;
    try {
      hash = await callView(resolverAddress, resolverAbi.contenthash, [domainNode]);
    } catch (e) {
      try {
        // Fallback, contenthash doesn't exist, try content
        hash = await callView(resolverAddress, resolverAbi.content, [domainNode]);
      } catch (err) {
        // The resolver contract is unknown...
        throw Error(`Incompatible resolver ABI at address ${resolverAddress}`);
      }
    }

    if (hash === "0x") {
      return ""
    }

    if (hash.substring(0, 10) === "0xe3010170" && ethers.utils.isHexString(hash, 38)) {
      return Base58.encode(ethers.utils.hexDataSlice(hash, 4));
    } else {
      throw Error(`Unkown CID format, CID hash: ${hash}`);
    }
  }

  public static isENSDomain(domain: string) {
    return ethers.utils.isValidName(domain) && domain.indexOf('.eth') !== -1;
  }
}
