import { Result } from "./Result";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ResultOk = <T>(data: T): Result<T, never> => {
  return { ok: true, value: data };
};
