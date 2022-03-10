import { useWeb3ApiClient } from "./client";
import { useStateReducer } from "./state";

import { InvokeApiOptions, InvokeApiResult } from "@web3api/core-js";

export interface UseWeb3ApiInvokeState<
  TData = unknown
> extends InvokeApiResult<TData> {
  loading: boolean;
}

export const INITIAL_QUERY_STATE: UseWeb3ApiInvokeState = {
  data: undefined,
  error: undefined,
  loading: false,
};

export interface UseWeb3ApiInvokeProps extends InvokeApiOptions<string> {
  provider?: string;
}

/*
Note that the initial values passed into the useWeb3ApiInvoke hook will be
ignored when an ArrayBuffer is passed into execute(...).
*/
export interface UseWeb3ApiInvoke<
  TData = unknown
> extends UseWeb3ApiInvokeState<TData> {
  execute: (
    input?: Record<string, unknown> | ArrayBuffer
  ) => Promise<InvokeApiResult<TData>>;
}

export function useWeb3ApiInvoke<
  TData = unknown
>(props: UseWeb3ApiInvokeProps | InvokeApiOptions<string>): UseWeb3ApiInvoke<TData> {
  const provider = "provider" in props ? props.provider : undefined;
  const client = useWeb3ApiClient({ provider });

  // Initialize the UseWeb3ApiQueryState
  const { state, dispatch } = useStateReducer<UseWeb3ApiInvokeState<TData>>(
    INITIAL_QUERY_STATE as UseWeb3ApiInvokeState<TData>
  );

  const execute = async (input?: Record<string, unknown> | ArrayBuffer) => {
    dispatch({ loading: true });
    const { data, error } = await client.invoke<TData>({
      ...props,
      input: input instanceof ArrayBuffer ? input : {
        ...props.input,
        ...input,
      },
    });
    dispatch({ data, error, loading: false });
    return { data, error };
  };

  return {
    ...state,
    execute,
  };
}
