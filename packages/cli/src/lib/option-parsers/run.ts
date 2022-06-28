import { intlMsg } from "../intl";
import { importTypescriptModule } from "../system";
import { getTestEnvClientConfig } from "../test-env";
import { validateClientConfig } from "../helpers";

import path from "path";
import fs from "fs";
import { PolywrapClientConfig } from "@polywrap/client-js";
import { executeMaybeAsyncFunction } from "@polywrap/core-js";

export function parseWorkflowScriptPathOption(
  script: string,
  _: unknown
): string {
  const absPath = path.resolve(script);
  if (!fs.existsSync(absPath)) {
    throw new Error(
      intlMsg.commands_run_error_noWorkflowScriptFound({ path: absPath })
    );
  }
  return absPath;
}

export async function parseClientConfigOption(
  _clientConfig: string | undefined,
  _: unknown
): Promise<Partial<PolywrapClientConfig>> {
  let finalClientConfig: Partial<PolywrapClientConfig>;

  try {
    finalClientConfig = await getTestEnvClientConfig();
  } catch (e) {
    console.error(intlMsg.commands_run_error_noTestEnvFound());
    process.exit(1);
  }

  if (_clientConfig) {
    let configModule;

    const configPath = path.resolve(_clientConfig);
    if (configPath.endsWith(".js")) {
      configModule = await import(path.resolve(configPath));
    } else if (configPath.endsWith(".ts")) {
      configModule = await importTypescriptModule(path.resolve(configPath));
    } else {
      const configsModuleMissingExportMessage = intlMsg.commands_run_error_clientConfigInvalidFileExt(
        { module: configPath }
      );
      console.error(configsModuleMissingExportMessage);
      process.exit(1);
    }

    if (!configModule || !configModule.getClientConfig) {
      const configsModuleMissingExportMessage = intlMsg.commands_run_error_clientConfigModuleMissingExport(
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

export async function defaultClientConfigOption(): Promise<
  Partial<PolywrapClientConfig>
> {
  return await parseClientConfigOption(undefined, undefined);
}

export function parseWorkflowOutputFilePathOption(
  outputFile: string,
  _: unknown
): string {
  return path.resolve(outputFile);
}

export function parseValidateScriptOption(cueFile: string, _: unknown): string {
  const cueFilepath = path.resolve(cueFile);

  if (!fs.existsSync(cueFilepath)) {
    console.error(
      intlMsg.commands_run_error_validatorNotFound({
        path: cueFilepath,
      })
    );
    process.exit(1);
  }

  return cueFilepath;
}
