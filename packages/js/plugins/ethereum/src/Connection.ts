import { Connection as SchemaConnection } from "./wrap";

import { Signer, ethers } from "ethers";
import {
  ExternalProvider,
  JsonRpcProvider,
  Web3Provider,
  Networkish,
  WebSocketProvider,
  getNetwork,
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
      const networkStr = network.toLowerCase();

      connections[networkStr] = connection;

      // Handle the case where `network` is a number
      const networkNumber = Number.parseInt(networkStr);

      if (networkNumber) {
        const namedNetwork = getNetwork(networkNumber);
        connections[namedNetwork.name] = connection;
      }
    }

    return connections;
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

    if (signer !== undefined) {
      this.setSigner(signer);
    }
  }

  public getProvider(): EthereumClient {
    return this._client;
  }

  // If setSigner fails, it will attempt to retrieve a signer from the given provider
  public setSigner(signer: EthereumSigner): void {
    if (typeof signer === "string") {
      this._config.signer = getAddress(signer);
    } else if (Signer.isSigner(signer)) {
      this._config.signer = signer;

      if (!this._client) {
        throw Error(
          `Please call "setProvider(...)" before calling setSigner(...)`
        );
      }

      // signer.connect may throw if changing providers is not supported
      // this is part of the ethers spec: https://docs.ethers.io/v5/api/signer/#Signer-connect
      // in practice, checking that signer.provider is not undefined should work
      // in theory, signer.provider does not have to work
      try {
        this._config.signer = signer.connect(this._client);
      } catch (e) {
        if (this._client.getSigner) {
          this._config.signer = this._client.getSigner();
        } else {
          throw e;
        }
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

export async function getConnection(
  connections: Connections,
  defaultNetwork: string,
  connection?: SchemaConnection | null
): Promise<Connection> {
  if (!connection) {
    return connections[defaultNetwork];
  }

  const { networkNameOrChainId, node } = connection;
  let result: Connection;

  // If a custom network is provided, either get an already
  // established connection, or a create a new one
  if (networkNameOrChainId) {
    const networkStr = networkNameOrChainId.toLowerCase();
    if (connections[networkStr]) {
      result = connections[networkStr];
    } else {
      const chainId = Number.parseInt(networkStr);

      if (!isNaN(chainId)) {
        result = Connection.fromNetwork(chainId);
      } else {
        result = Connection.fromNetwork(networkStr);
      }
    }
  } else {
    result = connections[defaultNetwork];
  }

  // If a custom node endpoint is provided, create a combined
  // connection with the node's endpoint and a connection's signer
  // (if one exists for the network)
  if (node) {
    const nodeConnection = Connection.fromNode(node);
    const nodeNetwork = await nodeConnection.getProvider().getNetwork();

    const establishedConnection =
      connections[nodeNetwork.chainId.toString()] ||
      connections[nodeNetwork.name];

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
