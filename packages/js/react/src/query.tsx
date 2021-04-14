import { PROVIDERS, PRIMARY_PROVIDER } from "./provider";
import { useStateReducer } from "./state";

import { QueryApiResult, QueryApiOptions } from "@web3api/core-js";
import React from "react";

export interface UseWeb3ApiQueryState<
  TData extends Record<string, unknown> = Record<string, unknown>
> extends QueryApiResult<TData> {
  loading: boolean;
}

export const INITIAL_QUERY_STATE: UseWeb3ApiQueryState = {
  data: undefined,
  errors: undefined,
  loading: false
};

export interface UseWeb3ApiQueryProps<
  TVariables extends Record<string, unknown> = Record<string, unknown>
> extends QueryApiOptions<TVariables, string> {
  provider?: string;
}

export interface UseWeb3ApiQuery<
  TData extends Record<string, unknown> = Record<string, unknown>
> extends UseWeb3ApiQueryState<TData> {
  execute: () => Promise<QueryApiResult<TData>>;
}

export function useWeb3ApiQuery<
  TData extends Record<string, unknown> = Record<string, unknown>
>(
  props: UseWeb3ApiQueryProps
): UseWeb3ApiQuery<TData> {

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

  // Initialize the UseWeb3ApiQueryState
  const { state, dispatch } = useStateReducer<UseWeb3ApiQueryState<TData>>(
    INITIAL_QUERY_STATE as UseWeb3ApiQueryState<TData>
  );

  const execute = async (variables?: Record<string, unknown>) => {
    dispatch({ loading: true });
    const { data, errors } = await client.query<TData>({
      ...props,
      variables: {
        ...props.variables,
        ...variables
      }
    });
    dispatch({ data, errors, loading: false });
    return { data, errors };
  };

  return {
    ...state,
    execute,
  };
};
