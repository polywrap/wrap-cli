import { AnyType, ArrayType, ImportRefType, MapType, RefType, ScalarType } from "@polywrap/abi-types";
import { isBaseType, isKeyword } from "./bindings/assemblyscript/types";

export class WasmRenderer {
  private escapeKeyword(typeName: string): string {
    return isKeyword(typeName) ? `_${typeName}`: typeName
  }

  private applyOptional(type: string, required: boolean, isEnum: boolean): string {
    if (!required) {
      if (
        type.indexOf("Array") === 0 ||
        type.indexOf("string") === 0 ||
        (!isEnum && !isBaseType(type))
      ) {
        return `${type} | null`;
      } else {
        return `Box<${type}> | null`;
      }
    } else {
      return type;
    }
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
    const escapedName = this.escapeKeyword(type.ref_name)
    return this.applyOptional(`Types.${escapedName}`, required, type.ref_kind === "Enum")
  }

  renderMap(type: MapType, required: boolean): string {
    const value = this.renderAnyType(type.value.type, type.value.required)
    const key = this.renderScalar(type.key, true)

    return this.applyOptional(`Map<${key}, ${value}>`, required, false)
  }

  renderArray(type: ArrayType, required: boolean): string {
    const item = this.renderAnyType(type.item.type, type.item.required)
    return this.applyOptional(`Array<${item}>`, required, false)
  }

  renderScalar(type: ScalarType, required: boolean): string {
    let scalar: string 
    
    switch (type.scalar) {
      case "Int":
        scalar = "i32";
        break;
      case "Int8":
        scalar = "i8";
        break;
      case "Int16":
        scalar = "i16";
        break;
      case "Int32":
        scalar = "i32";
        break;
      case "UInt":
        scalar = "u32";
        break;
      case "UInt32":
        scalar = "u32";
        break;
      case "UInt8":
        scalar = "u8";
        break;
      case "UInt16":
        scalar = "u16";
        break;
      case "String":
        scalar = "string";
        break;
      case "Boolean":
        scalar = "bool";
        break;
      case "Bytes":
        scalar = "ArrayBuffer";
        break;
      case "BigInt":
        scalar = "BigInt";
        break;
      case "BigNumber":
        scalar = "BigNumber";
        break;
      case "JSON":
        scalar = "JSON.Value";
        break;
    }

    return this.applyOptional(scalar, required, false)
  }
}