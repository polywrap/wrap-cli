import {
  Web3ApiContextInterface,
  INITIAL_STATE,
  web3ApiState,
} from "./handler";

import React, { useEffect } from "react";
import { UriRedirect, Web3ApiClient, Uri } from "@web3api/client-js";

interface Web3ApiProviderArguments {
  redirects: UriRedirect[];
  children: React.ReactNode;
}

interface Web3ApiProvider {
  [key: string]: {
    context: React.Context<Web3ApiContextInterface>;
    client: Web3ApiClient;
  };
}

const PROVIDERS: Web3ApiProvider = {};

const web3ApiQuery = (
  client: Web3ApiClient,
  options?: QueryExecutionParams
) => {
  const { state, dispatch } = web3ApiState();

  if (!options) {
    return state;
  }

  const execute = async () => {
    dispatch({ type: "UPDATE", payload: { loading: true } });
    const { data, errors } = await client.query(options);
    dispatch({ type: "UPDATE", payload: { data, errors, loading: false } });
    return { data, errors };
  };

  useEffect(() => {
    console.log("indeed");
    dispatch({ type: "UPDATE", payload: { execute } });
  }, [dispatch]);

  return state;
};

export function createWeb3ApiRoot(
  key: string
): (args: Web3ApiProviderArguments) => JSX.Element {
  if (PROVIDERS[key]) {
    throw new Error("A Web3Api root already exists with the name " + key);
  }

  return ({ redirects, children }) => {
    const client = new Web3ApiClient({ redirects });
    const context = React.createContext<Web3ApiContextInterface>(INITIAL_STATE);
    PROVIDERS[key] = {
      context,
      client,
    };
    const { Provider } = context;
    const data = web3ApiQuery(client);
    return <Provider value={data}>{children}</Provider>;
  };
}

const DEFAULT_PROVIDER = "DEFAULT_PROVIDER";

export const Web3ApiProvider = createWeb3ApiRoot(DEFAULT_PROVIDER);

type QueryExecutionParams = {
  uri: Uri;
  query: string;
  variables?: any;
};

interface QueryArguments extends QueryExecutionParams {
  key?: string;
}

export const useWeb3ApiQuery = ({
  key = DEFAULT_PROVIDER,
  ...options
}: QueryArguments): Web3ApiContextInterface => {
  if (!PROVIDERS[key]) {
    // Maybe this error message is too long?
    throw new Error(
      `You are trying to use Web3ApiQuery hook with key: ${key} and it doesn't exists, you should pass the same key you used when created the Web3ApiRoot (Or none, if you just used Web3ApiProvider)`
    );
  }
  return web3ApiQuery(PROVIDERS[key].client, options);
};
