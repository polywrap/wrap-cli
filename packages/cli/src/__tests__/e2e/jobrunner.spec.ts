import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { buildWrapper } from "@polywrap/test-env-js";
import { testCases } from "./jobrunner-test-cases";
import { Uri } from "@polywrap/core-js";
import { JobRunner } from "../../lib";
import path from "path";
import { PolywrapClient } from "@polywrap/client-js";

jest.setTimeout(200000);

describe.skip("workflow", () => {

  let client: PolywrapClient;

  beforeAll(async () => {
    await buildWrapper(
      path.join(GetPathToTestWrappers(), "wasm-as", "simple-calculator")
    );

    client = new PolywrapClient({});
  });

  for (const testCase of testCases) {
    test(testCase.name, async () => {
      const ids = Object.keys(testCase.workflow.jobs);
      const jobRunner = new JobRunner<Record<string, unknown>, Uri | string>(client, testCase.onExecution);

      await Promise.all(
          ids.map((id) => jobRunner.run({ relativeId: id, parentId: "", jobs: testCase.workflow.jobs }))
      );
    });
  }
});

