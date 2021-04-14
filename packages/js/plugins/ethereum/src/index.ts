/* eslint-disable import/no-extraneous-dependencies */
import { query, mutation } from "./resolvers";
import { manifest } from "./manifest";
import { Connection as ConnectionOverride } from "./types";
import {
  Address,
  AccountIndex,
  EthereumSigner,
  EthereumProvider,
  Connection,
  Connections,
  ConnectionConfig,
  ConnectionConfigs,
} from "./Connection";

import {
  Client,
  Plugin,
  PluginManifest,
  PluginModules,
  PluginFactory,
} from "@web3api/core-js";
import { ethers } from "ethers";

// Export all types that are nested inside of EthereumConfig.
// This is required for the extractPluginConfigs.ts script.
export {
  Address,
  AccountIndex,
  EthereumSigner,
  EthereumProvider,
  ConnectionConfig,
  ConnectionConfigs,
};

export interface EthereumConfig {
  networks: ConnectionConfigs;
  defaultNetwork?: string;
}

export class EthereumPlugin extends Plugin {
  private _connections: Connections;
  private _defaultNetwork: string;

  constructor(config: EthereumConfig) {
    super();
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

  public async deployContract(
    abi: ethers.ContractInterface,
    bytecode: string,
    args: string[],
    connectionOverride?: ConnectionOverride
  ): Promise<Address> {
    const connection = await this.getConnection(connectionOverride);
    const signer = connection.getSigner();
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...args);
    await contract.deployTransaction.wait();
    return contract.address;
  }

  public async callView(
    address: Address,
    method: string,
    args: string[],
    connectionOverride?: ConnectionOverride
  ): Promise<string> {
    const connection = await this.getConnection(connectionOverride);
    const contract = connection.getContract(address, [method], false);
    const funcs = Object.keys(contract.interface.functions);
    const res = await contract[funcs[0]](...args);
    return res.toString();
  }

  public async sendTransaction(
    address: Address,
    method: string,
    args: string[],
    connectionOverride?: ConnectionOverride
  ): Promise<string> {
    const connection = await this.getConnection(connectionOverride);
    const contract = connection.getContract(address, [method]);
    const funcs = Object.keys(contract.interface.functions);
    const tx = await contract[funcs[0]](...args);
    const res = await tx.wait();
    // TODO: improve this
    return res.transactionHash;
  }

  public async getConnection(
    connectionOverride?: ConnectionOverride
  ): Promise<Connection> {
    if (!connectionOverride) {
      return this._connections[this._defaultNetwork];
    }

    const { networkNameOrChainId, node } = connectionOverride;
    let connection: Connection;

    // If a custom network is provided, either get an already
    // established connection, or a create a new one
    if (networkNameOrChainId) {
      if (this._connections[networkNameOrChainId]) {
        connection = this._connections[networkNameOrChainId];
      } else {
        const chainId = Number.parseInt(networkNameOrChainId);

        if (!isNaN(chainId)) {
          connection = Connection.fromNetwork(chainId);
        } else {
          connection = Connection.fromNetwork(networkNameOrChainId);
        }
      }
    } else {
      connection = this._connections[this._defaultNetwork];
    }

    // If a custom node endpoint is provided, create a combined
    // connection with the node's endpoint and a connection's signer
    // (if one exists for the network)
    if (node) {
      const nodeConnection = Connection.fromNode(node);
      const nodeNetwork = await nodeConnection.getProvider().getNetwork();

      const establishedConnection =
        this._connections[nodeNetwork.chainId.toString()] ||
        this._connections[nodeNetwork.name];

      if (establishedConnection) {
        try {
          nodeConnection.setSigner(establishedConnection.getSigner());
        } catch (e) {
          // It's okay if there isn't a signer available.
        }
      }

      connection = nodeConnection;
    }

    return connection;
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
