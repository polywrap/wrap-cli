import path from "path";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { ClientConfigBuilder, PolywrapClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { testCases } from "./jobrunner-test-cases";
import { JobRunner } from "../../lib";

jest.setTimeout(200000);

describe("workflow JobRunner", () => {
  let configBuilder: ClientConfigBuilder;

  beforeAll(async () => {
    configBuilder = new PolywrapClientConfigBuilder();
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

    configBuilder.setRedirect("ens/imported-invoke.eth", invokeUri).setRedirect("ens/imported-subinvoke.eth", subinvokeUri);
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
