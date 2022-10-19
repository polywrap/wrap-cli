import { validateClientConfig } from "../helpers";
import { intlMsg } from "../intl";
import { importTypescriptModule } from "../system";
import { getTestEnvClientConfig } from "../test-env";

import { PolywrapClientConfig } from "@polywrap/client-js";
import path from "path";

export async function parseClientConfigOption(
  clientConfig: string | undefined
): Promise<Partial<PolywrapClientConfig>> {
  let finalClientConfig: Partial<PolywrapClientConfig>;

  try {
    finalClientConfig = await getTestEnvClientConfig();
  } catch (e) {
    console.error(intlMsg.commands_test_error_noTestEnvFound());
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
      const configsModuleMissingExportMessage = intlMsg.commands_test_error_clientConfigInvalidFileExt(
        { module: configPath }
      );
      console.error(configsModuleMissingExportMessage);
      process.exit(1);
    }

    if (!configModule || !configModule.getClientConfig) {
      const configsModuleMissingExportMessage = intlMsg.commands_test_error_clientConfigModuleMissingExport(
        { module: configModule }
      );
      console.error(configsModuleMissingExportMessage);
      process.exit(1);
    }

    finalClientConfig = await configModule.getClientConfig(finalClientConfig);

    try {
      validateClientConfig(finalClientConfig);
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  }

  return finalClientConfig;
}
