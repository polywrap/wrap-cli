import { displayPath, withSpinner, intlMsg } from "../../";

import {
  Web3ApiManifest,
  BuildManifest,
  MetaManifest,
  deserializeWeb3ApiManifest,
  deserializeBuildManifest,
  deserializeMetaManifest,
} from "@web3api/core-js";
import { Schema as JsonSchema } from "jsonschema";
import path from "path";
import fs from "fs";

export const defaultWeb3ApiManifest = ["web3api.yaml", "web3api.yml"];

export async function loadWeb3ApiManifest(
  manifestPath: string,
  quiet = false
): Promise<Web3ApiManifest> {
  const run = (): Promise<Web3ApiManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializeWeb3ApiManifest(manifest);
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
      async (_spinner) => {
        return await run();
      }
    )) as Web3ApiManifest;
  }
}

export const defaultBuildManifest = ["web3api.build.yaml", "web3api.build.yml"];

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
      "/web3api.build.ext.json"
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
      async (_spinner) => {
        return await run();
      }
    )) as BuildManifest;
  }
}

export const defaultMetaManifest = ["web3api.meta.yaml", "web3api.meta.yml"];

export async function loadMetaManifest(
  manifestPath: string,
  quiet = false
): Promise<MetaManifest> {
  const run = (): Promise<MetaManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializeMetaManifest(manifest);
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
      async (_spinner) => {
        return await run();
      }
    )) as MetaManifest;
  }
}
