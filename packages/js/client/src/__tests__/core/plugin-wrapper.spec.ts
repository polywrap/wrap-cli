import {
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import {
  Web3ApiClientConfig,
  Plugin,
  Web3ApiClient,
} from "../..";
import { createWeb3ApiClient } from "../../createWeb3ApiClient";

jest.setTimeout(200000);

describe("plugin-wrapper", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  beforeAll(async () => {
    const {
      ipfs,
      ethereum,
      ensAddress: ens,
      registrarAddress,
      resolverAddress,
    } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  const getClient = async (config?: Partial<Web3ApiClientConfig>) => {
    const client = await createWeb3ApiClient(
      {
        ethereum: {
          networks: {
            testnet: {
              provider: ethProvider,
            },
          },
        },
        ipfs: { provider: ipfsProvider },
        ens: {
          query: {
            addresses: {
              testnet: ensAddress,
            },
          },
        },
      },
      config
    );

    return client;
  };

  test("plugin registration - with default plugins", () => {
    const implementationUri = "w3://ens/some-implementation.eth";
    const defaultPlugins = [
      "w3://ens/ipfs.web3api.eth",
      "w3://ens/ens.web3api.eth",
      "w3://ens/ethereum.web3api.eth",
      "w3://ens/http.web3api.eth",
      "w3://ens/js-logger.web3api.eth",
      "w3://ens/uts46.web3api.eth",
      "w3://ens/sha3.web3api.eth",
      "w3://ens/graph-node.web3api.eth",
      "w3://ens/fs.web3api.eth",
    ];

    const client = new Web3ApiClient({
      plugins: [
        {
          uri: implementationUri,
          plugin: {
            factory: () => ({} as Plugin),
            manifest: {
              schema: "",
              implements: [],
            },
          },
        },
      ],
    });

    const pluginUris = client.getPlugins().map((x) => x.uri.uri);

    expect(pluginUris).toEqual([implementationUri].concat(defaultPlugins));
  });

  test("getSchema -- plugin schema", async () => {
    const client = await getClient();
    const schema: string = await client.getSchema(
      "w3://ens/js-logger.web3api.eth"
    );
    
    expect(schema).toStrictEqual(
      `### Web3API Header START ###
scalar UInt
scalar UInt8
scalar UInt16
scalar UInt32
scalar Int
scalar Int8
scalar Int16
scalar Int32
scalar Bytes
scalar BigInt
scalar BigNumber
scalar JSON
scalar Map

directive @imported(
  uri: String!
  namespace: String!
  nativeType: String!
) on OBJECT | ENUM

directive @imports(
  types: [String!]!
) on OBJECT

directive @capability(
  type: String!
  uri: String!
  namespace: String!
) repeatable on OBJECT

directive @enabled_interface on OBJECT

directive @annotate(type: String!) on FIELD

### Web3API Header END ###

type Query implements Logger_Query @imports(
  types: [
    "Logger_Query",
    "Logger_LogLevel"
  ]
) {
  log(
    level: Logger_LogLevel!
    message: String!
  ): Boolean!
}

### Imported Queries START ###

type Logger_Query @imported(
  uri: "ens/logger.core.web3api.eth",
  namespace: "Logger",
  nativeType: "Query"
) {
  log(
    level: Logger_LogLevel!
    message: String!
  ): Boolean!
}

### Imported Queries END ###

### Imported Objects START ###

enum Logger_LogLevel @imported(
  uri: "ens/logger.core.web3api.eth",
  namespace: "Logger",
  nativeType: "LogLevel"
) {
  DEBUG
  INFO
  WARN
  ERROR
}

### Imported Objects END ###
`
    );
  });
});
