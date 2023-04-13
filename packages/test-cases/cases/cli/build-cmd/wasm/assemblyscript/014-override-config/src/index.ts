import { Args_deployContract, Args_method, Mock_Module, ModuleBase } from "./wrap";

export class Module extends ModuleBase {
  method(args: Args_method): string {
    return args.arg;
  }

  deployContract(_: Args_deployContract): string {
    return Mock_Module.deployContract({}).unwrap();
  }
}
