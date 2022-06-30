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
