import { ScalarType, isScalarType } from "./scalar";
import { OperationType, isOperationType } from "./operation";
import { QueryType, isQueryType } from "./query";

export enum DefinitionKind {
  Generic = 0,
  Object = 1 << 0,
  Any = 1 << 1,
  Scalar = 1 << 2,
  Enum = 1 << 3,
  Array = (1 << 4) | DefinitionKind.Any,
  Property = (1 << 5) | DefinitionKind.Any,
  Method = 1 << 6,
  Query = 1 << 7,
  ImportedQuery = 1 << 8,
  ImportedEnum = 1 << 9,
  ImportedObject = (1 << 10) | DefinitionKind.Object,
}

export function isKind(type: GenericDefinition, kind: DefinitionKind): boolean {
  return (type.kind & kind) === kind;
}

export interface GenericDefinition {
  type: string;
  name: string | null;
  required: boolean | null;
  kind: DefinitionKind;
}
export function createGenericDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
}): GenericDefinition {
  return {
    type: args.type,
    name: args.name ? args.name : null,
    required: args.required ? args.required : null,
    kind: DefinitionKind.Generic,
  };
}

export interface ObjectDefinition extends GenericDefinition {
  properties: PropertyDefinition[];
}
export function createObjectDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  properties?: PropertyDefinition[];
}): ObjectDefinition {
  return {
    ...createGenericDefinition(args),
    properties: args.properties ? args.properties : [],
    kind: DefinitionKind.Object,
  };
}

export interface AnyDefinition extends GenericDefinition {
  array: ArrayDefinition | null;
  scalar: ScalarDefinition | null;
  object: ObjectDefinition | null;
  enum: EnumDefinition | null;
}
export function createAnyDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  array?: ArrayDefinition;
  scalar?: ScalarDefinition;
  object?: ObjectDefinition;
  enum?: EnumDefinition;
}): AnyDefinition {
  return {
    ...createGenericDefinition(args),
    array: args.array ? args.array : null,
    scalar: args.scalar ? args.scalar : null,
    object: args.object ? args.object : null,
    enum: args.enum ? args.enum : null,
    kind: DefinitionKind.Any,
  };
}

export interface ScalarDefinition extends GenericDefinition {
  type: ScalarType;
}
export function createScalarDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
}): ScalarDefinition {
  if (!isScalarType(args.type)) {
    throw Error(
      `createScalarDefinition: Unrecognized scalar type provided "${args.type}"`
    );
  }
  return {
    ...createGenericDefinition(args),
    type: args.type,
    kind: DefinitionKind.Scalar,
  };
}

export interface EnumDefinition extends GenericDefinition {
  constants: string[];
}
export function createEnumDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  constants?: string[];
}): EnumDefinition {
  return {
    ...createGenericDefinition(args),
    type: args.type,
    kind: DefinitionKind.Enum,
    constants: args.constants ? args.constants : [],
  };
}

export interface ArrayDefinition extends AnyDefinition {
  item: GenericDefinition | null;
}
export function createArrayDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  item?: GenericDefinition;
}): ArrayDefinition {
  return {
    ...createAnyDefinition({
      ...args,
      array:
        args.item && isKind(args.item, DefinitionKind.Array)
          ? (args.item as ArrayDefinition)
          : undefined,
      scalar:
        args.item && isKind(args.item, DefinitionKind.Scalar)
          ? (args.item as ScalarDefinition)
          : undefined,
      object:
        args.item && isKind(args.item, DefinitionKind.Object)
          ? (args.item as ObjectDefinition)
          : undefined,
      enum:
        args.item && isKind(args.item, DefinitionKind.Enum)
          ? (args.item as EnumDefinition)
          : undefined,
    }),
    item: args.item ? args.item : null,
    kind: DefinitionKind.Array,
  };
}

