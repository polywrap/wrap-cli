import {
  Args_foo
} from "./wrap";

export function foo(args: Args_foo): String {
  return args.bar.toString()
}