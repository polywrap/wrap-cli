import { PolywrapClientConfig } from "./PolywrapClientConfig";

import { Uri } from "@polywrap/core-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PolywrapCoreClientConfig } from "@polywrap/core-client-js";

export const buildPolywrapCoreClientConfig = (
  config?: PolywrapClientConfig
): PolywrapCoreClientConfig<Uri> => {
  const builder = new ClientConfigBuilder(config?.wrapperCache);

  builder.addDefaults();

  if (config) {
    builder.add(config);
  }

  const sanitizedConfig = builder.buildCoreConfig();

  return {
    ...sanitizedConfig,
    tracerConfig: {
      consoleEnabled: !!config?.tracerConfig?.consoleEnabled,
      consoleDetailed: config?.tracerConfig?.consoleDetailed,
      httpEnabled: !!config?.tracerConfig?.httpEnabled,
      httpUrl: config?.tracerConfig?.httpUrl,
      tracingLevel: config?.tracerConfig?.tracingLevel,
    },
  };
};
