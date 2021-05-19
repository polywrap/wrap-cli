import { PROVIDERS, PRIMARY_PROVIDER } from "./provider";

import { Web3ApiClient } from "@web3api/client-js";
import React from "react";

export interface UseWeb3ApiClientProps {
  provider?: string;
}

export function useWeb3ApiClient(props: UseWeb3ApiClientProps): Web3ApiClient {
  if (!props.provider) {
    props.provider = PRIMARY_PROVIDER;
  }

  if (!PROVIDERS[props.provider]) {
    throw new Error(
      `You are trying to use useWeb3ApiQuery with provider "${props.provider}" and it doesn't exists. To create a new provider, use createWeb3ApiProvider`
    );
  }

  // Get the Web3ApiClient from the provider in our DOM hierarchy
  const client = React.useContext(
    PROVIDERS[props.provider].ClientContext
  );

  if (!client || Object.keys(client).length === 0) {
    throw new Error(
      `The requested Web3APIProvider \"${props.provider}\" was not found within the DOM hierarchy. We could not get the Web3ApiClient through the provider context.`
    )
  }

  return client;
}
