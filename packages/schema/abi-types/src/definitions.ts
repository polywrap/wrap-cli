/// ABIs

export interface AbiDefs {
  functions?: FunctionDef[];
  objects?: ObjectDef[];
  enums?: EnumDef[];
}

export interface Abi extends AbiDefs {
  version: "0.2";
  imports?: ImportedAbi[];
}

export type ImportAbiType =
  | "wasm"
  | "interface";

export interface ImportedAbi extends AbiDefs {
  id: string;
  uri: string;
  type: ImportAbiType;
  namespace: string;
  imports?: ImportedAbi[];
}

/// Definitions (user-defined)

export type AnyDef = FunctionDef | ObjectDef | EnumDef | PropertyDef | ArgumentDef | ResultDef;

export type UniqueDefKind =
  | "Function"
  | "Object"
  | "Enum"

export type DefKind =
  | UniqueDefKind
  | "Argument"
  | "Result"
  | "Property";

export interface Def {
  kind: DefKind;
}

export interface NamedDef extends Def {
  name: string;
}

export interface InlinedTypeDef extends Def, OptionalType { }

export interface NamedTypeDef extends NamedDef, InlinedTypeDef { }

export interface FunctionDef extends NamedDef {
  kind: "Function";
  args: ArgumentDef[];
  result: ResultDef;
}

export interface ArgumentDef extends NamedTypeDef {
  kind: "Argument";
}

export interface ResultDef extends InlinedTypeDef {
  kind: "Result";
}

export interface ObjectDef extends NamedDef {
  kind: "Object";
  props: PropertyDef[];
}

export interface PropertyDef extends NamedTypeDef {
  kind: "Property";
}

export interface EnumDef extends NamedDef {
  kind: "Enum";
  constants: string[];
}

/// Types (built-ins)

export type AnyType =
  | ScalarType
  | ArrayType
  | MapType
  | RefType
  | ImportRefType
  | UnlinkedImportRefType;

export type TypeKind =
  | "Scalar"
  | "Array"
  | "Map"
  | "Ref"
  | "ImportRef"
  | "UnlinkedImportRef"

export interface Type {
  kind: TypeKind;
}

export interface ScalarType<
  TScalarTypeName extends ScalarTypeName = ScalarTypeName
> extends Type {
  kind: "Scalar";
  scalar: TScalarTypeName;
}

export interface ArrayType extends Type {
  kind: "Array";
  item: OptionalType;
}

export interface MapType extends Type {
  kind: "Map";
  key: ScalarType<MapKeyTypeName>;
  value: OptionalType;
}

export interface RefType extends Type {
  kind: "Ref";
  ref_kind: UniqueDefKind;
  ref_name: string;
}

export interface ImportRefType extends Type {
  kind: "ImportRef";
  import_id: string;
  ref_kind: UniqueDefKind;
  ref_name: string;
}

export interface UnlinkedImportRefType extends Type {
  kind: "UnlinkedImportRef";
  namespaced_ref_name: string;
}

export interface OptionalType {
  required: boolean;
  type: AnyType;
}

/// Constants

export const scalarTypeSet = {
  UInt: "UInt",
  UInt8: "UInt8",
  UInt16: "UInt16",
  UInt32: "UInt32",
  Int: "Int",
  Int8: "Int8",
  Int16: "Int16",
  Int32: "Int32",
  String: "String",
  Boolean: "Boolean",
  Bytes: "Bytes",
  // TODO: remove complex types
  BigInt: "BigInt",
  BigNumber: "BigNumber",
  JSON: "JSON",
};
export type ScalarTypeSet = typeof scalarTypeSet;

export type ScalarTypeName = keyof ScalarTypeSet;

export const mapKeyTypeSet = {
  UInt: "UInt",
  UInt8: "UInt8",
  UInt16: "UInt16",
  UInt32: "UInt32",
  Int: "Int",
  Int8: "Int8",
  Int16: "Int16",
  Int32: "Int32",
  String: "String",
};
export type MapKeyTypeSet = typeof mapKeyTypeSet;

export type MapKeyTypeName = keyof MapKeyTypeSet;

export type AnyTypeOrDef = AnyType | AnyDef;