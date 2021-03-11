import { Web3ApiQueryContext } from "./query";

import { UriRedirect, Web3ApiClient } from "@web3api/client-js";

interface Web3ApiProvider {
  [key: string]: {
    client?: Web3ApiClient;
  };
}

interface Web3ApiProviderArguments {
  redirects: UriRedirect[];
  children: React.ReactNode;
}

const PROVIDERS: Web3ApiProvider = {};

export function createWeb3ApiProvider(
  key: string
): (args: Web3ApiProviderArguments) => JSX.Element {
  if (!!PROVIDERS[key]) {
    throw new Error(`A Web3Api provider already exists with the key "${key}"`);
  }

  // Initialize the provider's contexts
  const context = React.createContext<Web3ApiContextInterface>(
    INITIAL_STATE
  );

  return ({ redirects, children }) => {
    const client = new Web3ApiClient({ redirects });
    PROVIDERS[key].client = client;
    const { Provider } = context;
    const data = web3ApiQuery(client);
    return <Provider value={data}>{children}</Provider>;
  };
}

export const PRIMARY_PROVIDER = "PRIMARY_PROVIDER";

export const Web3ApiProvider = createWeb3ApiProvider(PRIMARY_PROVIDER);
