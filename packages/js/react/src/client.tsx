import { PROVIDERS, PRIMARY_PROVIDER } from "./provider";

// eslint-disable-next-line import/no-extraneous-dependencies
import React from "react";
import { PolywrapClient } from "@polywrap/client-js";

export interface UsePolywrapClientProps {
  provider?: string;
}

export function usePolywrapClient(props?: UsePolywrapClientProps): PolywrapClient {
  const provider = props?.provider ?? PRIMARY_PROVIDER;

  if (!PROVIDERS[provider]) {
    throw new Error(
      `You are trying to use usePolywrapClient with provider "${provider}" and it doesn't exists. To create a new provider, use createPolywrapProvider`
    );
  }

  // Get the PolywrapClient from the provider in our DOM hierarchy
  const client = React.useContext(
    PROVIDERS[provider].ClientContext
  );

  if (!client || Object.keys(client).length === 0) {
    throw new Error(
      `The requested PolywrapProvider \"${provider}\" was not found within the DOM hierarchy. We could not get the PolywrapClient through the provider context.`
    )
  }

  return client;
}