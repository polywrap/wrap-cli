import { displayPath } from "./path";
import { withSpinner } from "./spinner";
import { intlMsg } from "../intl";

import {
  BuildManifest,
  Web3ApiManifest,
  MetaManifest,
  PluginManifest,
  deserializeWeb3ApiManifest,
  deserializeBuildManifest,
  deserializeMetaManifest,
  deserializePluginManifest,
} from "@web3api/core-js";
import { writeFileSync, normalizePath } from "@web3api/os-js";
import { Schema as JsonSchema } from "jsonschema";
import path from "path";
import fs from "fs";

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

export async function loadPluginManifest(
  manifestPath: string,
  quiet = false
): Promise<PluginManifest> {
  const run = (): Promise<PluginManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializePluginManifest(manifest);
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
    )) as PluginManifest;
  }
}

export async function outputManifest(
  manifest: Web3ApiManifest | BuildManifest | MetaManifest,
  manifestPath: string,
  quiet = false
): Promise<unknown> {
  const run = () => {
    const removeUndefinedProps = (
      obj: unknown
    ): Record<string, unknown> | Array<unknown> | undefined => {
      if (!obj || typeof obj !== "object") {
        return undefined;
      }

      if (Array.isArray(obj)) {
        return obj;
      }

      const input = obj as Record<string, unknown>;
      const newObj: Record<string, unknown> = {};

      Object.keys(input).forEach((key) => {
        if (input[key]) {
          if (typeof input[key] === "object") {
            const result = removeUndefinedProps(input[key]);

            if (result) {
              newObj[key] = result;
            }
          } else if (!key.startsWith("__")) {
            newObj[key] = input[key];
          }
        }
      });

      return newObj;
    };

    const sanitizedManifest = removeUndefinedProps(manifest);
    const str = JSON.stringify(sanitizedManifest);

    if (!str) {
      const noDumpMessage = intlMsg.lib_helpers_manifest_unableToDump({
        manifest: `${manifest}`,
      });
      throw Error(noDumpMessage);
    }

    writeFileSync(manifestPath, str, "utf-8");
  };

  if (quiet) {
    return run();
  } else {
    manifestPath = displayPath(manifestPath);
    return await withSpinner(
      intlMsg.lib_helpers_manifest_outputText({
        path: normalizePath(manifestPath),
      }),
      intlMsg.lib_helpers_manifest_outputError({
        path: normalizePath(manifestPath),
      }),
      intlMsg.lib_helpers_manifest_outputWarning({
        path: normalizePath(manifestPath),
      }),
      (_spinner): Promise<unknown> => {
        return Promise.resolve(run());
      }
    );
  }
}
