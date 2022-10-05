import { validateClientConfig } from "../helpers";
import { intlMsg } from "../intl";
import { importTypescriptModule } from "../system";
import { getTestEnvCustomConfig } from "../test-env";

import {
  ClientConfig,
  executeMaybeAsyncFunction,
  Uri,
} from "@polywrap/core-js";
import {
  ClientConfigBuilder,
  CustomClientConfig,
} from "@polywrap/client-config-builder-js";
import path from "path";

export async function parseClientConfigOption(
  clientConfig: string | undefined
): Promise<Partial<ClientConfig<Uri>>> {
  const builder = new ClientConfigBuilder().addDefaults();
  let config: ClientConfig<Uri>;

  try {
    builder.add(getTestEnvCustomConfig());
  } catch (e) {
    console.error(intlMsg.commands_run_error_noTestEnvFound());
    process.exit(1);
  }

  if (clientConfig) {
    let configModule;

    const configPath = path.resolve(clientConfig);
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

    if (!configModule || !configModule.getCustomConfig) {
      const configsModuleMissingExportMessage = intlMsg.commands_run_error_clientConfigModuleMissingExport(
        { module: configModule }
      );
      console.error(configsModuleMissingExportMessage);
      process.exit(1);
    }

    const customConfig =  await configModule.getCustomConfig();

    try {
      validateClientConfig(customConfig);
      config = builder.add(customConfig).buildDefault();
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  } else {
    config = builder.buildDefault();
  }

  return config;
}
