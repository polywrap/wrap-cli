import {
  Args_bytesMethod
} from "./wrap";

export function bytesMethod(args: Args_bytesMethod): ArrayBuffer {
  const argStr = String.UTF8.decode(args.arg.prop);
  const sanityStr = argStr + " Sanity!";
  const sanityBuffer = String.UTF8.encode(sanityStr);
  return sanityBuffer;
}
