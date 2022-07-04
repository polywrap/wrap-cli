import { Args_deployContract, Args_method, Mock_Module } from "./wrap";

export function method(args: Args_method): string {
  return args.arg;
}

export function deployContract(_: Args_deployContract): string {
  return Mock_Module.deployContract({}).unwrap();
}