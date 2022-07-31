import {
  Args_method1,
  Result,
} from "./wrap";

export function method1(args: Args_method1): Result {
  return {
    m_const: "result: " + args.m_const.m_const,
  };
}
