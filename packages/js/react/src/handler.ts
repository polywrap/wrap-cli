import { useReducer, useMemo } from "react";

export interface Web3ApiContextInterface {
  data?: Record<string, unknown>;
  loading: boolean;
  errors?: Error[];
  execute: any;
}

interface Load {
  loading: boolean;
}

interface Info extends Partial<Load> {
  data?: Record<string, unknown>;
  errors?: Error[];
}

function updateInfo(payload: Info) {
  return <const>{
    type: ActionTypes.UPDATE_INFO,
    payload,
  };
}
function updateLoading(payload: Load) {
  return <const>{
    type: ActionTypes.UPDATE_LOADING,
    payload,
  };
}

function updateExecute(payload: { execute: () => any }) {
  return <const>{
    type: ActionTypes.UPDATE_EXECUTE,
    payload,
  };
}

export type HandleAction = ReturnType<
  typeof updateInfo | typeof updateLoading | typeof updateExecute
>;

export enum ActionTypes {
  UPDATE_INFO = "UPDATE_INFO",
  UPDATE_LOADING = "UPDATE_LOADING",
  UPDATE_EXECUTE = "UPDATE_EXECUTE",
}

export const INITIAL_STATE = {
  data: undefined,
  loading: false,
  errors: undefined,
  execute: () => undefined,
};

const reducer = (state: Web3ApiContextInterface, action: HandleAction) => ({
  ...state,
  ...action.payload,
});

export const web3ApiState = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
};
