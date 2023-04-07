import { AnyType, ArrayType, ImportRefType, MapType, RefType, ScalarType } from "@polywrap/abi-types";

export interface Renderer {
  renderAnyType(type: AnyType, required: boolean): string
  renderRef(type: RefType | ImportRefType, required: boolean): string
  renderArray(type: ArrayType, required: boolean): string
  renderMap(type: MapType, required: boolean): string
  renderScalar(type: ScalarType, required: boolean): string
}