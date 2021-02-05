import React, { useContext } from "react";
import { UriRedirect, Web3ApiClient, Uri } from "@web3api/client-js";

interface Web3ApiProviderArguments {
  redirects: UriRedirect[];
  children: React.ReactNode;
}

interface Web3ApiContextInterface {
  data: any;
  loading: boolean;
  error: any;
  client?: any;
}

interface Web3ApiProvider {
  [key: string]: {
    context: React.Context<Web3ApiContextInterface>;
    client: Web3ApiClient;
  };
}

const PROVIDERS: Web3ApiProvider = {};

const INITIAL_STATE = {
  data: null,
  loading: false,
  error: null,
};
const web3ApiQuery = (client: Web3ApiClient) => {
  return {
    data: null,
    loading: false,
    error: null,
  };
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
    PROVIDERS[key].client = new Web3ApiClient({ redirects });
    const data = web3ApiQuery(PROVIDERS[key].client);

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
  params: QueryExecutionParams;
}

export const useWeb3ApiQuery = ({
  key = DEFAULT_PROVIDER,
  params,
}: QueryArguments): Web3ApiContextInterface => {
  const provider = getWeb3ApiContext(key);
  // @TODO: figure best way to pass parameters of query
  // provider.triggerQuery(params);
  return useContext(provider);
};
