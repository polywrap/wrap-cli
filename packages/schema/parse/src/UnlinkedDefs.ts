import { Def, EnumDef, MapKeyTypeName, NamedDef, RefType, ScalarType } from "./definitions";

export interface UnlinkedAbiDefs {
  functions: UnlinkedFunctionDef[];
  objects: UnlinkedObjectDef[];
  enums: EnumDef[];
}

export type UnlinkedAnyDef = 
  | UnlinkedFunctionDef
  | UnlinkedObjectDef
  | EnumDef
  | UnlinkedPropertyDef
  | UnlinkedArgumentDef
  | UnlinkedResultDef;

export interface UnlinkedInlinedTypeDef extends Def, UnlinkedOptionalType { }

export interface UnlinkedNamedTypeDef extends NamedDef, UnlinkedInlinedTypeDef { }

export interface UnlinkedFunctionDef extends NamedDef {
  kind: "Function";
  args: UnlinkedArgumentDef[];
  result: UnlinkedResultDef;
}

export interface UnlinkedArgumentDef extends UnlinkedNamedTypeDef {
  kind: "Argument";
}

export interface UnlinkedResultDef extends UnlinkedInlinedTypeDef {
  kind: "Result";
}

export interface UnlinkedObjectDef extends NamedDef {
  kind: "Object";
  props: UnlinkedPropertyDef[];
}

export interface UnlinkedPropertyDef extends UnlinkedNamedTypeDef {
  kind: "Property";
}

export type UnlinkedAnyType =
  | ScalarType
  | UnlinkedArrayType
  | UnlinkedMapType
  | RefType
  | UnlinkedImportRefType;

export type UnlinkedTypeKind =
  | "Scalar"
  | "Array"
  | "Map"
  | "Ref"
  | "UnlinkedImportRef";

export interface UnlinkedType {
  kind: UnlinkedTypeKind;
}

export interface UnlinkedArrayType extends UnlinkedType {
  kind: "Array";
  item: UnlinkedOptionalType;
}

export interface UnlinkedMapType extends UnlinkedType {
  kind: "Map";
  key: ScalarType<MapKeyTypeName>;
  value: UnlinkedOptionalType;
}

export interface UnlinkedImportRefType extends UnlinkedType {
  kind: "UnlinkedImportRef";
  ref_name: string;
}

export interface UnlinkedOptionalType {
  required: boolean;
  type: UnlinkedAnyType;
}
