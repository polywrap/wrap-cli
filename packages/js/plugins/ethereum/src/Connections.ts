import { Connection } from "./Connection";
import { Connection as SchemaConnection } from "./wrap";

import { getNetwork } from "@ethersproject/providers";

export interface ConnectionsConfig {
  networks: {
    [network: string]: Connection;
  };
  defaultNetwork?: string;
}

// https://www.typescriptlang.org/play?pretty=true&ts=4.7.4#code/LAKAxgNghgzjAEBJAdgEwKYA92oAoCcB7ABwGUoBbYideeAb1DoG1lL0AueGAF3wEtkAc3gAfbgE8KAI0IQAulyjIJAblBN4xAQDcoPWr338w8QRmyoAEstQ18XAoUwSbaewB4UFnE7KVqdAA+eABeBk06IXQeAAoeKHxongAaLSJidHweCQBKCJA6Ivh8GIBXfGR4BKSY5m0SLJz5dUKigF8UyO4Y+MTktIbM7Ik0vQgy9FyuWTl0ZQLi4prk+oymiXkw+HHJ1qWi0p4Kqr497vbNdtbNMEJkXnwysB5CfFj8xjbio5P4ZHQAHd4E4XPEABb8GBpbxYXwZchUGgAOnMcOstnsuX28EuIE0pSgqFhlj821iQy4j0EInEMCksgg03gygkYRCXwOv0q1UhMDWJBaVw0IDxIr0+Gq6F42wBwJJ8JIiMCHxuIAMvGYACIhgBhMq8QgULVbcJa3bofWG41qu4PObIiCEITxaU8bV6g2vY3ybHwAD0-vg5qgE0tXqNWtAdpgDqdLo1PGRhOJaHRfliOoyVu9WtyfsDwYtOcj0fusZR8ddMsERmQYHQhAAZkg06SEQEaAWg2d0GX7ZXnbEAPLSABW6BeyIA1ugJDBqzx86oA0HtSmFXgMlq0lmSCWffBQEA
export class Connections {
  private _connections: { [network: string]: Connection } = {};
  private _defaultNetwork: string;

  constructor(config: ConnectionsConfig) {
    for (const [network, connection] of Object.entries(config.networks)) {
      this.set(network, connection);
    }
    // Assign the default network (mainnet if not provided)
    if (config.defaultNetwork) {
      this.setDefaultNetwork(config.defaultNetwork);
    } else {
      this.setDefaultNetwork("mainnet");
    }
  }

  /** Returns Connection indexed by network name, or by default network if key is undefined */
  get(network?: string): Connection {
    if (!network) {
      return this._connections[this._defaultNetwork];
    }
    return this._connections[network];
  }

  /** sets Connection to index of network name */
  set(network: string, connection: Connection): void {
    const networkStr = network.toLowerCase();

    this._connections[networkStr] = connection;

    // Handle the case where `network` is a number
    const networkNumber = Number.parseInt(networkStr);

    if (networkNumber) {
      const namedNetwork = getNetwork(networkNumber);
      this._connections[namedNetwork.name] = connection;
    }
  }

  /** sets defaultNetwork to network, and creates new Connection if network is not found in store */
  setDefaultNetwork(network: string): void {
    this._defaultNetwork = network;

    // Create a connection for the default network if none exists
    if (!this._connections[this._defaultNetwork]) {
      this.set(
        this._defaultNetwork,
        Connection.fromNetwork(this._defaultNetwork)
      );
    }
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
      return this.get(this._defaultNetwork);
    }

    const { networkNameOrChainId, node } = connection;
    let result: Connection;

    // If a custom network is provided, either get an already
    // established connection, or a create a new one
    if (networkNameOrChainId) {
      const networkStr = networkNameOrChainId.toLowerCase();
      if (this.get(networkStr)) {
        result = this.get(networkStr);
      } else {
        const chainId = Number.parseInt(networkStr);

        if (!isNaN(chainId)) {
          result = Connection.fromNetwork(chainId);
        } else {
          result = Connection.fromNetwork(networkStr);
        }
      }
    } else {
      result = this.get(this._defaultNetwork);
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
