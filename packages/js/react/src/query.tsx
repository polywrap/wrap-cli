import { useWeb3ApiClient } from "./client";
import { useStateReducer } from "./state";

import { QueryApiResult, QueryApiOptions, InvokeApiOptions } from "@web3api/core-js";

export interface UseWeb3ApiQueryState<
  TData extends Record<string, unknown> = Record<string, unknown>
> extends QueryApiResult<TData> {
  loading: boolean;
}

export const INITIAL_QUERY_STATE: UseWeb3ApiQueryState = {
  data: undefined,
  errors: undefined,
  loading: false,
};

export interface UseWeb3ApiQueryProps<
  TVariables extends Record<string, unknown> = Record<string, unknown>
> extends QueryApiOptions<TVariables, string> {
  provider?: string;
}

export interface UseWeb3ApiInvokeProps extends InvokeApiOptions<string> {
  provider?: string;
}

export interface UseWeb3ApiQuery<
  TData extends Record<string, unknown> = Record<string, unknown>
> extends UseWeb3ApiQueryState<TData> {
  execute: (
    variables?: Record<string, unknown>
  ) => Promise<QueryApiResult<TData>>;
}

export function useWeb3ApiQuery<
  TData extends Record<string, unknown> = Record<string, unknown>
>(props: UseWeb3ApiQueryProps | UseWeb3ApiInvokeProps): UseWeb3ApiQuery<TData> {
  const queryProps: UseWeb3ApiQueryProps = isUseWeb3ApiInvokeProps(props)
    ? toQueryProps(props)
    : props;

  const client = useWeb3ApiClient({ provider: queryProps.provider });

  // Initialize the UseWeb3ApiQueryState
  const { state, dispatch } = useStateReducer<UseWeb3ApiQueryState<TData>>(
    INITIAL_QUERY_STATE as UseWeb3ApiQueryState<TData>
  );

  const execute = async (variables?: Record<string, unknown>) => {
    dispatch({ loading: true });
    const { data, errors } = await client.query<TData>({
      ...queryProps,
      variables: {
        ...queryProps.variables,
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

function isUseWeb3ApiInvokeProps(props: UseWeb3ApiQueryProps | UseWeb3ApiInvokeProps): props is UseWeb3ApiInvokeProps {
  return "module" in props && "method" in props;
}

function toQueryProps(props: UseWeb3ApiInvokeProps): UseWeb3ApiQueryProps {
  if (props.input instanceof ArrayBuffer) {
    throw Error("The useWeb3ApiQuery hook does not support the ArrayBuffer type for the input property of UseWeb3ApiInvokeProps");
  }

  // create query string
  let query: string;
  if (props.input) {
    const args: string[] = Object.keys(props.input);
    let argStr: string = `${args[0]}: $${args[0]}`;
    for (let i = 1; i < args.length; i++) {
      argStr += `\n    ${args[i]}: $${args[i]}`
    }
    query = `${props.module} {
  ${props.method}(
    ${argStr}
  )
}`;
  } else {
    query = `${props.module} {
  ${props.method}
}`;
  }
  return {
    uri: props.uri,
    query,
    variables: props.input,
    config: props.config,
    contextId: props.contextId,
  }
}
