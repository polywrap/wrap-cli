/// ABIs

export interface Abi extends AbiDefs {
  version: "0.2";
  imports?: ImportedAbi[];
}

export interface ImportedAbi extends AbiDefs {
  namespace: string;
  uri: string;
}

export interface AbiDefs {
  functions?: FunctionDef[];
  objects?: ObjectDef[];
  enums?: EnumDef[];
  env?: EnvDef;
}

/// Definitions (user-defined)

export type UniqueDefKind =
  | "Function"
  | "Object"
  | "Enum"
  | "Env";

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
  comment?: string;
}

export interface TypeDef extends Def {
  required: boolean;
  type: AnyType;
}

export interface NamedTypeDef extends NamedDef, TypeDef { }

export interface FunctionDef extends NamedDef {
  kind: "Function";
  args: ArgumentDef[];
  result: ResultDef;
}

export interface ArgumentDef extends NamedTypeDef {
  kind: "Argument";
}

export interface ResultDef extends TypeDef {
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

export interface EnvDef extends NamedDef {
  kind: "Env";
  name: "Env";
  props: PropertyDef[];
}

/// Types (built-ins)

export type AnyType =
  | ScalarType
  | ArrayType
  | MapType
  | RefType;

export type TypeKind =
  | "Scalar"
  | "Array"
  | "Map"
  | "Ref";

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
  required: boolean;
  item: AnyType;
}

export interface MapType extends Type {
  kind: "Map";
  key: ScalarType<MapKeyTypeName>;
  required: boolean;
  value: AnyType;
}

export interface RefType extends Type {
  kind: "Ref";
  ref_kind: UniqueDefKind;
  ref_name: string;
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
