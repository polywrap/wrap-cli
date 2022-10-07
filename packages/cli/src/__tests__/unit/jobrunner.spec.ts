import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { buildWrapper } from "@polywrap/test-env-js";
import { testCases } from "./jobrunner-test-cases";
import { JobRunner } from "../../lib";
import path from "path";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";

jest.setTimeout(200000);

describe("workflow JobRunner", () => {
  beforeAll(async () => {
    await buildWrapper(
      path.join(GetPathToTestWrappers(), "wasm-as", "simple-calculator")
    );
  });

  for (const testCase of testCases) {
    test(testCase.name, async () => {
      const ids = Object.keys(testCase.workflow.jobs);
      const jobRunner = new JobRunner(
        new ClientConfigBuilder().addDefaults().build(),
        testCase.onExecution
      );
      await jobRunner.run(testCase.workflow.jobs, ids);
    });
  }
});
