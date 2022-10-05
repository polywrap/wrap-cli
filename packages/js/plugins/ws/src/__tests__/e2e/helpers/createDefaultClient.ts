import {
  ClientConfigBuilder,
  CustomClientConfig,
} from "@polywrap/client-config-builder-js";
import { PolywrapClient } from "@polywrap/client-js";
import { Uri, Client } from "@polywrap/core-js";

export const createDefaultClient = (
  config: Partial<CustomClientConfig<Uri | string>> = {}
): Client => {
  return new PolywrapClient(
    new ClientConfigBuilder().addDefaults().add(config).buildDefault()
  );
};
