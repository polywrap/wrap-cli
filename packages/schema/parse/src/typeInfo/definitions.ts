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
  ImportedEnum = (1 << 9) | DefinitionKind.Enum,
  ImportedObject = (1 << 10) | DefinitionKind.Object,
  InterfaceImplemented = 1 << 11,
  UnresolvedObjectOrEnum = 1 << 12,
  ObjectRef = 1 << 13,
  EnumRef = 1 << 14,
  Interface = 1 << 15,
}

export function isKind(type: GenericDefinition, kind: DefinitionKind): boolean {
  return (type.kind & kind) === kind;
}

export type WithComment = {
  comment?: string;
};
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

export interface ObjectDefinition extends GenericDefinition, WithComment {
  properties: PropertyDefinition[];
  interfaces: InterfaceImplementedDefinition[];
}
export function createObjectDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  properties?: PropertyDefinition[];
  interfaces?: InterfaceImplementedDefinition[];
  comment?: string;
}): ObjectDefinition {
  return {
    ...createGenericDefinition(args),
    properties: args.properties ? args.properties : [],
    interfaces: args.interfaces ? args.interfaces : [],
    comment: args.comment,
    kind: DefinitionKind.Object,
  };
}

export type ObjectRef = GenericDefinition;
export function createObjectRef(args: {
  type: string;
  name?: string | null;
  required?: boolean;
}): ObjectRef {
  return {
    ...createGenericDefinition(args),
    kind: DefinitionKind.ObjectRef,
  };
}

export interface AnyDefinition extends GenericDefinition {
  array: ArrayDefinition | null;
  scalar: ScalarDefinition | null;
  object: ObjectRef | null;
  enum: EnumRef | null;
  unresolvedObjectOrEnum: UnresolvedObjectOrEnumRef | null;
}
export function createAnyDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  array?: ArrayDefinition;
  scalar?: ScalarDefinition;
  object?: ObjectRef;
  enum?: EnumRef;
}): AnyDefinition {
  return {
    ...createGenericDefinition(args),
    array: args.array ? args.array : null,
    scalar: args.scalar ? args.scalar : null,
    object: args.object ? args.object : null,
    enum: args.enum ? args.enum : null,
    unresolvedObjectOrEnum: null,
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

export interface EnumDefinition extends GenericDefinition, WithComment {
  constants: string[];
}
export function createEnumDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  constants?: string[];
  comment?: string;
}): EnumDefinition {
  return {
    ...createGenericDefinition(args),
    type: args.type,
    kind: DefinitionKind.Enum,
    constants: args.constants ? args.constants : [],
    comment: args.comment,
  };
}

export type EnumRef = GenericDefinition;
export function createEnumRef(args: {
  type: string;
  name?: string | null;
  required?: boolean;
}): EnumRef {
  return {
    ...createGenericDefinition(args),
    kind: DefinitionKind.EnumRef,
  };
}

export type UnresolvedObjectOrEnumRef = GenericDefinition;
export function createUnresolvedObjectOrEnumRef(args: {
  type: string;
  name?: string | null;
  required?: boolean;
}): UnresolvedObjectOrEnumRef {
  return {
    ...createGenericDefinition(args),
    type: args.type,
    kind: DefinitionKind.UnresolvedObjectOrEnum,
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
        args.item && isKind(args.item, DefinitionKind.ObjectRef)
          ? (args.item as ObjectRef)
          : undefined,
      enum:
        args.item && isKind(args.item, DefinitionKind.EnumRef)
          ? (args.item as EnumRef)
          : undefined,
    }),
    item: args.item ? args.item : null,
    kind: DefinitionKind.Array,
  };
}

export type PropertyDefinition = AnyDefinition & WithComment;
export function createPropertyDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  array?: ArrayDefinition;
  scalar?: ScalarDefinition;
  object?: ObjectRef;
  enum?: EnumRef;
  comment?: string;
}): PropertyDefinition {
  return {
    ...createAnyDefinition(args),
    comment: args.comment,
    kind: DefinitionKind.Property,
  };
}

export type InterfaceImplementedDefinition = GenericDefinition;
export function createInterfaceImplementedDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  array?: ArrayDefinition;
  scalar?: ScalarDefinition;
  object?: ObjectDefinition;
  enum?: EnumDefinition;
}): InterfaceImplementedDefinition {
  return {
    ...createAnyDefinition(args),
    kind: DefinitionKind.InterfaceImplemented,
  };
}

