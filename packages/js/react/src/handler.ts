import { useReducer, useMemo } from "react";

function update(payload: Partial<Web3ApiQueryContext>) {
  return <const>{
    type: "UPDATE",
    payload,
  };
}

export type HandleAction = ReturnType<typeof update>;

const reducer = (state: Web3ApiQueryContext, action: HandleAction) => ({
  ...state,
  ...action.payload,
});

export const web3ApiState = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
};
