import { intlMsg } from "../intl";
import { importTypescriptModule } from "../system";
import { getTestEnvClientConfig } from "../test-env";

import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";
import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";

export async function parseClientConfigOption(
  clientConfig: string | undefined
): Promise<IClientConfigBuilder> {
  let builder = new ClientConfigBuilder().addDefaults();

  try {
    builder.add(getTestEnvClientConfig());
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

    if (!configModule || !configModule.configure) {
      const configsModuleMissingExportMessage = intlMsg.commands_test_error_clientConfigModuleMissingExport(
        { module: configModule }
      );
      console.error(configsModuleMissingExportMessage);
      process.exit(1);
    }

    builder = await configModule.configure(builder);

    try {
      return builder;
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  } else {
    return builder;
  }
}
