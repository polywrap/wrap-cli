import { UnlinkedAbiDefs } from "./UnlinkedDefs";

export class AbiMerger {
  merge(abis: UnlinkedAbiDefs[]): UnlinkedAbiDefs {
    return {
      objects: abis.reduce((acc, abi) => [...acc, ...(abi.objects ?? [])], []),
      enums: abis.reduce((acc, abi) => [...acc, ...(abi.enums ?? [])], []),
      functions: abis.reduce((acc, abi) => [...acc, ...(abi.functions ?? [])], []),
    }
  }
}