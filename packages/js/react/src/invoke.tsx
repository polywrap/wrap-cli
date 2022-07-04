import { usePolywrapClient } from "./client";
import { useStateReducer } from "./state";

import {
  InvokeOptions,
  InvokeResult,
  isBuffer
} from "@polywrap/core-js";

export interface UsePolywrapInvokeState<
  TData = unknown
> extends InvokeResult<TData> {
  loading: boolean;
}

export const INITIAL_QUERY_STATE: UsePolywrapInvokeState = {
  data: undefined,
  error: undefined,
  loading: false,
};

export interface UsePolywrapInvokeProps extends InvokeOptions<string> {
  provider?: string;
}

/*
Note that the initial values passed into the usePolywrapInvoke hook will be
ignored when an Uint8Array is passed into execute(...).
*/
export interface UsePolywrapInvoke<
  TData = unknown
> extends UsePolywrapInvokeState<TData> {
  execute: (
    args?: Record<string, unknown> | Uint8Array
  ) => Promise<InvokeResult<TData>>;
}

export function usePolywrapInvoke<
  TData = unknown
>(props: UsePolywrapInvokeProps | InvokeOptions<string>): UsePolywrapInvoke<TData> {
  const provider = "provider" in props ? props.provider : undefined;
  const client = usePolywrapClient({ provider });

  // Initialize the UsePolywrapQueryState
  const { state, dispatch } = useStateReducer<UsePolywrapInvokeState<TData>>(
    INITIAL_QUERY_STATE as UsePolywrapInvokeState<TData>
  );

  const execute = async (args?: Record<string, unknown> | Uint8Array) => {
    dispatch({ loading: true });
    const { data, error } = await client.invoke<TData>({
      ...props,
      args: isBuffer(args) ? args : {
        ...props.args,
        ...args,
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
