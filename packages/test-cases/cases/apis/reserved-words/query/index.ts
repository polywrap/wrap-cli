import {
  Input_method1,
  Result,
} from "./w3";

export function method1(input: Input_method1): Result {
  return new Result({
    const: "result: " + input.m_const.const,
  });
}