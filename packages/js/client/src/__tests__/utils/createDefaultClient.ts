import { ClientConfigBuilder, CustomClientConfig } from "@polywrap/client-config-builder-js";
import { Uri, Client } from "@polywrap/core-js";
import { PolywrapClient } from "../../PolywrapClient";

export const createDefaultClient = (
  config: Partial<CustomClientConfig<Uri | string>> = {}
): Client => {
  return new PolywrapClient(
    new ClientConfigBuilder().addDefaults().add(config).buildDefault()
  );
};
