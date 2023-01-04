import { intlMsg } from "../intl";
import { importTypescriptModule } from "../system";
import { getTestEnvClientConfig } from "../test-env";

import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import path from "path";
import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";

export async function parseClientConfigOption(
  clientConfig: string | undefined
): Promise<IClientConfigBuilder> {
  const builder = new ClientConfigBuilder().addDefaults();

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

    const bdlr = await configModule.configure(builder);
    if (!bdlr.config.packages["wrap://ens/mock.eth"]) {
      throw new Error("Mock plugin not found");
    }
    throw new Error("Mock plugin found");
    return bdlr;
  } else {
    return builder;
  }
}
