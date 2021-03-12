import { UriRedirect, Web3ApiClient } from "@web3api/client-js";
import React from "react";

type ClientContext = React.Context<Web3ApiClient>

interface Web3ApiProviderState {
  client?: Web3ApiClient;
  ClientContext: ClientContext;
}

interface Web3ApiProviderMap {
  [name: string]: Web3ApiProviderState;
}

export const PROVIDERS: Web3ApiProviderMap = {};

interface Web3ApiProviderProps {
  redirects: UriRedirect[];
  children: React.ReactNode;
}

export type Web3ApiProviderFC = React.FC<Web3ApiProviderProps>;

export function createWeb3ApiProvider(
  name: string
): Web3ApiProviderFC {

  // Make sure the provider isn't already set
  if (!!PROVIDERS[name]) {
    throw new Error(`A Web3Api provider already exists with the name "${name}"`);
  }

  // Reserve the provider slot
  PROVIDERS[name] = {
    ClientContext: React.createContext({} as Web3ApiClient)
  };

  return ({ redirects, children }) => {
    // Initialize the provider's state
    const state = PROVIDERS[name];
    state.client = new Web3ApiClient({ redirects });
    const ClientProvider = state.ClientContext.Provider;

    return (
      <ClientProvider value={state.client as Web3ApiClient}>
        {children}
      </ClientProvider>
    );
  };
}

export const PRIMARY_PROVIDER = "PRIMARY_PROVIDER";

export const Web3ApiProvider = createWeb3ApiProvider(PRIMARY_PROVIDER);
