import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { buildWrapper } from "@polywrap/test-env-js";
import { testCases } from "./jobrunner-test-cases";
import { JobRunner } from "../../lib";
import path from "path";
import { Client } from "@polywrap/core-js";
import { createDefaultClient } from "../../utils/createDefaultClient";

jest.setTimeout(200000);

describe("workflow JobRunner", () => {
  let client: Client;

  beforeAll(async () => {
    await buildWrapper(
      path.join(GetPathToTestWrappers(), "wasm-as", "simple-calculator")
    );

    client = createDefaultClient();
  });

  for (const testCase of testCases) {
    test(testCase.name, async () => {
      const ids = Object.keys(testCase.workflow.jobs);
      const jobRunner = new JobRunner(client, testCase.onExecution);
      await jobRunner.run(testCase.workflow.jobs, ids);
    });
  }
});

