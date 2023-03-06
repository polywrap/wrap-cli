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
    const subinvokeUri = `fs/${path.join(
      GetPathToTestWrappers(),
      "subinvoke",
      "00-subinvoke",
      "implementations",
      "rs"
    )}`

    const invokeUri = `fs/${path.join(
      GetPathToTestWrappers(),
      "subinvoke",
      "01-invoke",
      "implementations",
      "rs"
    )}`

    configBuilder.addRedirect("ens/imported-invoke.eth", invokeUri).addRedirect("ens/imported-subinvoke.eth", subinvokeUri);
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
