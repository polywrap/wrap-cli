import {
  SanityEnum,
  Args_method1,
  Args_method2,
  ModuleBase
} from "./wrap";

export class Module extends ModuleBase {
  method1(args: Args_method1): SanityEnum {
    return args.en;
  }

  method2(args: Args_method2): SanityEnum[] {
    return args.enumArray;
  }
}
