import { GetPathToTestApis } from "@web3api/test-cases";
import {
  buildAndDeployApi,
  initTestEnvironment,
  stopTestEnvironment,
  ensAddresses,
  providers
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClient, Web3ApiClientConfig } from "../..";
import { outPropWorkflow, sanityWorkflow } from "./workflow-test-cases";

jest.setTimeout(200000);

describe("workflow", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;
  let ensRegistrarAddress: string;
  let ensResolverAddress: string;

  beforeAll(async () => {
    await initTestEnvironment();
    ipfsProvider = providers.ipfs;
    ethProvider = providers.ethereum;
    ensAddress = ensAddresses.ensAddress;
    ensRegistrarAddress = ensAddresses.registrarAddress;
    ensResolverAddress = ensAddresses.resolverAddress;
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
        ethereumProvider: ethProvider,
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
        expect(data).toContain("0x");
      },
      "cases.case1.0": async (data: unknown, error: unknown) => {
        expect(error).toBeFalsy();
        expect(data).toBeTruthy();
        expect(data).toContain(
          "0x"
        );
      },
      "cases.case1.1": async (data: unknown, error: unknown) => {
        expect(error).toBeFalsy();
        expect(data).toBeTruthy();
        expect(data).toBe(100);
      },
    };

    test("sanity workflow", async () => {
      await client.run({
        workflow: sanityWorkflow,
        onExecution: async (id: string, data: unknown, error: unknown) => {
          await tests[id](data, error);
        },
      });
    });

    test("workflow with output propagation", async () => {
      await client.run({
        workflow: outPropWorkflow,
        onExecution: async (id: string, data: unknown, error: unknown) => {
          await tests[id](data, error);
        },
      });
    });
  });
});
