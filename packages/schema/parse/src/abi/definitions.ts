import {
  isMapKeyType,
  isModuleType,
  isScalarType,
  MapKeyType,
  ScalarType,
} from "./utils";

import {
  AnyDefinition,
  ArrayDefinition,
  CapabilityDefinition,
  EnumDefinition,
  EnumRef,
  EnvDefinition,
  GenericDefinition,
  ImportedEnumDefinition,
  ImportedEnvDefinition,
  ImportedModuleDefinition,
  ImportedObjectDefinition,
  InterfaceDefinition,
  InterfaceImplementedDefinition,
  MapDefinition,
  MapKeyDefinition,
  MethodDefinition,
  ModuleDefinition,
  ObjectDefinition,
  ObjectRef,
  PropertyDefinition,
  ScalarDefinition,
  UnresolvedObjectOrEnumRef,
  WithKind,
} from "@polywrap/wrap-manifest-types-js";

export enum DefinitionKind {
  Generic = 0,
  Object = 1 << 0,
  Any = 1 << 1,
  Scalar = 1 << 2,
  Enum = 1 << 3,
  Array = (1 << 4) | DefinitionKind.Any,
  Property = (1 << 5) | DefinitionKind.Any,
  Method = 1 << 6,
  Module = 1 << 7,
  ImportedModule = 1 << 8,
  ImportedEnum = (1 << 9) | DefinitionKind.Enum,
  ImportedObject = (1 << 10) | DefinitionKind.Object,
  InterfaceImplemented = 1 << 11,
  UnresolvedObjectOrEnum = 1 << 12,
  ObjectRef = 1 << 13,
  EnumRef = 1 << 14,
  Interface = 1 << 15,
  Env = 1 << 16,
  MapKey = 1 << 17,
  Map = (1 << 18) | DefinitionKind.Any,
  ImportedEnv = 1 << 19,
}

export function isKind(type: WithKind, kind: DefinitionKind): boolean {
  return (type.kind & kind) === kind;
}

export function createGenericDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
}): GenericDefinition {
  return {
    type: args.type,
    name: args.name,
    required: args.required,
    kind: DefinitionKind.Generic,
  };
}

export function createObjectDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
  properties?: PropertyDefinition[];
  interfaces?: InterfaceImplementedDefinition[];
  comment?: string;
}): ObjectDefinition {
  return {
    ...createGenericDefinition(args),
    properties: args.properties,
    interfaces: args.interfaces,
    comment: args.comment,
    kind: DefinitionKind.Object,
  };
}

export function createObjectRef(args: {
  type: string;
  name?: string;
  required?: boolean;
}): ObjectRef {
  return {
    ...createGenericDefinition(args),
    kind: DefinitionKind.ObjectRef,
  };
}

export function createAnyDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
  array?: ArrayDefinition;
  map?: MapDefinition;
  scalar?: ScalarDefinition;
  object?: ObjectRef;
  enum?: EnumRef;
  unresolvedObjectOrEnum?: UnresolvedObjectOrEnumRef;
}): AnyDefinition {
  return {
    ...createGenericDefinition(args),
    array: args.array,
    map: args.map,
    scalar: args.scalar,
    object: args.object,
    enum: args.enum,
    unresolvedObjectOrEnum: args.unresolvedObjectOrEnum,
    kind: DefinitionKind.Any,
  };
}

export function createMapKeyDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
}): MapKeyDefinition {
  if (!isMapKeyType(args.type)) {
    throw Error(
      `createMapKeyDefinition: Unrecognized Map key type provided "${args.type}"`
    );
  }
  return {
    ...createGenericDefinition(args),
    type: args.type as MapKeyType,
    kind: DefinitionKind.Scalar,
  };
}

export function createScalarDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
}): ScalarDefinition {
  if (!isScalarType(args.type)) {
    throw Error(
      `createScalarDefinition: Unrecognized scalar type provided "${args.type}"`
    );
  }
  return {
    ...createGenericDefinition(args),
    type: args.type as ScalarType,
    kind: DefinitionKind.Scalar,
  };
}

export function createEnumDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
  constants?: string[];
  comment?: string;
}): EnumDefinition {
  return {
    ...createGenericDefinition(args),
    type: args.type,
    kind: DefinitionKind.Enum,
    constants: args.constants,
    comment: args.comment,
  };
}

export function createEnumRef(args: {
  type: string;
  name?: string;
  required?: boolean;
}): EnumRef {
  return {
    ...createGenericDefinition(args),
    kind: DefinitionKind.EnumRef,
  };
}

export function createUnresolvedObjectOrEnumRef(args: {
  type: string;
  name?: string;
  required?: boolean;
}): UnresolvedObjectOrEnumRef {
  return {
    ...createGenericDefinition(args),
    type: args.type,
    kind: DefinitionKind.UnresolvedObjectOrEnum,
  };
}

