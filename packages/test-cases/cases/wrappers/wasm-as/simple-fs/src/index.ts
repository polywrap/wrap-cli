import { Args_readFile, FileSystem_Module } from "./wrap";

export function readFile(args: Args_readFile): ArrayBuffer {
  const result = FileSystem_Module.readFile({ path: args.path });

  return result.unwrap();
}
