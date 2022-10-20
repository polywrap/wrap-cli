import { Args_add, Add_Module } from "./wrap";
import { Args_add as ImportedArgs_add } from "./wrap/imported/Add_Module/serialization";

export function add(args: Args_add): i32 {
  let importedArgs: ImportedArgs_add = {
    a: args.a,
    b: args.b
  }
  return Add_Module.add(importedArgs).unwrap()
}
