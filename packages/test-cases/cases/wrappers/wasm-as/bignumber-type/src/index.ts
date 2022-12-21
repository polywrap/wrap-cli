import {
  Args_method,
  IModule,
} from "./wrap";
import { BigNumber } from "@polywrap/wasm-as";

export class Module extends IModule {
  method(args: Args_method): BigNumber {
    let result = args.arg1.mul(args.obj.prop1);
  
    if (args.arg2) {
      result = result.mul(args.arg2 as BigNumber);
    }
    if (args.obj.prop2) {
      result = result.mul(args.obj.prop2 as BigNumber);
    }
  
    return result;
  }
}
