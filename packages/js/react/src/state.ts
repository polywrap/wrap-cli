import { useReducer, useMemo } from "react";

const stateReducer = <TState>() => (
  state: TState,
  newState: Partial<TState>
) => ({
  ...state,
  ...newState
});

export const createStateReducer = <TState>(initialState: TState) => {
  const [state, dispatch] = useReducer(stateReducer<TState>(), initialState);
  return useMemo<{ state: TState, dispatch: typeof dispatch }>(() => {
    return { state, dispatch };
  }, [state, dispatch]);
};
