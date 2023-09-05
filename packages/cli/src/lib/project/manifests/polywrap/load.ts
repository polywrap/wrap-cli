import {
  displayPath,
  intlMsg,
  loadEnvironmentVariables,
  Logger,
  logActivity,
  PolywrapBuildLanguage,
} from "../../../";

import {
  PolywrapManifest,
  BuildManifest,
  DeployManifest,
  deserializePolywrapManifest,
  deserializeBuildManifest,
  deserializeDeployManifest,
  InfraManifest,
  deserializeInfraManifest,
  PolywrapWorkflow,
  deserializePolywrapWorkflow,
  DocsManifest,
  deserializeDocsManifest,
} from "@polywrap/polywrap-manifest-types-js";
import { Schema as JsonSchema } from "jsonschema";
import path from "path";
import fs from "fs";

export const defaultPolywrapManifestFiles = ["polywrap.yaml", "polywrap.yml"];

export async function loadPolywrapManifest(
  manifestPath: string,
  logger: Logger
): Promise<PolywrapManifest> {
  const run = (): Promise<PolywrapManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializePolywrapManifest(manifest, { logger: logger });
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  manifestPath = displayPath(manifestPath);
  return await logActivity<PolywrapManifest>(
    logger,
    intlMsg.lib_helpers_manifest_loadText({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadError({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadWarning({ path: manifestPath }),
    async () => {
      return await run();
    }
  );
}

export const defaultBuildManifestFiles = [
  "polywrap.build.yaml",
  "polywrap.build.yml",
];

export async function loadBuildManifest(
  language: PolywrapBuildLanguage,
  manifestPath: string,
  logger: Logger
): Promise<BuildManifest> {
  const run = (): BuildManifest => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    let extSchema: JsonSchema | undefined = undefined;

    if (language.startsWith("wasm")) {
      const extSchemaPath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "defaults",
        "build-strategies",
        language,
        "manifest.ext.json"
      );

      extSchema = JSON.parse(
        fs.readFileSync(extSchemaPath, "utf-8")
      ) as JsonSchema;
    }

    return deserializeBuildManifest(manifest, {
      extSchema: extSchema,
      logger: logger,
    });
  };

  manifestPath = displayPath(manifestPath);
  return await logActivity<BuildManifest>(
    logger,
    intlMsg.lib_helpers_manifest_loadText({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadError({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadWarning({ path: manifestPath }),
    async () => {
      return run();
    }
  );
}

export const defaultDeployManifestFiles = [
  "polywrap.deploy.yaml",
  "polywrap.deploy.yml",
];

export const defaultDeployManifest: DeployManifest = {
  format: "0.4.0",
  jobs: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ipfs_deploy: {
      steps: [
        {
          name: "deploy to ipfs.wrappers.io",
          package: "ipfs",
          uri: "file/./build",
          config: {
            gatewayUri: "https://ipfs.wrappers.io",
          },
        },
      ],
    },
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __type: "DeployManifest",
};

export async function loadDeployManifest(
  manifestPath: string,
  logger: Logger
): Promise<DeployManifest> {
  const run = (): Promise<DeployManifest> => {
    let manifest: string;
    try {
      manifest = fs.readFileSync(manifestPath, "utf-8");
    } catch {
      // If the manifest wasn't found, and it was a default path,
      // assume we should fallback to a default manifest.
      if (
        defaultDeployManifestFiles
          .map((x) => displayPath(x))
          .includes(manifestPath)
      ) {
        return Promise.resolve(defaultDeployManifest);
      }

      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      let result = deserializeDeployManifest(manifest, { logger: logger });
      result = (loadEnvironmentVariables(
        (result as unknown) as Record<string, unknown>
      ) as unknown) as DeployManifest;
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  manifestPath = displayPath(manifestPath);
  return await logActivity<DeployManifest>(
    logger,
    intlMsg.lib_helpers_manifest_loadText({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadError({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadWarning({ path: manifestPath }),
    async () => {
      return await run();
    }
  );
}

export async function loadDeployManifestExt(
  manifestExtPath: string,
  logger: Logger
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

  manifestExtPath = displayPath(manifestExtPath);
  return await logActivity(
    logger,
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

export const defaultInfraManifestFiles = [
  "polywrap.infra.yaml",
  "polywrap.infra.yml",
];

export async function loadInfraManifest(
  manifestPath: string,
  logger: Logger
): Promise<InfraManifest> {
  const run = (): Promise<InfraManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      let result = deserializeInfraManifest(manifest, { logger: logger });
      result = (loadEnvironmentVariables(
        (result as unknown) as Record<string, unknown>
      ) as unknown) as InfraManifest;
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  manifestPath = displayPath(manifestPath);
  return await logActivity<InfraManifest>(
    logger,
    intlMsg.lib_helpers_manifest_loadText({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadError({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadWarning({ path: manifestPath }),
    async () => {
      return await run();
    }
  );
}

export const defaultWorkflowManifestFiles = [
  "polywrap.test.yaml",
  "polywrap.test.yml",
];

export async function loadWorkflowManifest(
  manifestPath: string,
  logger: Logger
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
      const result = deserializePolywrapWorkflow(manifest, { logger: logger });
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  manifestPath = displayPath(manifestPath);
  return await logActivity<PolywrapWorkflow>(
    logger,
    intlMsg.lib_helpers_manifest_loadText({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadError({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadWarning({ path: manifestPath }),
    async () => {
      return await run();
    }
  );
}

export const defaultDocsManifest = ["polywrap.docs.yaml", "polywrap.docs.yml"];

export async function loadDocsManifest(
  manifestPath: string,
  logger: Logger
): Promise<DocsManifest> {
  const run = (): Promise<DocsManifest> => {
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    if (!manifest) {
      const noLoadMessage = intlMsg.lib_helpers_manifest_unableToLoad({
        path: `${manifestPath}`,
      });
      throw Error(noLoadMessage);
    }

    try {
      const result = deserializeDocsManifest(manifest, { logger: logger });
      return Promise.resolve(result);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  manifestPath = displayPath(manifestPath);
  return await logActivity<DocsManifest>(
    logger,
    intlMsg.lib_helpers_manifest_loadText({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadError({ path: manifestPath }),
    intlMsg.lib_helpers_manifest_loadWarning({ path: manifestPath }),
    async () => {
      return await run();
    }
  );
}
