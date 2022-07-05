import { GetPathToTestWrappers } from "@polywrap/test-cases";
import {
  initTestEnvironment,
  stopTestEnvironment,
  buildWrapper,
} from "@polywrap/test-env-js";
import { PolywrapClient } from "../..";
import { getClientWithEnsAndIpfs } from "../utils/getClientWithEnsAndIpfs";
import { testCases } from "./workflow-test-cases";
import path from "path";

jest.setTimeout(200000);

describe("workflow", () => {
  let client: PolywrapClient;

  beforeAll(async () => {
    await initTestEnvironment();

    await buildWrapper(
      path.join(GetPathToTestWrappers(), "wasm-as", "simple-calculator")
    );

    client = await getClientWithEnsAndIpfs();
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  for (const testCase of testCases) {
    test(testCase.name, async () => {
      await client.run({
        workflow: testCase.workflow,
        onExecution: testCase.onExecution,
      });
    });
  }
});
