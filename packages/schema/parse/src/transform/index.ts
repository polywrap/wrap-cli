/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { DefinitionKind, isKind } from "../abi";

import {
  AnyDefinition,
  EnvDefinition,
  ImportedEnvDefinition,
  GenericDefinition,
  ObjectDefinition,
  ScalarDefinition,
  PropertyDefinition,
  ArrayDefinition,
  MethodDefinition,
  ModuleDefinition,
  ImportedModuleDefinition,
  ImportedObjectDefinition,
  EnumDefinition,
  ImportedEnumDefinition,
  InterfaceImplementedDefinition,
  EnumRef,
  ObjectRef,
  InterfaceDefinition,
  WithKind,
  MapDefinition,
  WrapAbi,
} from "@polywrap/wrap-manifest-types-js";

export * from "./finalizePropertyDef";
export * from "./extendType";
export * from "./addFirstLast";
export * from "./interfaceUris";
export * from "./methodParentPointers";
export * from "./toGraphQLType";
export * from "./moduleCapabilities";
export * from "./hasImports";
export * from "./addAnnotations";
export * from "./moduleHasEnv";

export interface AbiTransforms {
  enter?: AbiTransformer;
  leave?: AbiTransformer;
}

export interface AbiTransformer {
  Abi?: (abi: WrapAbi) => WrapAbi;
  GenericDefinition?: (def: GenericDefinition) => GenericDefinition;
  ObjectDefinition?: (def: ObjectDefinition) => ObjectDefinition;
  ObjectRef?: (def: ObjectRef) => ObjectRef;
  AnyDefinition?: (def: AnyDefinition) => AnyDefinition;
  ScalarDefinition?: (def: ScalarDefinition) => ScalarDefinition;
  EnumDefinition?: (def: EnumDefinition) => EnumDefinition;
  EnumRef?: (def: EnumRef) => EnumRef;
  PropertyDefinition?: (def: PropertyDefinition) => PropertyDefinition;
  ArrayDefinition?: (def: ArrayDefinition) => ArrayDefinition;
  MethodDefinition?: (def: MethodDefinition) => MethodDefinition;
  ModuleDefinition?: (def: ModuleDefinition) => ModuleDefinition;
  InterfaceDefinition?: (def: InterfaceDefinition) => InterfaceDefinition;
  ImportedEnumDefinition?: (
    def: ImportedEnumDefinition
  ) => ImportedEnumDefinition;
  ImportedModuleDefinition?: (
    def: ImportedModuleDefinition
  ) => ImportedModuleDefinition;
  ImportedEnvDefinition?: (def: ImportedEnvDefinition) => ImportedEnvDefinition;
  ImportedObjectDefinition?: (
    def: ImportedObjectDefinition
  ) => ImportedObjectDefinition;
  InterfaceImplementedDefinition?: (
    def: InterfaceImplementedDefinition
  ) => InterfaceImplementedDefinition;
  EnvDefinition?: (def: EnvDefinition) => EnvDefinition;
  MapDefinition?: (def: MapDefinition) => MapDefinition;
}

export function transformAbi(abi: WrapAbi, transforms: AbiTransforms): WrapAbi {
  let result = Object.assign({}, abi);

  if (transforms.enter && transforms.enter.Abi) {
    result = transforms.enter.Abi(result);
  }

  if (result.interfaceTypes) {
    for (let i = 0; i < result.interfaceTypes.length; ++i) {
      result.interfaceTypes[i] = visitInterfaceDefinition(
        result.interfaceTypes[i],
        transforms
      );
    }
  }

  if (result.enumTypes) {
    for (let i = 0; i < result.enumTypes.length; ++i) {
      result.enumTypes[i] = visitEnumDefinition(
        result.enumTypes[i],
        transforms
      );
    }
  }

  if (result.objectTypes) {
    for (let i = 0; i < result.objectTypes.length; ++i) {
      result.objectTypes[i] = visitObjectDefinition(
        result.objectTypes[i],
        transforms
      );
    }
  }

  if (result.moduleType) {
    result.moduleType = visitModuleDefinition(result.moduleType, transforms);
  }

  if (result.envType) {
    result.envType = visitEnvDefinition(result.envType, transforms);
  }

  if (result.importedObjectTypes) {
    for (let i = 0; i < result.importedObjectTypes.length; ++i) {
      result.importedObjectTypes[i] = visitImportedObjectDefinition(
        result.importedObjectTypes[i],
        transforms
      );
    }
  }

  if (result.importedModuleTypes) {
    for (let i = 0; i < result.importedModuleTypes.length; ++i) {
      result.importedModuleTypes[i] = visitImportedModuleDefinition(
        result.importedModuleTypes[i],
        transforms
      );
    }
  }

  if (result.importedEnumTypes) {
    for (let i = 0; i < result.importedEnumTypes.length; ++i) {
      result.importedEnumTypes[i] = visitImportedEnumDefinition(
        result.importedEnumTypes[i],
        transforms
      );
    }
  }

  if (result.importedEnvTypes) {
    for (let i = 0; i < result.importedEnvTypes.length; ++i) {
      result.importedEnvTypes[i] = visitImportedEnvDefinition(
        result.importedEnvTypes[i],
        transforms
      );
    }
  }

  if (transforms.leave && transforms.leave.Abi) {
    result = transforms.leave.Abi(result);
  }

  return result;
}

