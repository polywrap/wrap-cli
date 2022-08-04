import { createPolywrapClient, PolywrapClientConfig } from "../..";

export const getClient = async (config?: Partial<PolywrapClientConfig>) => {
  return createPolywrapClient({}, config);
};
