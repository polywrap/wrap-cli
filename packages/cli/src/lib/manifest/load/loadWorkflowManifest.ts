import { displayPath, withSpinner, intlMsg } from "../../";

import fs from "fs";
import {
  PolywrapWorkflow,
  deserializePolywrapWorkflow,
} from "@polywrap/polywrap-manifest-types-js";

export const defaultWorkflowManifest = [
  "polywrap.test.yaml",
  "polywrap.test.yml",
];

export async function loadWorkflowManifest(
  manifestPath: string,
  quiet = false
): Promise<PolywrapWorkflow> {
  const run = (): Promise<PolywrapWorkflow> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializePolywrapWorkflow(manifest);
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  if (quiet) {
    return await run();
  } else {
    manifestPath = displayPath(manifestPath);
    return (await withSpinner(
      intlMsg.lib_helpers_manifest_loadText({ path: manifestPath }),
      intlMsg.lib_helpers_manifest_loadError({ path: manifestPath }),
      intlMsg.lib_helpers_manifest_loadWarning({ path: manifestPath }),
      async () => {
        return await run();
      }
    )) as PolywrapWorkflow;
  }
}
