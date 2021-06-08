import { useWeb3ApiClient } from "./client";
import { useStateReducer } from "./state";

import { QueryApiResult, QueryApiOptions } from "@web3api/core-js";

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

  const client = useWeb3ApiClient({ provider: props.provider });

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
