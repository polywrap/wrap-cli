import { useReducer, useMemo } from "react";

export interface Web3ApiContextInterface {
  data?: Record<string, unknown>;
  loading: boolean;
  errors?: Error[];
  execute: any;
}

interface Info {
  data?: Record<string, unknown>;
  errors?: Error[];
}

function updateInfo({ data, errors }: Info) {
  return <const>{
    type: ActionTypes.UPDATE_INFO,
    data,
    errors,
  };
}
function updateLoading(loading: boolean) {
  return <const>{
    type: ActionTypes.UPDATE_LOADING,
    loading,
  };
}

function updateExecute(execute: Function) {
  return <const>{
    type: ActionTypes.UPDATE_EXECUTE,
    execute,
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

const reducer = (state: Web3ApiContextInterface, action: HandleAction) => {
  switch (action.type) {
    case ActionTypes.UPDATE_INFO:
      state = {
        ...state,
        data: action.data,
        errors: action.errors,
      };
      return state;
    case ActionTypes.UPDATE_LOADING:
      state = {
        ...state,
        loading: action.loading,
      };
      return state;
    case ActionTypes.UPDATE_EXECUTE:
      state = {
        ...state,
        execute: action.execute,
      };
      return state;
    default:
      return state;
  }
};

export const web3ApiState = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
};
