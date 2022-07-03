import { GetPathToTestWrappers } from "@polywrap/test-cases";
import {
  buildAndDeployWrapper,
  initTestEnvironment,
  stopTestEnvironment,
  providers,
} from "@polywrap/test-env-js";
import { getClientWithEnsAndIpfs } from "../utils/getClientWithEnsAndIpfs";
import { JobResult, PolywrapClient } from "../..";
import { outPropWorkflow, sanityWorkflow } from "./workflow-test-cases";

jest.setTimeout(200000);

describe("workflow", () => {
  beforeAll(async () => {
    await initTestEnvironment();
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  describe("simple-storage", () => {
    let client: PolywrapClient;

    beforeAll(async () => {
      await buildAndDeployWrapper({
        wrapperAbsPath: `${GetPathToTestWrappers()}/wasm-as/simple-storage`,
        ipfsProvider: providers.ipfs,
        ethereumProvider: providers.ethereum,
        ensName: "simple-storage.eth",
      });

      client = await getClientWithEnsAndIpfs();
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
        expect(data).toContain("0x");
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
