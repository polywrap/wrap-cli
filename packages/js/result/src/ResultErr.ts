import { Result } from "./Result";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ResultErr = <E>(error?: E): Result<never, E> => {
  return { ok: false, error };
};
