import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { buildWrapper } from "@polywrap/test-env-js";
import { PolywrapClient } from "../..";
import { testCases } from "./workflow-test-cases";
import path from "path";
import { getClient } from "../utils/getClient";

jest.setTimeout(200000);

describe("workflow", () => {
  let client: PolywrapClient;

  beforeAll(async () => {
    await buildWrapper(
      path.join(GetPathToTestWrappers(), "wasm-as", "simple-calculator")
    );

    client = await getClient();
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
