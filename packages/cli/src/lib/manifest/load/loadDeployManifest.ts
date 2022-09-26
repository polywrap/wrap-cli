import {
  displayPath,
  loadEnvironmentVariables,
  searchOptional,
  withSpinner,
  intlMsg,
} from "../../";

import { Schema as JsonSchema } from "jsonschema";
import fs from "fs";
import path from "path";
import {
  DeployManifest,
  deserializeDeployManifest,
} from "@polywrap/polywrap-manifest-types-js";

export const defaultDeployManifest = [
  "polywrap.deploy.yaml",
  "polywrap.deploy.yml",
];

export async function loadDeployManifest(
  manifestPath: string,
  quiet = false
): Promise<DeployManifest> {
  const run = (): Promise<DeployManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      let result = deserializeDeployManifest(manifest);
      result = (loadEnvironmentVariables(
        (result as unknown) as Record<string, unknown>
      ) as unknown) as DeployManifest;
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
    )) as DeployManifest;
  }
}

export async function loadDeployManifestExt(
  manifestExtPath: string,
  quiet = false
): Promise<JsonSchema | undefined> {
  const run = (): JsonSchema | undefined => {
    const configSchemaPath = path.join(
      path.dirname(manifestExtPath),
      "/polywrap.deploy.ext.json"
    );

    let extSchema: JsonSchema | undefined;

    if (fs.existsSync(configSchemaPath)) {
      extSchema = JSON.parse(
        fs.readFileSync(configSchemaPath, "utf-8")
      ) as JsonSchema;
    }

    return extSchema;
  };

  if (quiet) {
    return run();
  } else {
    manifestExtPath = displayPath(manifestExtPath);
    return await searchOptional(
      intlMsg.lib_helpers_deployManifestExt_loadText({ path: manifestExtPath }),
      intlMsg.lib_helpers_deployManifestExt_loadError({
        path: manifestExtPath,
      }),
      intlMsg.lib_helpers_deployManifestExt_loadWarning({
        path: manifestExtPath,
      }),
      async () => {
        return run();
      }
    );
  }
}