export type PropertyDefinition = AnyDefinition;
export function createPropertyDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  array?: ArrayDefinition;
  scalar?: ScalarDefinition;
  object?: ObjectDefinition;
  enum?: EnumDefinition;
}): PropertyDefinition {
  return {
    ...createAnyDefinition(args),
    kind: DefinitionKind.Property,
  };
}

export function createArrayPropertyDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  item?: GenericDefinition;
}): PropertyDefinition {
  return createPropertyDefinition({
    ...args,
    array: createArrayDefinition(args),
  });
}

export function createScalarPropertyDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
}): PropertyDefinition {
  return createPropertyDefinition({
    ...args,
    scalar: createScalarDefinition(args),
  });
}

export function createEnumPropertyDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  constants?: string[];
}): PropertyDefinition {
  return createPropertyDefinition({
    ...args,
    enum: createEnumDefinition(args),
  });
}

export function createObjectPropertyDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  properties?: PropertyDefinition[];
}): PropertyDefinition {
  return createPropertyDefinition({
    ...args,
    object: createObjectDefinition(args),
  });
}

export interface MethodDefinition extends GenericDefinition {
  type: OperationType;
  arguments: PropertyDefinition[];
  return: PropertyDefinition | null;
}
export function createMethodDefinition(args: {
  type: string;
  name: string;
  arguments?: PropertyDefinition[];
  return?: PropertyDefinition;
}): MethodDefinition {
  const lowercase = args.type.toLowerCase();
  if (!isOperationType(lowercase)) {
    throw Error(
      `createMethodDefinition: Unrecognized operation type provided "${args.type}"`
    );
  }
  return {
    ...createGenericDefinition(args),
    type: lowercase,
    required: true,
    arguments: args.arguments ? args.arguments : [],
    return: args.return ? args.return : null,
    kind: DefinitionKind.Method,
  };
}

export interface QueryDefinition extends GenericDefinition {
  type: QueryType;
  methods: MethodDefinition[];
}
export function createQueryDefinition(args: {
  type: string;
  required?: boolean;
}): QueryDefinition {
  if (!isQueryType(args.type)) {
    throw Error(
      `createQueryDefinition: Unrecognized query type provided "${args.type}"`
    );
  }

  return {
    ...createGenericDefinition(args),
    type: args.type,
    methods: [],
    kind: DefinitionKind.Query,
  };
}

export interface ImportedDefinition {
  uri: string;
  namespace: string;
  nativeType: string;
}

export interface ImportedEnumDefinition
  extends EnumDefinition,
    ImportedDefinition {}
export function createImportedEnumDefinition(args: {
  type: string;
  constants: string[];
  name?: string;
  required?: boolean;
  uri: string;
  namespace: string;
  nativeType: string;
}): ImportedEnumDefinition {
  return {
    ...createEnumDefinition(args),
    uri: args.uri,
    namespace: args.namespace,
    nativeType: args.nativeType,
    kind: DefinitionKind.ImportedEnum,
  };
}

export interface ImportedQueryDefinition
  extends GenericDefinition,
    ImportedDefinition {
  methods: MethodDefinition[];
}
export function createImportedQueryDefinition(args: {
  type: string;
  required?: boolean;
  uri: string;
  namespace: string;
  nativeType: string;
}): ImportedQueryDefinition {
  if (!isQueryType(args.nativeType)) {
    throw Error(
      `createImportedQueryDefinition: Unrecognized query type provided "${args.nativeType}"`
    );
  }

  return {
    ...createGenericDefinition(args),
    methods: [],
    uri: args.uri,
    namespace: args.namespace,
    nativeType: args.nativeType,
    kind: DefinitionKind.ImportedQuery,
  };
}

export interface ImportedObjectDefinition
  extends ObjectDefinition,
    ImportedDefinition {}
export function createImportedObjectDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
  uri: string;
  namespace: string;
  nativeType: string;
}): ImportedObjectDefinition {
  return {
    ...createObjectDefinition(args),
    uri: args.uri,
    namespace: args.namespace,
    nativeType: args.nativeType,
    kind: DefinitionKind.ImportedObject,
  };
}
