import { Abi } from "@polywrap/abi-types";

export interface IAbiMerger {
  merge(abis: Abi[]): Abi
}

export class AbiMerger implements IAbiMerger {
  merge(abis: Abi[]): Abi {
    return {
      // TODO: handle different versions?
      version: "0.2",
      objects: abis.reduce((acc, abi) => [...acc, ...(abi.objects ?? [])], []),
      enums: abis.reduce((acc, abi) => [...acc, ...(abi.enums ?? [])], []),
      functions: abis.reduce((acc, abi) => [...acc, ...(abi.functions ?? [])], []),
      imports: abis.reduce((acc, abi) => [...acc, ...(abi.imports ?? [])], [])
    }
  }
}