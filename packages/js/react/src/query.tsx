import { usePolywrapClient } from "./client";
import { useStateReducer } from "./state";

import { QueryResult, QueryOptions } from "@polywrap/core-js";

export interface UsePolywrapQueryState<
  TData extends Record<string, unknown> = Record<string, unknown>
  > extends QueryResult<TData> {
  loading: boolean;
}

export const INITIAL_QUERY_STATE: UsePolywrapQueryState = {
  data: undefined,
  errors: undefined,
  loading: false,
};

export interface UsePolywrapQueryProps<
  TVariables extends Record<string, unknown> = Record<string, unknown>
  > extends QueryOptions<TVariables, string> {
  provider?: string;
}

export interface UsePolywrapQuery<
  TData extends Record<string, unknown> = Record<string, unknown>
  > extends UsePolywrapQueryState<TData> {
  execute: (
    variables?: Record<string, unknown>
  ) => Promise<QueryResult<TData>>;
}

export function usePolywrapQuery<
  TData extends Record<string, unknown> = Record<string, unknown>
  >(props: UsePolywrapQueryProps): UsePolywrapQuery<TData> {
  const client = usePolywrapClient({ provider: props.provider });

  // Initialize the UsePolywrapQueryState
  const { state, dispatch } = useStateReducer<UsePolywrapQueryState<TData>>(
    INITIAL_QUERY_STATE as UsePolywrapQueryState<TData>
  );

  const execute = async (variables?: Record<string, unknown>) => {
    dispatch({ loading: true });
    const { data, errors } = await client.query<TData>({
      ...props,
      variables: {
        ...props.variables,
        ...variables,
      },
    });
    dispatch({ data, errors, loading: false });
    return { data, errors };
  };

  return {
    ...state,
    execute,
  };
}