export function visitObjectDefinition(
  def: ObjectDefinition,
  transforms: AbiTransforms
): ObjectDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  if (result.properties) {
    for (let i = 0; i < result.properties.length; ++i) {
      result.properties[i] = visitPropertyDefinition(
        result.properties[i],
        transforms
      );
    }
  }

  if (result.interfaces) {
    for (let i = 0; i < result.interfaces.length; ++i) {
      result.interfaces[i] = visitInterfaceImplementedDefinition(
        result.interfaces[i],
        transforms
      );
    }
  }

  return transformType(result, transforms.leave);
}

export function visitObjectRef(
  def: ObjectRef,
  transforms: AbiTransforms
): ObjectRef {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  return transformType(result, transforms.leave);
}

export function visitInterfaceImplementedDefinition(
  def: InterfaceImplementedDefinition,
  transforms: AbiTransforms
): InterfaceImplementedDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  return transformType(result, transforms.leave);
}

export function visitAnyDefinition(
  def: AnyDefinition,
  transforms: AbiTransforms
): AnyDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  if (result.array) {
    result.array = visitArrayDefinition(result.array, transforms);
  }

  if (result.map) {
    result.map = visitMapDefinition(result.map, transforms);
  }

  if (result.scalar) {
    result.scalar = visitScalarDefinition(result.scalar, transforms);
  }

  if (result.object) {
    result.object = visitObjectRef(result.object, transforms);
  }

  if (result.enum) {
    result.enum = visitEnumRef(result.enum, transforms);
  }

  return result;
}

export function visitScalarDefinition(
  def: ScalarDefinition,
  transforms: AbiTransforms
): ScalarDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  return transformType(result, transforms.leave);
}

export function visitEnumDefinition(
  def: EnumDefinition,
  transforms: AbiTransforms
): EnumDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  return transformType(result, transforms.leave);
}

export function visitEnumRef(def: EnumRef, transforms: AbiTransforms): EnumRef {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  return transformType(result, transforms.leave);
}

export function visitArrayDefinition(
  def: ArrayDefinition,
  transforms: AbiTransforms
): ArrayDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  result = visitAnyDefinition(result, transforms) as any;

  if (result.item) {
    result.item = transformType(result.item, transforms.enter);
    result.item = transformType(result.item, transforms.leave);
  }

  return transformType(result, transforms.leave);
}

export function visitPropertyDefinition(
  def: PropertyDefinition,
  transforms: AbiTransforms
): PropertyDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  result = visitAnyDefinition(result, transforms);

  return transformType(result, transforms.leave);
}

export function visitMethodDefinition(
  def: MethodDefinition,
  transforms: AbiTransforms
): MethodDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  if (result.arguments) {
    for (let i = 0; i < result.arguments.length; ++i) {
      result.arguments[i] = visitPropertyDefinition(
        result.arguments[i],
        transforms
      );
    }
  }

  if (result.return) {
    result.return = visitPropertyDefinition(result.return, transforms);
  }

  return transformType(result, transforms.leave);
}

export function visitModuleDefinition(
  def: ModuleDefinition,
  transforms: AbiTransforms
): ModuleDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  if (result.methods) {
    for (let i = 0; i < result.methods.length; ++i) {
      result.methods[i] = visitMethodDefinition(result.methods[i], transforms);
    }
  }

  return transformType(result, transforms.leave);
}

export function visitInterfaceDefinition(
  def: InterfaceDefinition,
  transforms: AbiTransforms
): InterfaceDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  return transformType(result, transforms.leave);
}

export function visitImportedModuleDefinition(
  def: ImportedModuleDefinition,
  transforms: AbiTransforms
): ImportedModuleDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  if (result.methods) {
    for (let i = 0; i < result.methods.length; ++i) {
      result.methods[i] = visitMethodDefinition(result.methods[i], transforms);
    }
  }

  return transformType(result, transforms.leave);
}

export function visitImportedObjectDefinition(
  def: ImportedObjectDefinition,
  transforms: AbiTransforms
): ImportedObjectDefinition {
  return visitObjectDefinition(def, transforms) as ImportedObjectDefinition;
}

export function visitImportedEnumDefinition(
  def: ImportedEnumDefinition,
  transforms: AbiTransforms
): ImportedEnumDefinition {
  return visitEnumDefinition(def, transforms) as ImportedEnumDefinition;
}

