import {
  Args_greeting,
  Foo_Module
} from "./wrap";

export function greeting(args: Args_greeting): String {
  return Foo_Module.foo({ bar: args.message }).unwrap();
}