import { createPolywrapClient, PolywrapClientConfig } from "../..";
import { ClientConfigBuilder } from "@polywrap/client-config-js";

export const getClient = async (config?: Partial<PolywrapClientConfig>) => {
  return createPolywrapClient({}, config);
};

export const getDefaultClientConfig = () => {
  return new ClientConfigBuilder().addDefaults().build();
};