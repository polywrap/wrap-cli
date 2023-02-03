import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { Commands } from "@polywrap/cli-js";
import { testCases } from "./jobrunner-test-cases";
import { JobRunner } from "../../lib";
import path from "path";
import { ClientConfigBuilder, IClientConfigBuilder } from "@polywrap/client-config-builder-js";

jest.setTimeout(200000);

describe("workflow JobRunner", () => {
  let configBuilder: IClientConfigBuilder;

  beforeAll(async () => {
    await Commands.build({
      codegen: true,
      strategy: "vm",
    }, {
      cwd: path.join(GetPathToTestWrappers(), "wasm-as", "simple-calculator"),
    });
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