export function createArrayPropertyDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  item?: GenericDefinition;
  comment?: string;
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
  comment?: string;
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
  comment?: string;
}): PropertyDefinition {
  return createPropertyDefinition({
    ...args,
    enum: createEnumRef(args),
  });
}

export function createObjectPropertyDefinition(args: {
  type: string;
  name?: string | null;
  required?: boolean;
  properties?: PropertyDefinition[];
  comment?: string;
}): PropertyDefinition {
  return createPropertyDefinition({
    ...args,
    object: createObjectRef(args),
  });
}

export interface MethodDefinition extends GenericDefinition, WithComment {
  type: OperationType;
  arguments: PropertyDefinition[];
  return: PropertyDefinition;
}
export function createMethodDefinition(args: {
  type: string;
  name: string;
  arguments?: PropertyDefinition[];
  return: PropertyDefinition;
  comment?: string;
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
    return: args.return,
    comment: args.comment,
    kind: DefinitionKind.Method,
  };
}

export interface QueryDefinition extends GenericDefinition, WithComment {
  type: QueryType;
  methods: MethodDefinition[];
  imports: { type: string }[];
  interfaces: InterfaceImplementedDefinition[];
}
export function createQueryDefinition(args: {
  type: string;
  imports?: { type: string }[];
  interfaces?: InterfaceImplementedDefinition[];
  required?: boolean;
  comment?: string;
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
    imports: args.imports ? args.imports : [],
    interfaces: args.interfaces ? args.interfaces : [],
    comment: args.comment,
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
    ImportedDefinition,
    WithComment {}
export function createImportedEnumDefinition(args: {
  type: string;
  constants: string[];
  name?: string;
  required?: boolean;
  uri: string;
  namespace: string;
  nativeType: string;
  comment?: string;
}): ImportedEnumDefinition {
  return {
    ...createEnumDefinition(args),
    uri: args.uri,
    namespace: args.namespace,
    nativeType: args.nativeType,
    comment: args.comment,
    kind: DefinitionKind.ImportedEnum,
  };
}

export const capabilityTypes = ["getImplementations"] as const;
export type CapabilityType = typeof capabilityTypes[number];
export type InvokableModules = "query" | "mutation";
export interface Capability {
  enabled: boolean;
  modules: InvokableModules[];
}
export function createCapability(args: {
  type: CapabilityType;
  enabled: boolean;
  modules: InvokableModules[];
}): CapabilityDefinition {
  return {
    [args.type]: {
      enabled: args.enabled,
      modules: args.modules,
    },
  };
}

export type CapabilityDefinition = Record<CapabilityType, Capability>;

export interface InterfaceDefinition
  extends GenericDefinition,
    ImportedDefinition {
  capabilities: CapabilityDefinition;
}
export function createInterfaceDefinition(args: {
  type: string;
  required?: boolean;
  namespace: string;
  uri: string;
  capabilities: CapabilityDefinition;
}): InterfaceDefinition {
  return {
    ...createGenericDefinition(args),
    namespace: args.namespace,
    uri: args.uri,
    nativeType: "Interface",
    capabilities: args.capabilities,
    kind: DefinitionKind.Interface,
  };
}

export interface ImportedQueryDefinition
  extends GenericDefinition,
    ImportedDefinition,
    WithComment {
  methods: MethodDefinition[];
  isInterface?: boolean;
}
export function createImportedQueryDefinition(args: {
  type: string;
  required?: boolean;
  uri: string;
  namespace: string;
  nativeType: string;
  isInterface?: boolean;
  interfaces?: InterfaceImplementedDefinition[];
  comment?: string;
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
    comment: args.comment,
    isInterface: args.isInterface,
    kind: DefinitionKind.ImportedQuery,
  };
}

export interface ImportedObjectDefinition
  extends ObjectDefinition,
    ImportedDefinition,
    WithComment {}
export function createImportedObjectDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
  uri: string;
  namespace: string;
  nativeType: string;
  interfaces?: InterfaceImplementedDefinition[];
  comment?: string;
}): ImportedObjectDefinition {
  return {
    ...createObjectDefinition(args),
    uri: args.uri,
    namespace: args.namespace,
    nativeType: args.nativeType,
    comment: args.comment,
    kind: DefinitionKind.ImportedObject,
  };
}
