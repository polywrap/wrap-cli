import { Args_sampleMethod, SampleResult, ModuleBase } from "./wrap";

export class Module extends ModuleBase {
  sampleMethod(args: Args_sampleMethod): SampleResult {
    return {
      result: args.arg,
    };
  }
}
