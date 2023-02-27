import { Abi, AbiDefs, ImportedAbi } from "@polywrap/abi-types";

export interface IAbiSanitizer {
  sanitizeAbi(abi: Abi | ImportedAbi): Abi | ImportedAbi
  sanitizeDefs(abiDefs: AbiDefs): AbiDefs
}

export class AbiSanitizer implements IAbiSanitizer {
  sanitizeAbi(abi: Abi | ImportedAbi): Abi | ImportedAbi {
    const sanitizedAbi = this._removeEmptyArrays(abi)

    return sanitizedAbi
  }

  sanitizeDefs(abiDefs: AbiDefs): AbiDefs {
    const sanitizedDefs = this._removeEmptyArraysFromDefs(abiDefs)

    return sanitizedDefs
  }

  private _removeEmptyArraysFromDefs(abiDefs: AbiDefs): AbiDefs {
    if (!abiDefs.objects || abiDefs.objects.length === 0) {
      delete abiDefs.objects
    }

    if (!abiDefs.enums || abiDefs.enums.length === 0) {
      delete abiDefs.enums
    }

    if (!abiDefs.functions || abiDefs.functions.length === 0) {
      delete abiDefs.functions
    }

    return abiDefs
  }

  private _removeEmptyArrays(abi: Abi | ImportedAbi): Abi | ImportedAbi {
    this._removeEmptyArraysFromDefs(abi)

    if (!abi.imports || abi.imports.length === 0) {
      delete abi.imports
    } else {
      abi.imports.forEach((importedAbi) => {
        this._removeEmptyArrays(importedAbi)
      })
    }

    return abi
  }
}