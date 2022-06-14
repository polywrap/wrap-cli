import {
  Input_bytesMethod
} from "./w3";

export function bytesMethod(input: Input_bytesMethod): ArrayBuffer {
  const argStr = String.UTF8.decode(input.arg.prop);
  const sanityStr = argStr + " Sanity!";
  const sanityBuffer = String.UTF8.encode(sanityStr);
  return sanityBuffer;
}
