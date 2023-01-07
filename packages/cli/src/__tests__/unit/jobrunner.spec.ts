import path from "path";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { ClientConfigBuilder, IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { testCases } from "./jobrunner-test-cases";
import { JobRunner } from "../../lib";

jest.setTimeout(200000);

describe("workflow JobRunner", () => {
  let configBuilder: IClientConfigBuilder;

  beforeAll(async () => {

    configBuilder = new ClientConfigBuilder();
    const uri = `fs/${path.join(
      GetPathToTestWrappers(),
      "subinvoke",
      "00-subinvoke",
      "implementations",
      "rs"
    )}`
    configBuilder.addRedirect("ens/imported.eth", uri);
    configBuilder.addDefaults();
  });

  for (const testCase of testCases) {
    it(testCase.name, async () => {
      const ids = Object.keys(testCase.workflow.jobs);
      const jobRunner = new JobRunner(configBuilder, testCase.onExecution);
      await jobRunner.run(testCase.workflow.jobs, ids);
    });
  }
});
