import {
  Web3ApiQueryContext,
  INITIAL_STATE,
  web3ApiState,
} from "./handler";

import React from "react";

interface UseWeb3ApiQueryResult extends Web3ApiQueryContext {
  execute: () => Promise<{ data: any; errors?: Error[] }>;
}

export const useWeb3ApiQuery = ({
  key = DEFAULT_PROVIDER,
  ...options
}: QueryArguments): UseWeb3ApiQueryResult => {
  if (!PROVIDERS[key]) {
    throw new Error(
      `You are trying to use Web3ApiQuery hook with key: ${key} and it doesn't exists, you should pass the same key you used when created the Web3ApiRoot (Or none, if you just used Web3ApiProvider)`
    );
  }

  const client = PROVIDERS[key].client;
  if (!client) {
    return { ...INITIAL_STATE, execute: async () => ({ data: null }) };
  }

  return web3ApiQuery(client, options);
};
