import { displayPath, withSpinner, intlMsg } from "../../";

import {
  BuildManifest,
  deserializeBuildManifest,
} from "@polywrap/polywrap-manifest-types-js";
import { Schema as JsonSchema } from "jsonschema";
import path from "path";
import fs from "fs";

export const defaultBuildManifest = [
  "polywrap.build.yaml",
  "polywrap.build.yml",
];

export async function loadBuildManifest(
  manifestPath: string,
  quiet = false
): Promise<BuildManifest> {
  const run = (): Promise<BuildManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    // Load the custom json-schema extension if it exists
    const configSchemaPath = path.join(
      path.dirname(manifestPath),
      "/polywrap.build.ext.json"
    );
    let extSchema: JsonSchema | undefined = undefined;

    if (fs.existsSync(configSchemaPath)) {
      extSchema = JSON.parse(
        fs.readFileSync(configSchemaPath, "utf-8")
      ) as JsonSchema;

      // The extension schema must support additional properties
      extSchema.additionalProperties = true;
    }

    try {
      const result = deserializeBuildManifest(manifest, {
        extSchema: extSchema,
      });
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
    )) as BuildManifest;
  }
}
