import { displayPath, withSpinner, intlMsg } from "../../";

import {
  CodegenManifest,
  deserializeCodegenManifest,
} from "@polywrap/polywrap-manifest-types-js";
import { Schema as JsonSchema } from "jsonschema";
import path from "path";
import fs from "fs";

export const defaultCodegenManifest = [
  "polywrap.codegen.yaml",
  "polywrap.codegen.yml",
];

export async function loadCodegenManifest(
  manifestPath: string,
  configSchemaDir?: string,
  quiet = false
): Promise<CodegenManifest> {
  const run = (): Promise<CodegenManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    // Load the json-schema extension if it exists
    let extSchema: JsonSchema | undefined = undefined;

    if (configSchemaDir) {
      const defaultExtensionPath = path.join(
        configSchemaDir,
        "/polywrap.codegen.ext.json"
      );
      if (fs.existsSync(defaultExtensionPath)) {
        extSchema = JSON.parse(
          fs.readFileSync(defaultExtensionPath, "utf-8")
        ) as JsonSchema;

        // The extension schema must support additional properties
        extSchema.additionalProperties = true;
      }
    }

    try {
      const result = deserializeCodegenManifest(manifest, {
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
    )) as CodegenManifest;
  }
}
