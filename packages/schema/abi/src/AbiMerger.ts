import { Abi, ImportedAbi } from "@polywrap/abi-types";

export interface IAbiMerger {
  merge(abis: Abi[]): Abi
}

export class AbiMerger implements IAbiMerger {
  merge(abis: Abi[]): Abi {
    return this._removeEmptyArrays({
      // TODO: handle different versions?
      version: "0.2",
      objects: abis.reduce((acc, abi) => [...acc, ...(abi.objects ?? [])], []),
      enums: abis.reduce((acc, abi) => [...acc, ...(abi.enums ?? [])], []),
      functions: abis.reduce((acc, abi) => [...acc, ...(abi.functions ?? [])], []),
      imports: abis.reduce((acc, abi) => [...acc, ...(abi.imports ?? [])], [])
    }) as Abi
  }

  private _removeEmptyArrays(abi: Abi | ImportedAbi): Abi | ImportedAbi {
    const processed = {
      objects: abi.objects?.length ? abi.objects : undefined,
      enums: abi.enums?.length ? abi.enums : undefined,
      functions: abi.functions?.length ? abi.functions : undefined,
      imports: abi.imports?.length ? abi.imports.map(this._removeEmptyArrays) as ImportedAbi[] : undefined
    }

    if ((abi as Abi).version) {
      return {
        version: (abi as Abi).version,
        ...processed
      }
    }

    return processed as ImportedAbi
  }
}