import { Args_deployContract, Args_method, Mock_Module, IModule } from "./wrap";

export class Module extends IModule {
  method(args: Args_method): string {
    return args.arg;
  }

  deployContract(_: Args_deployContract): string {
    return Mock_Module.deployContract({}).unwrap();
  }
}
