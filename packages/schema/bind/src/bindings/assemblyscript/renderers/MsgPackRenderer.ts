import { AnyType, ArrayType, ImportRefType, MapType, RefType, ScalarType } from "@polywrap/abi-types";

export class MsgPackRenderer {
  private applyOptional(type: string, required: boolean): string {
    return required ? type : `Optional${type}`
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
    return this.applyOptional(type.ref_name, required)
  }

  renderMap(_: MapType, required: boolean): string {
    return this.applyOptional(`ExtGenericMap`, required)
  }

  renderArray(_: ArrayType, required: boolean): string {
    return this.applyOptional(`Array`, required)
  }

  renderScalar(type: ScalarType, required: boolean): string {
    switch (type.scalar) {
      case "Int": return this.applyOptional("Int32", required)
      case "UInt":return this.applyOptional("UInt32", required)
      case "Boolean": return this.applyOptional("Bool", required)
      default: return this.applyOptional(type.scalar, required)
    }
  }
}