// eslint-disable-next-line import/no-extraneous-dependencies
import { useReducer, useMemo } from "react";

const stateReducer = <TState>() => (
  state: TState,
  newState: Partial<TState>
): TState => ({
  ...state,
  ...newState,
});

export const useStateReducer = <TState>(
  initialState: TState
): {
  state: TState;
  dispatch: React.Dispatch<Partial<TState>>;
} => {
  const [state, dispatch] = useReducer(stateReducer<TState>(), initialState);
  return useMemo<{ state: TState; dispatch: typeof dispatch }>(() => {
    return { state, dispatch };
  }, [state, dispatch]);
};
