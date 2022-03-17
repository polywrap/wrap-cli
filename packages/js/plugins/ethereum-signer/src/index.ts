/* eslint-disable import/no-extraneous-dependencies */
import { query, mutation } from "./resolvers";
import { manifest, Query, Mutation } from "./w3";
import * as Types from "./w3";
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
import * as Mapping from "./mapping";

import {
  Client,
  Plugin,
  PluginPackageManifest,
  PluginFactory,
} from "@web3api/core-js";

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

export class EthereumSignerPlugin extends Plugin {
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

  public static manifest(): PluginPackageManifest {
    return manifest;
  }

  public getModules(
    _client: Client
  ): {
    query: Query.Module;
    mutation: Mutation.Module;
  } {
    return {
      query: query(this),
      mutation: mutation(this),
    };
  }

  /// Mutation

  public async sendTransaction(
    input: Mutation.Input_sendTransaction
  ): Promise<Types.TxResponse> {
    const connection = await this.getConnection(input.connection);
    const signer = connection.getSigner();
    const res = await signer.sendTransaction(input.txRequest);
    return Mapping.toTxResponse(res);
  }

  public async sendTransactionAndWait(
    input: Mutation.Input_sendTransactionAndWait
  ): Promise<Types.TxReceipt> {
    const connection = await this.getConnection(input.connection);
    const signer = connection.getSigner();
    const response = await signer.sendTransaction(input.txRequest);
    const receipt = await response.wait();
    return Mapping.toTxReceipt(receipt);
  }

  public async signMessage(input: Mutation.Input_signMessage): Promise<string> {
    const connection = await this.getConnection(input.connection);
    return await connection.getSigner().signMessage(input.message);
  }

  public async sendRPC(input: Mutation.Input_sendRPC): Promise<string> {
    const connection = await this.getConnection(input.connection);
    const provider = connection.getProvider();
    const response = await provider.send(input.method, input.params);
    return response.toString();
  }

  /// Query

  public async getNetwork(
    input: Query.Input_getNetwork
  ): Promise<Types.Network> {
    const connection = await this.getConnection(input.connection);
    const provider = connection.getProvider();
    const network = await provider.getNetwork();
    return {
      name: network.name,
      chainId: network.chainId,
      ensAddress: network.ensAddress,
    };
  }

  public async callView(input: Query.Input_callView): Promise<string> {
    const connection = await this.getConnection(input.connection);
    const res = await connection.getProvider().call(input.txRequest);
    return res.toString();
  }

  /// Utils

  public async getConnection(
    connection?: Types.Connection | null
  ): Promise<Connection> {
    if (!connection) {
      return this._connections[this._defaultNetwork];
    }

    const { networkNameOrChainId, node } = connection;
    let result: Connection;

    // If a custom network is provided, either get an already
    // established connection, or a create a new one
    if (networkNameOrChainId) {
      const networkStr = networkNameOrChainId.toLowerCase();
      if (this._connections[networkStr]) {
        result = this._connections[networkStr];
      } else {
        const chainId = Number.parseInt(networkStr);

        if (!isNaN(chainId)) {
          result = Connection.fromNetwork(chainId);
        } else {
          result = Connection.fromNetwork(networkStr);
        }
      }
    } else {
      result = this._connections[this._defaultNetwork];
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

      result = nodeConnection;
    }

    return result;
  }

  public parseArgs(args?: string[] | null): unknown[] {
    if (!args) {
      return [];
    }

    return args.map((arg: string) =>
      (arg.startsWith("[") && arg.endsWith("]")) ||
      (arg.startsWith("{") && arg.endsWith("}"))
        ? JSON.parse(arg)
        : arg
    );
  }
}

export const ethereumPlugin: PluginFactory<EthereumConfig> = (
  opts: EthereumConfig
) => {
  return {
    factory: () => new EthereumSignerPlugin(opts),
    manifest: manifest,
  };
};
export const plugin = ethereumPlugin;
