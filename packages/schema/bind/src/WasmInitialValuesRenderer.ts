import { AnyType, RefType, ImportRefType, MapType, ArrayType, ScalarType } from "@polywrap/abi-types";
import { isKeyword } from "./bindings/assemblyscript/types";
import { WasmRenderer } from "./WasmRenderer";

export class WasmInitRenderer {

  constructor(protected wasmRenderer: WasmRenderer) {}

  private escapeKeyword(typeName: string): string {
    return isKeyword(typeName) ? `_${typeName}`: typeName
  }

  renderAnyType(type: AnyType, required: boolean): string {
    switch (type.kind) {
      case "Array": return this.renderArray(type, required)
      case "Map": return this.renderMap(type, required)
      case "Scalar": return this.renderScalar(type, required)
      case "Ref": return this.renderRef(type, required)
      case "ImportRef": return this.renderRef(type, required)
      case "UnlinkedImportRef": throw new Error(`Cannot render Unlinked Import refs. Attempted to render: ${type}`)
    }
  }

  renderRef(type: RefType | ImportRefType, required: boolean) {
    if (!required) {
      const renderedType = this.wasmRenderer.renderAnyType(type, required)

      if (renderedType.endsWith("| null")) {
        return "null"
      }
    }

    if (type.ref_kind === "Enum") {
      return "0"
    }

    const escapedName = this.escapeKeyword(type.ref_name)
    
    return `new Types.${escapedName}()`
  }

  renderMap(type: MapType, required: boolean): string {
    if (!required) {
      const renderedType = this.wasmRenderer.renderAnyType(type, required)

      if (renderedType.endsWith("| null")) {
        return "null"
      }
    }

    const value = this.wasmRenderer.renderAnyType(type.value.type, type.value.required)
    const key = this.wasmRenderer.renderScalar(type.key, true)

    return `new Map<${key}, ${value}>()`
  }

  renderArray(type: ArrayType, required: boolean): string {
    if (!required) {
      const renderedType = this.wasmRenderer.renderAnyType(type, required)

      if (renderedType.endsWith("| null")) {
        return "null"
      }
    }

    return "[]"
  }

  renderScalar(type: ScalarType, required: boolean): string {
    if (!required) {
      const renderedType = this.wasmRenderer.renderAnyType(type, required)

      if (renderedType.endsWith("| null")) {
        return "null"
      }
    }

    switch (type.scalar) {
      case "Int":
      case "Int8":
      case "Int16":
      case "Int32":
      case "UInt":
      case "UInt32":
      case "UInt8":
      case "UInt16":
        return "0"
      case "String": return `""`
      case "Boolean": return "false";
      case "Bytes": return `new ArrayBuffer(0)`;
      case "BigInt": return `BigInt.fromUInt16(0)`;
      case "BigNumber": return `new BigNumber(BigInt.fromUInt16(0), 0, 0)`;
      case "JSON": return `JSON.Value.Null()`;
    }
  }
}