import { GetPathToTestWrappers } from "@polywrap/test-cases";
import {
  buildAndDeployWrapper,
  initTestEnvironment,
  stopTestEnvironment,
  ensAddresses,
  providers
} from "@polywrap/test-env-js";
import { createPolywrapClient, JobResult, PolywrapClient, PolywrapClientConfig } from "../..";
import { outPropWorkflow, sanityWorkflow } from "./workflow-test-cases";

jest.setTimeout(200000);

describe("workflow", () => {
  let ipfsProvider: string;
  let ethProvider: string;
  let ensAddress: string;

  beforeAll(async () => {
    await initTestEnvironment();
    ipfsProvider = providers.ipfs;
    ethProvider = providers.ethereum;
    ensAddress = ensAddresses.ensAddress;
  });

  const getClient = async (config?: Partial<PolywrapClientConfig>) => {
    return createPolywrapClient(
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
          addresses: {
            testnet: ensAddress,
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
    let client: PolywrapClient;

    beforeAll(async () => {
      await buildAndDeployWrapper({
        wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/simple-storage`,
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
        onExecution: async (id: string, jobResult: JobResult) => {
          await tests[id](jobResult.data, jobResult.error);
        },
      });
    });

    test("workflow with output propagation", async () => {
      await client.run({
        workflow: outPropWorkflow,
        onExecution: async (id: string, jobResult: JobResult) => {
          await tests[id](jobResult.data, jobResult.error);
        },
      });
    });
  });
});
