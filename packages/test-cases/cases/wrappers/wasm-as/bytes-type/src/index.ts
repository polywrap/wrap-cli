import {
  Args_bytesMethod,
  IModule
} from "./wrap";

export class Module extends IModule {
  bytesMethod(args: Args_bytesMethod): ArrayBuffer {
    const argStr = String.UTF8.decode(args.arg.prop);
    const sanityStr = argStr + " Sanity!";
    const sanityBuffer = String.UTF8.encode(sanityStr);
    return sanityBuffer;
  }
}  
