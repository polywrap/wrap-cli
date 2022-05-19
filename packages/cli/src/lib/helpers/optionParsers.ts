import { intlMsg } from "../intl";
import {
  defaultAppManifest,
  defaultWeb3ApiManifest,
  defaultPluginManifest,
} from "../manifest";
import { importTypescriptModule, resolvePathIfExists } from "../system";
import { getTestEnvClientConfig } from "../test-env";
import { validateClientConfig } from "./validate-client-config";

import path from "path";
import fs from "fs";
import { Web3ApiClientConfig } from "@web3api/client-js";
import { executeMaybeAsyncFunction } from "@web3api/core-js";

const defaultBuildDir = "./build";
const defaultPluginPublishDir = "./build";
const defaultAppCodegenDir = "./src/w3";
const defaultPluginCodegenDir = "./src/w3";
const defaultCodegenDir = "./w3";

export function parseWasmManifestFileOption(
  manifestFile: string | undefined,
  _: unknown
): string {
  const manifestPaths = manifestFile
    ? [manifestFile as string]
    : defaultWeb3ApiManifest;

  manifestFile = resolvePathIfExists(manifestPaths);

  if (!manifestFile) {
    console.error(
      intlMsg.commands_build_error_manifestNotFound({
        paths: manifestPaths.join(", "),
      })
    );
    process.exit(1);
  }

  return manifestFile;
}

export function defaultWasmManifestFileOption(): string {
  return parseWasmManifestFileOption(undefined, undefined);
}

export function parseAppManifestFileOption(
  manifestFile: string | undefined,
  _: unknown
): string {
  const manifestPaths = manifestFile
    ? [manifestFile as string]
    : defaultAppManifest;

  manifestFile = resolvePathIfExists(manifestPaths);

  if (!manifestFile) {
    console.error(
      intlMsg.commands_build_error_manifestNotFound({
        paths: manifestPaths.join(", "),
      })
    );
    process.exit(1);
  }

  return manifestFile;
}

export function defaultAppManifestFileOption(): string {
  return parseAppManifestFileOption(undefined, undefined);
}

export function parsePluginManifestFileOption(
  manifestFile: string | undefined,
  _: unknown
): string {
  const manifestPaths = manifestFile
    ? [manifestFile as string]
    : defaultPluginManifest;
  manifestFile = resolvePathIfExists(manifestPaths);

  if (!manifestFile) {
    console.error(
      intlMsg.commands_build_error_manifestNotFound({
        paths: manifestPaths.join(", "),
      })
    );
    process.exit(1);
  }

  return manifestFile;
}

export function defaultPluginManifestFileOption(): string {
  return parsePluginManifestFileOption(undefined, undefined);
}

export function parseBuildOutputDirOption(
  outputDir: string | undefined,
  _: unknown
): string {
  return outputDir ? path.resolve(outputDir) : path.resolve(defaultBuildDir);
}

export function defaultBuildOutputDirOption(): string {
  return parseBuildOutputDirOption(undefined, undefined);
}

export function parseAppCodegenDirOption(
  codegenDir: string | undefined,
  _: unknown
): string {
  return codegenDir
    ? path.resolve(codegenDir)
    : path.resolve(defaultAppCodegenDir);
}

export function defaultAppCodegenDirOption(): string {
  return parseAppCodegenDirOption(undefined, undefined);
}

export function parsePluginCodegenDirOption(
  codegenDir: string | undefined,
  _: unknown
): string {
  return codegenDir
    ? path.resolve(codegenDir)
    : path.resolve(defaultPluginCodegenDir);
}

export function parseCodegenDirOption(
  codegenDir: string | undefined,
  _: unknown
): string {
  return codegenDir
    ? path.resolve(codegenDir)
    : path.resolve(defaultCodegenDir);
}

export function parseCodegenScriptOption(
  script: string | undefined,
  _: unknown
): string | undefined {
  return script ? path.resolve(script) : undefined;
}

export function parsePluginPublishDirOption(
  publishDir: string | undefined,
  _: unknown
): string | undefined {
  return publishDir
    ? path.resolve(publishDir)
    : path.resolve(defaultPluginPublishDir);
}

export function parseRecipeScriptPathOption(
  script: string,
  _: unknown
): string {
  const absPath = path.resolve(script);
  if (!fs.existsSync(absPath)) {
    throw new Error("Recipe script not found");
  }
  return absPath;
}

export async function parseClientConfigOption(
  _clientConfig: string,
  _: unknown
): Promise<Partial<Web3ApiClientConfig>> {
  const configPath = path.resolve(_clientConfig);

  let finalClientConfig: Partial<Web3ApiClientConfig>;

  try {
    finalClientConfig = await getTestEnvClientConfig();
  } catch (e) {
    console.error(intlMsg.commands_query_error_noTestEnvFound());
    process.exit(1);
  }

  if (configPath) {
    let configModule;
    if (configPath.endsWith(".js")) {
      configModule = await import(path.resolve(configPath));
    } else if (configPath.endsWith(".ts")) {
      configModule = await importTypescriptModule(path.resolve(configPath));
    } else {
      const configsModuleMissingExportMessage = intlMsg.commands_query_error_clientConfigInvalidFileExt(
        { module: configPath }
      );
      console.error(configsModuleMissingExportMessage);
      process.exit(1);
    }

    if (!configModule || !configModule.getClientConfig) {
      const configsModuleMissingExportMessage = intlMsg.commands_query_error_clientConfigModuleMissingExport(
        { module: configModule }
      );
      console.error(configsModuleMissingExportMessage);
      process.exit(1);
    }

    finalClientConfig = await executeMaybeAsyncFunction(
      configModule.getClientConfig,
      finalClientConfig
    );

    try {
      validateClientConfig(finalClientConfig);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  }

  return finalClientConfig;
}

export function parseRecipeOutputFilePathOption(
  outputFile: string,
  _: unknown
): string {
  return path.resolve(outputFile);
}
