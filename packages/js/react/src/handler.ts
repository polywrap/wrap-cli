import { useReducer, useMemo } from "react";

export interface Web3ApiContextInterface {
  data?: Record<string, unknown>;
  loading: boolean;
  errors?: Error[];
}

function update(payload: Partial<Web3ApiContextInterface>) {
  return <const>{
    type: "UPDATE",
    payload,
  };
}

export type HandleAction = ReturnType<typeof update>;

export const INITIAL_STATE = {
  data: undefined,
  loading: false,
  errors: undefined,
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
