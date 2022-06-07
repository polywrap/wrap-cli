import { Workflow } from "@web3api/core-js";
import { GetPathToTestApis } from "@web3api/test-cases";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClient, Web3ApiClientConfig } from "../..";

const workflow: Workflow = {
  name: "simple-storage",
  jobs: {
    cases: {
      steps: [
        {
          uri: "ens/testnet/simple-storage.eth",
          module: "mutation",
          method: "deployContract",
          input: {
            connection: null,
          },
        },
      ],
      jobs: {
        case1: {
          steps: [
            {
              uri: "ens/testnet/simple-storage.eth",
              module: "mutation",
              method: "setData",
              input: {
                address: "0xA57B8a5584442B467b4689F1144D269d096A3daF",
                value: 100,
                connection: null,
              },
            },
            {
              uri: "ens/testnet/simple-storage.eth",
              module: "query",
              method: "getData",
              input: {
                address: "0xA57B8a5584442B467b4689F1144D269d096A3daF",
                connection: null,
              },
            },
          ],
        },
      },
    },
  },
};

jest.setTimeout(200000);

describe("workflow", () => {
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
      resolverAddress,
      registrarAddress,
    } = await initTestEnvironment();
    ipfsProvider = ipfs;
    ethProvider = ethereum;
    ensAddress = ens;
    ensRegistrarAddress = registrarAddress;
    ensResolverAddress = resolverAddress;
  });

  const getClient = async (config?: Partial<Web3ApiClientConfig>) => {
    return createWeb3ApiClient(
      {
        ethereum: {
          networks: {
            testnet: {
              provider: ethProvider,
            },
          },
          defaultNetwork: "testnet",
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
  };

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("simple-storage", () => {
    let client: Web3ApiClient;

    beforeAll(async () => {
      await buildAndDeployApi({
        apiAbsPath: `${GetPathToTestApis()}/wasm-as/simple-storage`,
        ipfsProvider,
        ensRegistryAddress: ensAddress,
        ethereumProvider: ethProvider,
        ensRegistrarAddress,
        ensResolverAddress,
        ensName: "simple-storage.eth",
      });

      client = await getClient();
    });

    const tests: Record<
      string,
      (data: unknown, error: unknown) => Promise<void>
    > = {
      "cases.0": async (data: unknown, error: unknown) => {
        expect(error).toBeFalsy();
        expect(data).toBeTruthy();
        expect(data).toBe("0xA57B8a5584442B467b4689F1144D269d096A3daF");
      },
      "cases.case1.0": async (data: unknown, error: unknown) => {
        expect(error).toBeFalsy();
        expect(data).toBeTruthy();
        expect(data).toBe(
          "0xa6ec6a2db5dc39d27d60ff4a7f76faf80893bfcfe0adb1207fc2b2a0aae3d180"
        );
      },
      "cases.case1.1": async (data: unknown, error: unknown) => {
        expect(error).toBeFalsy();
        expect(data).toBeTruthy();
        expect(data).toBe(100);
      },
    };

    it("should cook recipes", async () => {
      await client.run({
        workflow,
        onExecution: async (id: string, data: unknown, error: unknown) => {
          console.log(id);
          await tests[id](data, error);
        },
      });
    });
  });
});
