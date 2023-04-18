import { Args_method, Mock_deployContract } from "./wrap";

export function method(args: Args_method): string {
  return args.arg;
}

export function deployContract(): string {
  return Mock_deployContract({}).unwrap();
}