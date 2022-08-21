import {
  Args_method1,
  Args__const,
  _const,
  Result,
} from "./wrap";

export function method1(args: Args_method1): Result {
  return {
    _const: "result: " + args._const._const,
  };
}

export function _const(args: Args__const): Result {
  const arg: _const = args._const;
  return {
    _const: "result: " + arg._const,
  };
}
