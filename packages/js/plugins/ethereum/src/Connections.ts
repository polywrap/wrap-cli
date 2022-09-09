import { Connection, EthereumProvider } from "./Connection";
import { Connection as SchemaConnection } from "./wrap";

import { getNetwork } from "@ethersproject/providers";

type Networks = {
  [network: string]: Connection;
};

export interface ConnectionsConfig {
  networks: Networks;
  defaultNetwork?: string;
}

export class Connections {
  private _connections: Networks = {};
  private _defaultNetwork: string;

  constructor(config: ConnectionsConfig) {
    for (const [network, connection] of Object.entries(config.networks)) {
      this.set(network, connection);
    }
    // Assign the default network (mainnet if not provided)
    if (config.defaultNetwork) {
      this.setDefaultNetwork(config.defaultNetwork);
    } else if (this._connections["mainnet"]) {
      this.setDefaultNetwork("mainnet");
    } else {
      this.setDefaultNetwork("mainnet", Connection.fromNetwork("mainnet"));
    }

    // @TODO(cbrzn): Remove this once the Sha3 & Uts46 wrappers ENS has been moved to mainnet
    const lacksGoerliConnection = !Object.keys(this._connections).find(
      (k) => k === "goerli"
    );
    if (lacksGoerliConnection) {
      this.set(
        "goerli",
        "https://goerli.infura.io/v3/d119148113c047ca90f0311ed729c466"
      );
    }
  }

  /** Returns Connection indexed by network name, or by default network if key is undefined */
  get(network?: string): Connection | undefined {
    if (!network) {
      return this._connections[this._defaultNetwork.toLowerCase()];
    }
    return this._connections[network.toLowerCase()];
  }

  /** sets Connection to index of network name */
  set(network: string, connection: Connection | EthereumProvider): void {
    const networkStr = network.toLowerCase();

    if (!(connection instanceof Connection)) {
      connection = new Connection({ provider: connection });
    }
    this._connections[networkStr] = connection;

    // Handle the case where `network` is a number
    const networkNumber = Number.parseInt(networkStr);

    if (networkNumber) {
      const namedNetwork = getNetwork(networkNumber);
      this._connections[namedNetwork.name] = connection;
    }
  }

  /** sets defaultNetwork to network, and optionally sets associated connection */
  setDefaultNetwork(
    network: string,
    connection?: Connection | EthereumProvider
  ): void {
    if (connection) {
      this.set(network, connection);
    }

    if (!this.get(network)) {
      throw Error(`No connection found for network: ${network}`);
    }

    this._defaultNetwork = network;
  }

  /** returns default network */
  getDefaultNetwork(): string {
    return this._defaultNetwork;
  }

  /** returns Connection indexed by given connection, or returns new Connection if connection is not found in store.
   * Returns default network Connection if a connection argument is not provided. */
  async getConnection(
    connection?: SchemaConnection | null
  ): Promise<Connection> {
    if (!connection) {
      return this.get(this._defaultNetwork) as Connection;
    }

    const { networkNameOrChainId, node } = connection;
    let result: Connection;

    // If a custom network is provided, either get an already
    // established connection, or a create a new one
    if (networkNameOrChainId) {
      const networkStr = networkNameOrChainId.toLowerCase();
      if (this.get(networkStr)) {
        result = this.get(networkStr) as Connection;
      } else {
        const chainId = Number.parseInt(networkStr);

        if (!isNaN(chainId)) {
          result = Connection.fromNetwork(chainId);
        } else {
          result = Connection.fromNetwork(networkStr);
        }
      }
    } else {
      result = this.get(this._defaultNetwork) as Connection;
    }

    // If a custom node endpoint is provided, create a combined
    // connection with the node's endpoint and a connection's signer
    // (if one exists for the network)
    if (node) {
      const nodeConnection = Connection.fromNode(node);
      const nodeNetwork = await nodeConnection.getProvider().getNetwork();

      const establishedConnection =
        this.get(nodeNetwork.chainId.toString()) || this.get(nodeNetwork.name);

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
}
