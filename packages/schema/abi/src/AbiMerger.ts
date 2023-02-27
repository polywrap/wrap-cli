import { Abi, AbiDefs, ImportedAbi } from "@polywrap/abi-types";

export interface IAbiMerger {
  merge(rootAbi: Abi, abisToMerge: (Abi | ImportedAbi)[]): Abi
  mergeDefs(defs: AbiDefs[]): AbiDefs
}

export class AbiMerger implements IAbiMerger {
  merge(rootAbi: Abi, abisToMerge: (Abi | ImportedAbi)[]): Abi {
    return {
      ...rootAbi,
      ...this.mergeDefs([rootAbi, ...abisToMerge]),
      imports: [rootAbi, ...abisToMerge].reduce((acc, abi) => [...acc, ...(abi.imports ?? [])], [])
    }
  }

  mergeDefs(defs: AbiDefs[]): AbiDefs {
    return {
      objects: defs.reduce((acc, def) => [...acc, ...(def.objects ?? [])], []),
      enums: defs.reduce((acc, def) => [...acc, ...(def.enums ?? [])], []),
      functions: defs.reduce((acc, def) => [...acc, ...(def.functions ?? [])], [])
    }
  }
}