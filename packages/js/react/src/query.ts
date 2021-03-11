import { QueryApiResult } from "@web3api/core-js";
import { Web3ApiClient } from "@web3api/client-js";

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

interface QueryArguments extends QueryExecutionParams {
  key?: string;
}

const web3ApiQuery = (
  client: Web3ApiClient,
  options?: QueryExecutionParams
) => {
  const { state, dispatch } = web3ApiState();

  if (!options) {
    return {
      ...state,
      execute: async () => ({ data: null }),
    };
  }

  const execute = async (variables?: Record<string, unknown>) => {
    dispatch({ type: "UPDATE", payload: { loading: true } });
    const { data, errors } = await client.query({
      ...options,
      variables: variables || options.variables,
    });
    dispatch({ type: "UPDATE", payload: { data, errors, loading: false } });
    return { data, errors };
  };

  return {
    ...state,
    execute,
  };
};
