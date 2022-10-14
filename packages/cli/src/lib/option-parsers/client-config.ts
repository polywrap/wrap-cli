import { validateClientConfig } from "../helpers";
import { intlMsg } from "../intl";
import { importTypescriptModule } from "../system";
import { getTestEnvClientConfig } from "../test-env";

import { Uri } from "@polywrap/core-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";
import { PolywrapCoreClientConfig } from "@polywrap/client-js";

export async function parseClientConfigOption(
  clientConfig: string | undefined
): Promise<PolywrapCoreClientConfig<Uri | string>> {
  const builder = new ClientConfigBuilder().addDefaults();

  try {
    builder.add(getTestEnvClientConfig());
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

    if (!configModule || !configModule.buildClientConfig) {
      const configsModuleMissingExportMessage = intlMsg.commands_run_error_clientConfigModuleMissingExport(
        { module: configModule }
      );
      console.error(configsModuleMissingExportMessage);
      process.exit(1);
    }

    const coreClientConfig = (await configModule.buildClientConfig(
      builder
    )) as PolywrapCoreClientConfig<Uri | string>;

    try {
      validateClientConfig(coreClientConfig);
      return coreClientConfig;
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  } else {
    return builder.buildDefault();
  }
}
