import {
  Input_method1,
  Result,
} from "./w3";

export function method1(input: Input_method1): Result {
  return {
    m_const: "result: " + input.m_const.m_const,
  };
}
