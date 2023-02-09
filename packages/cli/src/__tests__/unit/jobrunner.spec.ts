import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { buildWrapper } from "@polywrap/test-env-js";
import { testCases } from "./jobrunner-test-cases";
import { JobRunner } from "../../lib";
import path from "path";
import { ClientConfigBuilder, IClientConfigBuilder } from "@polywrap/client-config-builder-js";

jest.setTimeout(200000);

describe("workflow JobRunner", () => {
  let configBuilder: IClientConfigBuilder;

  beforeAll(async () => {
    await buildWrapper(
      path.join(GetPathToTestWrappers(), "wasm-as", "simple-calculator"),
      undefined,
      true
    );
    configBuilder = new ClientConfigBuilder().addDefaults();
  });

  for (const testCase of testCases) {
    it(testCase.name, async () => {
      const ids = Object.keys(testCase.workflow.jobs);
      const jobRunner = new JobRunner(configBuilder, testCase.onExecution);
      await jobRunner.run(testCase.workflow.jobs, ids);
    });
  }
});