export function createMapDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
  key?: MapKeyDefinition;
  value?: GenericDefinition;
}): MapDefinition {
  return {
    ...createAnyDefinition({
      ...args,
      array:
        args.value && isKind(args.value, DefinitionKind.Array)
          ? (args.value as ArrayDefinition)
          : undefined,
      map:
        args.value && isKind(args.value, DefinitionKind.Map)
          ? (args.value as MapDefinition)
          : undefined,
      scalar:
        args.value && isKind(args.value, DefinitionKind.Scalar)
          ? (args.value as ScalarDefinition)
          : undefined,
      object:
        args.value && isKind(args.value, DefinitionKind.ObjectRef)
          ? (args.value as ObjectRef)
          : undefined,
      enum:
        args.value && isKind(args.value, DefinitionKind.EnumRef)
          ? (args.value as EnumRef)
          : undefined,
      unresolvedObjectOrEnum:
        args.value && isKind(args.value, DefinitionKind.UnresolvedObjectOrEnum)
          ? (args.value as UnresolvedObjectOrEnumRef)
          : undefined,
    }),
    key: args.key,
    value: args.value,
    kind: DefinitionKind.Map,
  };
}

export function createArrayDefinition(args: {
  type: string;
  name?: string;
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
      map:
        args.item && isKind(args.item, DefinitionKind.Map)
          ? (args.item as MapDefinition)
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
      unresolvedObjectOrEnum:
        args.item && isKind(args.item, DefinitionKind.UnresolvedObjectOrEnum)
          ? (args.item as UnresolvedObjectOrEnumRef)
          : undefined,
    }),
    item: args.item,
    kind: DefinitionKind.Array,
  };
}

export function createPropertyDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
  array?: ArrayDefinition;
  map?: MapDefinition;
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

export function createInterfaceImplementedDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
  array?: ArrayDefinition;
  map?: MapDefinition;
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
  name?: string;
  required?: boolean;
  item?: GenericDefinition;
  comment?: string;
}): PropertyDefinition {
  return createPropertyDefinition({
    ...args,
    array: createArrayDefinition(args),
  });
}

export function createMapPropertyDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
  key: MapKeyDefinition;
  value?: GenericDefinition;
  comment?: string;
}): PropertyDefinition {
  return createPropertyDefinition({
    ...args,
    map: createMapDefinition(args),
  });
}

export function createScalarPropertyDefinition(args: {
  type: ScalarDefinition["type"];
  name?: string;
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
  name?: string;
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
  name?: string;
  required?: boolean;
  properties?: PropertyDefinition[];
  comment?: string;
}): PropertyDefinition {
  return createPropertyDefinition({
    ...args,
    object: createObjectRef(args),
  });
}

export function createMethodDefinition(args: {
  name: string;
  arguments?: PropertyDefinition[];
  env?: {
    required: boolean;
  };
  return: PropertyDefinition;
  comment?: string;
}): MethodDefinition {
  return {
    ...createGenericDefinition({
      ...args,
      type: "Method",
    }),
    required: true,
    arguments: args.arguments,
    return: args.return,
    comment: args.comment,
    kind: DefinitionKind.Method,
  };
}

export function createModuleDefinition(args: {
  imports?: { type: ModuleDefinition["type"] }[];
  interfaces?: InterfaceImplementedDefinition[];
  required?: boolean;
  comment?: string;
}): ModuleDefinition {
  return {
    ...createGenericDefinition({
      ...args,
      type: "Module",
    }),
    methods: [],
    imports: args.imports,
    interfaces: args.interfaces,
    comment: args.comment,
    kind: DefinitionKind.Module,
  };
}

export function createImportedEnumDefinition(args: {
  type: string;
  constants?: string[];
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

// TODO: We don't want this hard coded
export const capabilityTypes = ["getImplementations"] as const;
export type CapabilityType = typeof capabilityTypes[number];
export function createCapability(args: {
  type: CapabilityType;
  enabled: boolean;
}): CapabilityDefinition {
  return {
    [args.type]: {
      enabled: args.enabled,
    },
  };
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

export function createImportedModuleDefinition(args: {
  required?: boolean;
  uri: string;
  namespace: string;
  nativeType: string;
  isInterface?: boolean;
  interfaces?: InterfaceImplementedDefinition[];
  comment?: string;
}): ImportedModuleDefinition {
  if (!isModuleType(args.nativeType)) {
    throw Error(
      `createImportedModuleDefinition: Unrecognized module type provided "${args.nativeType}"`
    );
  }

  return {
    ...createGenericDefinition({
      ...args,
      type: `${args.namespace}_${args.nativeType}`,
    }),
    methods: [],
    uri: args.uri,
    namespace: args.namespace,
    nativeType: args.nativeType,
    comment: args.comment,
    isInterface: args.isInterface,
    kind: DefinitionKind.ImportedModule,
  };
}

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

export function createEnvDefinition(args: {
  name?: string;
  required?: boolean;
  properties?: PropertyDefinition[];
  interfaces?: InterfaceImplementedDefinition[];
  comment?: string;
}): EnvDefinition {
  return {
    ...createObjectDefinition({ ...args, type: "Env" }),
    kind: DefinitionKind.Env,
  };
}

export function createImportedEnvDefinition(args: {
  type: string;
  name?: string;
  required?: boolean;
  uri: string;
  namespace: string;
  nativeType: string;
  interfaces?: InterfaceImplementedDefinition[];
  comment?: string;
}): ImportedEnvDefinition {
  return {
    ...createObjectDefinition({
      ...args,
      type: `${args.namespace}_Env`,
    }),
    uri: args.uri,
    namespace: args.namespace,
    nativeType: args.nativeType,
    comment: args.comment,
    kind: DefinitionKind.ImportedEnv,
  };
}