export function visitImportedEnvDefinition(
  def: ImportedEnvDefinition,
  transforms: AbiTransforms
): ImportedEnvDefinition {
  return visitEnvDefinition(def, transforms) as ImportedEnvDefinition;
}

export function visitEnvDefinition(
  def: EnvDefinition,
  transforms: AbiTransforms
): EnvDefinition {
  return visitObjectDefinition(def, transforms);
}

export function visitMapDefinition(
  def: MapDefinition,
  transforms: AbiTransforms
): MapDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  result = visitAnyDefinition(result, transforms) as any;

  if (result.key) {
    result.key = transformType(result.key, transforms.enter);
    result.key = transformType(result.key, transforms.leave);
  }

  if (result.value) {
    result.value = transformType(result.value, transforms.enter);
    result.value = transformType(result.value, transforms.leave);
  }

  return transformType(result, transforms.leave);
}

export function transformType<TDefinition extends WithKind>(
  type: TDefinition,
  transform?: AbiTransformer
): TDefinition {
  if (!transform) {
    return type;
  }

  let result = Object.assign({}, type);
  const {
    GenericDefinition,
    ObjectDefinition,
    ObjectRef,
    AnyDefinition,
    ScalarDefinition,
    EnumDefinition,
    EnumRef,
    ArrayDefinition,
    PropertyDefinition,
    MethodDefinition,
    ModuleDefinition,
    InterfaceDefinition,
    ImportedEnumDefinition,
    ImportedModuleDefinition,
    ImportedObjectDefinition,
    InterfaceImplementedDefinition,
    EnvDefinition,
    MapDefinition,
    ImportedEnvDefinition,
  } = transform;

  if (GenericDefinition && isKind(result, DefinitionKind.Generic)) {
    result = Object.assign(result, GenericDefinition(result as any));
  }
  if (ObjectDefinition && isKind(result, DefinitionKind.Object)) {
    result = Object.assign(result, ObjectDefinition(result as any));
  }
  if (ObjectRef && isKind(result, DefinitionKind.ObjectRef)) {
    result = Object.assign(result, ObjectRef(result as any));
  }
  if (AnyDefinition && isKind(result, DefinitionKind.Any)) {
    result = Object.assign(result, AnyDefinition(result as any));
  }
  if (ScalarDefinition && isKind(result, DefinitionKind.Scalar)) {
    result = Object.assign(result, ScalarDefinition(result as any));
  }
  if (EnumDefinition && isKind(result, DefinitionKind.Enum)) {
    result = Object.assign(result, EnumDefinition(result as any));
  }
  if (EnumRef && isKind(result, DefinitionKind.EnumRef)) {
    result = Object.assign(result, EnumRef(result as any));
  }
  if (ArrayDefinition && isKind(result, DefinitionKind.Array)) {
    result = Object.assign(result, ArrayDefinition(result as any));
  }
  if (PropertyDefinition && isKind(result, DefinitionKind.Property)) {
    result = Object.assign(result, PropertyDefinition(result as any));
  }
  if (MethodDefinition && isKind(result, DefinitionKind.Method)) {
    result = Object.assign(result, MethodDefinition(result as any));
  }
  if (ModuleDefinition && isKind(result, DefinitionKind.Module)) {
    result = Object.assign(result, ModuleDefinition(result as any));
  }
  if (InterfaceDefinition && isKind(result, DefinitionKind.Interface)) {
    result = Object.assign(result, InterfaceDefinition(result as any));
  }
  if (
    ImportedModuleDefinition &&
    isKind(result, DefinitionKind.ImportedModule)
  ) {
    result = Object.assign(result, ImportedModuleDefinition(result as any));
  }
  if (ImportedEnumDefinition && isKind(result, DefinitionKind.ImportedEnum)) {
    result = Object.assign(result, ImportedEnumDefinition(result as any));
  }
  if (
    ImportedObjectDefinition &&
    isKind(result, DefinitionKind.ImportedObject)
  ) {
    result = Object.assign(result, ImportedObjectDefinition(result as any));
  }
  if (
    InterfaceImplementedDefinition &&
    isKind(result, DefinitionKind.InterfaceImplemented)
  ) {
    result = Object.assign(
      result,
      InterfaceImplementedDefinition(result as any)
    );
  }
  if (EnvDefinition && isKind(result, DefinitionKind.Env)) {
    result = Object.assign(result, EnvDefinition(result as any));
  }
  if (ImportedEnvDefinition && isKind(result, DefinitionKind.ImportedEnv)) {
    result = Object.assign(result, ImportedEnvDefinition(result as any));
  }
  if (MapDefinition && isKind(result, DefinitionKind.Map)) {
    result = Object.assign(result, MapDefinition(result as any));
  }

  return result;
}
