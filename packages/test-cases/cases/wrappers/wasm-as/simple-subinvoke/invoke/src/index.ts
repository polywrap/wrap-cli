import { Args_add, Add_Module } from "./wrap";

export function add(args: Args_add): string {
  const result = Add_Module.add({a: args.a, b: args.b}).unwrap()
  return `${args.a.toString()} + ${args.b.toString()} = ${result.toString()}`
}
