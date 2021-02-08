import React, { useContext, useCallback } from "react";
import { UriRedirect, Web3ApiClient, Uri } from "@web3api/client-js";

import {
  Web3ApiContextInterface,
  INITIAL_STATE,
  web3ApiState,
  ActionTypes,
} from "./handler";
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

const web3ApiQuery = (client: Web3ApiClient, options?: any) => {
  const { state, dispatch } = web3ApiState();

  if (!options) {
    return INITIAL_STATE;
  }

  const execute = useCallback(async () => {
    const { data, errors } = await client.query(options);
    return { data, errors };
  }, [options]);

  dispatch({
    type: ActionTypes.UPDATE_EXECUTE,
    execute,
  });

  return state;
};

export function createWeb3ApiRoot(
  key: string
): (args: Web3ApiProviderArguments) => JSX.Element {
  if (PROVIDERS[key]) {
    throw new Error("A Web3Api root already exists with the name " + key);
  }

  PROVIDERS[key].context = React.createContext<Web3ApiContextInterface>(
    INITIAL_STATE
  );

  const { Provider } = PROVIDERS[key].context;

  return ({ redirects, children }) => {
    const client = (PROVIDERS[key].client = new Web3ApiClient({ redirects }));
    const data = web3ApiQuery(client);
    return <Provider value={data}>{children}</Provider>;
  };
}

const DEFAULT_PROVIDER = "main";

export const Web3ApiProvider = createWeb3ApiRoot(DEFAULT_PROVIDER);

export const getWeb3ApiContext = (
  key: string = DEFAULT_PROVIDER
): React.Context<Web3ApiContextInterface> => {
  if (!PROVIDERS[key]) {
    throw new Error("A Web3Api Provider does not exists with key " + key);
  }
  return PROVIDERS[key].context;
};

type QueryExecutionParams = {
  uri: Uri;
  query: string;
  variables?: any;
};

interface QueryArguments {
  key: string;
  options: QueryExecutionParams;
}

export const useWeb3ApiQuery = ({
  key = DEFAULT_PROVIDER,
  options,
}: QueryArguments): Web3ApiContextInterface => {
  const provider = getWeb3ApiContext(key);
  web3ApiQuery(PROVIDERS[key].client, options);
  return useContext(provider);
};
