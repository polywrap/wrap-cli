import { useReducer } from "react";

export interface Web3ApiContextInterface {
  data: any;
  loading: boolean;
  errors: any;
  execute: Function;
}

function updateData(data: any) {
  return <const>{
    type: ActionTypes.UPDATE_DATA,
    data,
  };
}
function updateLoading(loading: boolean) {
  return <const>{
    type: ActionTypes.UPDATE_LOADING,
    loading,
  };
}
function updateErrors(errors: any) {
  return <const>{
    type: ActionTypes.UPDATE_ERRORS,
    errors,
  };
}
function updateExecute(execute: any) {
  return <const>{
    type: ActionTypes.UPDATE_EXECUTE,
    execute,
  };
}

export type HandleAction = ReturnType<
  | typeof updateData
  | typeof updateLoading
  | typeof updateErrors
  | typeof updateExecute
>;

export enum ActionTypes {
  UPDATE_DATA = "UPDATE_DATA",
  UPDATE_ERRORS = "UPDATE_ERRORS",
  UPDATE_LOADING = "UPDATE_LOADING",
  UPDATE_EXECUTE = "UPDATE_EXECUTE",
}

export const INITIAL_STATE = {
  data: null,
  loading: false,
  errors: null,
  execute: () => undefined,
};

const reducer = (state: Web3ApiContextInterface, action: HandleAction) => {
  switch (action.type) {
    case ActionTypes.UPDATE_DATA:
      state = {
        ...state,
        data: action.data,
      };
      return state;
    case ActionTypes.UPDATE_ERRORS:
      state = {
        ...state,
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
  return { state, dispatch };
};
