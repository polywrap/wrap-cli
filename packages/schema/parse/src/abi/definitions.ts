import { isMapKeyType, isModuleType, isScalarType } from "./utils";

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
  WithComment,
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

export function createGenericDefinition(
  args: Omit<GenericDefinition, "kind">
): GenericDefinition {
  return {
    ...args,
    kind: DefinitionKind.Generic,
  };
}

export function createObjectDefinition(
  args: Omit<ObjectDefinition, "kind">
): ObjectDefinition {
  return {
    ...args,
    kind: DefinitionKind.Object,
  };
}

export function createObjectRef(args: Omit<ObjectRef, "kind">): ObjectRef {
  return {
    ...args,
    kind: DefinitionKind.ObjectRef,
  };
}

export function createAnyDefinition(
  args: Omit<AnyDefinition, "kind">
): AnyDefinition {
  return {
    ...args,
    kind: DefinitionKind.Any,
  };
}

export function createMapKeyDefinition(
  args: Omit<MapKeyDefinition, "kind">
): MapKeyDefinition {
  if (!isMapKeyType(args.type)) {
    throw Error(
      `createMapKeyDefinition: Unrecognized Map key type provided "${args.type}"`
    );
  }
  return {
    ...args,
    kind: DefinitionKind.Scalar,
  };
}

export function createScalarDefinition(
  args: Omit<ScalarDefinition, "kind">
): ScalarDefinition {
  if (!isScalarType(args.type)) {
    throw Error(
      `createScalarDefinition: Unrecognized scalar type provided "${args.type}"`
    );
  }
  return {
    ...args,
    kind: DefinitionKind.Scalar,
  };
}

export function createEnumDefinition(
  args: Omit<EnumDefinition, "kind">
): EnumDefinition {
  return {
    ...args,
    kind: DefinitionKind.Enum,
  };
}

export function createEnumRef(args: Omit<EnumRef, "kind">): EnumRef {
  return {
    ...args,
    kind: DefinitionKind.EnumRef,
  };
}

export function createUnresolvedObjectOrEnumRef(
  args: Omit<UnresolvedObjectOrEnumRef, "kind">
): UnresolvedObjectOrEnumRef {
  return {
    ...args,
    kind: DefinitionKind.UnresolvedObjectOrEnum,
  };
}

export function createMapDefinition(
  args: Omit<MapDefinition, "kind">
): MapDefinition {
  return {
    ...args,
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
    kind: DefinitionKind.Map,
  };
}

export function createArrayDefinition(
  args: Omit<ArrayDefinition, "kind">
): ArrayDefinition {
  return {
    ...args,
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
    kind: DefinitionKind.Array,
  };
}

export function createPropertyDefinition(
  args: Omit<PropertyDefinition, "kind">
): PropertyDefinition {
  return {
    ...args,
    kind: DefinitionKind.Property,
  };
}

export function createInterfaceImplementedDefinition(
  args: Omit<InterfaceImplementedDefinition, "kind">
): InterfaceImplementedDefinition {
  return {
    ...args,
    kind: DefinitionKind.InterfaceImplemented,
  };
}

export function createArrayPropertyDefinition(
  args: Omit<ArrayDefinition, "kind"> & WithComment
): PropertyDefinition {
  const comment = args.comment;
  delete args.comment;
  const result = createPropertyDefinition({
    name: args.name,
    type: args.type,
    required: args.required,
    array: createArrayDefinition(args),
  });
  return comment ? { ...result, comment } : result;
}

export function createMapPropertyDefinition(
  args: Omit<MapDefinition, "kind"> & WithComment
): PropertyDefinition {
  const comment = args.comment;
  delete args.comment;
  const result = createPropertyDefinition({
    name: args.name,
    type: args.type,
    required: args.required,
    map: createMapDefinition(args),
  });
  return comment ? { ...result, comment } : result;
}

export function createScalarPropertyDefinition(
  args: Omit<ScalarDefinition, "kind"> & WithComment
): PropertyDefinition {
  const comment = args.comment;
  delete args.comment;
  const result = createPropertyDefinition({
    name: args.name,
    type: args.type,
    required: args.required,
    scalar: createScalarDefinition(args),
  });
  return comment ? { ...result, comment } : result;
}

export function createEnumPropertyDefinition(
  args: Omit<EnumRef, "kind"> & WithComment
): PropertyDefinition {
  const comment = args.comment;
  delete args.comment;
  const result = createPropertyDefinition({
    name: args.name,
    type: args.type,
    required: args.required,
    enum: createEnumRef(args),
  });
  return comment ? { ...result, comment } : result;
}

export function createObjectPropertyDefinition(
  args: Omit<ObjectRef, "kind"> & WithComment
): PropertyDefinition {
  const comment = args.comment;
  delete args.comment;
  const result = createPropertyDefinition({
    name: args.name,
    type: args.type,
    required: args.required,
    object: createObjectRef(args),
  });
  return comment ? { ...result, comment } : result;
}

export function createMethodDefinition(
  args: Omit<Omit<MethodDefinition, "kind">, "type">
): MethodDefinition {
  if (args.name?.startsWith("__") && args.name?.endsWith("__")) {
    throw new Error(
      "Dunder methods (Methods starting and ending with __) are reserved methods"
    );
  }
  return {
    ...args,
    ...createGenericDefinition({
      ...args,
      type: "Method",
    }),
    required: true,
    kind: DefinitionKind.Method,
  };
}

export function createModuleDefinition(
  args: Omit<Omit<ModuleDefinition, "kind">, "type">
): ModuleDefinition {
  return {
    ...args,
    ...createGenericDefinition({
      ...args,
      type: "Module",
    }),
    kind: DefinitionKind.Module,
  };
}

export function createImportedEnumDefinition(
  args: Omit<ImportedEnumDefinition, "kind">
): ImportedEnumDefinition {
  return {
    ...args,
    ...createEnumDefinition(args),
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

export function createInterfaceDefinition(
  args: Omit<Omit<InterfaceDefinition, "kind">, "nativeType">
): InterfaceDefinition {
  return {
    ...args,
    ...createGenericDefinition(args),
    nativeType: "Interface",
    kind: DefinitionKind.Interface,
  };
}

export function createImportedModuleDefinition(
  args: Omit<Omit<ImportedModuleDefinition, "kind">, "type">
): ImportedModuleDefinition {
  if (!isModuleType(args.nativeType)) {
    throw Error(
      `createImportedModuleDefinition: Unrecognized module type provided "${args.nativeType}"`
    );
  }

  return {
    ...args,
    ...createGenericDefinition({
      ...args,
      type: `${args.namespace}_${args.nativeType}`,
    }),
    kind: DefinitionKind.ImportedModule,
  };
}

export function createImportedObjectDefinition(
  args: Omit<ImportedObjectDefinition, "kind">
): ImportedObjectDefinition {
  return {
    ...args,
    ...createObjectDefinition(args),
    kind: DefinitionKind.ImportedObject,
  };
}

export function createEnvDefinition(
  args: Omit<Omit<EnvDefinition, "kind">, "type">
): EnvDefinition {
  return {
    ...args,
    ...createObjectDefinition({ ...args, type: "Env" }),
    kind: DefinitionKind.Env,
  };
}

export function createImportedEnvDefinition(
  args: Omit<Omit<ImportedEnvDefinition, "kind">, "type">
): ImportedEnvDefinition {
  return {
    ...args,
    ...createObjectDefinition({
      ...args,
      type: `${args.namespace}_Env`,
    }),
    kind: DefinitionKind.ImportedEnv,
  };
}
