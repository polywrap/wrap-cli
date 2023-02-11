import {
  Args_bytesMethod,
  ModuleBase
} from "./wrap";

export class Module extends ModuleBase {
  bytesMethod(args: Args_bytesMethod): ArrayBuffer {
    const argStr = String.UTF8.decode(args.arg.prop);
    const sanityStr = argStr + " Sanity!";
    const sanityBuffer = String.UTF8.encode(sanityStr);
    return sanityBuffer;
  }
}  
