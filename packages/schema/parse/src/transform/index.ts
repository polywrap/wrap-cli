/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  TypeInfo,
  GenericDefinition,
  ObjectDefinition,
  AnyDefinition,
  ScalarDefinition,
  PropertyDefinition,
  ArrayDefinition,
  MethodDefinition,
  QueryDefinition,
  ImportedQueryDefinition,
  ImportedObjectDefinition,
  DefinitionKind,
  isKind,
  EnumDefinition,
  ImportedEnumDefinition,
  InterfaceImplementedDefinition,
  EnumRef,
  ObjectRef,
  InterfaceDefinition,
} from "../typeInfo";

export * from "./finalizePropertyDef";
export * from "./extendType";
export * from "./addFirstLast";
export * from "./interfaceUris";
export * from "./methodParentPointers";
export * from "./toGraphQLType";
export * from "./queryModuleCapabilities";

export interface TypeInfoTransforms {
  enter?: TypeInfoTransformer;
  leave?: TypeInfoTransformer;
}

export interface TypeInfoTransformer {
  TypeInfo?: (typeInfo: TypeInfo) => TypeInfo;
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
  QueryDefinition?: (def: QueryDefinition) => QueryDefinition;
  InterfaceDefinition?: (def: InterfaceDefinition) => InterfaceDefinition;
  ImportedEnumDefinition?: (
    def: ImportedEnumDefinition
  ) => ImportedEnumDefinition;
  ImportedQueryDefinition?: (
    def: ImportedQueryDefinition
  ) => ImportedQueryDefinition;
  ImportedObjectDefinition?: (
    def: ImportedObjectDefinition
  ) => ImportedObjectDefinition;
  InterfaceImplementedDefinition?: (
    def: InterfaceImplementedDefinition
  ) => InterfaceImplementedDefinition;
}

export function transformTypeInfo(
  typeInfo: TypeInfo,
  transforms: TypeInfoTransforms
): TypeInfo {
  let result = Object.assign({}, typeInfo);

  if (transforms.enter && transforms.enter.TypeInfo) {
    result = transforms.enter.TypeInfo(result);
  }

  for (let i = 0; i < result.interfaceTypes.length; ++i) {
    result.interfaceTypes[i] = visitInterfaceDefinition(
      result.interfaceTypes[i],
      transforms
    );
  }

  for (let i = 0; i < result.enumTypes.length; ++i) {
    result.enumTypes[i] = visitEnumDefinition(result.enumTypes[i], transforms);
  }

  for (let i = 0; i < result.objectTypes.length; ++i) {
    result.objectTypes[i] = visitObjectDefinition(
      result.objectTypes[i],
      transforms
    );
  }

  for (let i = 0; i < result.queryTypes.length; ++i) {
    result.queryTypes[i] = visitQueryDefinition(
      result.queryTypes[i],
      transforms
    );
  }

  for (let i = 0; i < result.importedObjectTypes.length; ++i) {
    result.importedObjectTypes[i] = visitImportedObjectDefinition(
      result.importedObjectTypes[i],
      transforms
    );
  }

  for (let i = 0; i < result.importedQueryTypes.length; ++i) {
    result.importedQueryTypes[i] = visitImportedQueryDefinition(
      result.importedQueryTypes[i],
      transforms
    );
  }

  for (let i = 0; i < result.importedEnumTypes.length; ++i) {
    result.importedEnumTypes[i] = visitImportedEnumDefinition(
      result.importedEnumTypes[i],
      transforms
    );
  }

  if (result.environment.query.client) {
    result.environment.query.client = visitObjectDefinition(
      result.environment.query.client,
      transforms
    );
  }

  if (result.environment.query.sanitized) {
    result.environment.query.sanitized = visitObjectDefinition(
      result.environment.query.sanitized,
      transforms
    );
  }

  if (result.environment.mutation.client) {
    result.environment.mutation.client = visitObjectDefinition(
      result.environment.mutation.client,
      transforms
    );
  }

  if (result.environment.mutation.sanitized) {
    result.environment.mutation.sanitized = visitObjectDefinition(
      result.environment.mutation.sanitized,
      transforms
    );
  }

  if (transforms.leave && transforms.leave.TypeInfo) {
    result = transforms.leave.TypeInfo(result);
  }

  return result;
}

export function visitObjectDefinition(
  def: ObjectDefinition,
  transforms: TypeInfoTransforms
): ObjectDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  for (let i = 0; i < result.properties.length; ++i) {
    result.properties[i] = visitPropertyDefinition(
      result.properties[i],
      transforms
    );
  }

  for (let i = 0; i < result.interfaces.length; ++i) {
    result.interfaces[i] = visitInterfaceImplementedDefinition(
      result.interfaces[i],
      transforms
    );
  }

  return transformType(result, transforms.leave);
}

export function visitObjectRef(
  def: ObjectRef,
  transforms: TypeInfoTransforms
): ObjectRef {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  return transformType(result, transforms.leave);
}

export function visitInterfaceImplementedDefinition(
  def: InterfaceImplementedDefinition,
  transforms: TypeInfoTransforms
): InterfaceImplementedDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  return transformType(result, transforms.leave);
}

export function visitAnyDefinition(
  def: AnyDefinition,
  transforms: TypeInfoTransforms
): AnyDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  if (result.array) {
    result.array = visitArrayDefinition(result.array, transforms);
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
  transforms: TypeInfoTransforms
): ScalarDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  return transformType(result, transforms.leave);
}

export function visitEnumDefinition(
  def: EnumDefinition,
  transforms: TypeInfoTransforms
): EnumDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  return transformType(result, transforms.leave);
}

export function visitEnumRef(
  def: EnumRef,
  transforms: TypeInfoTransforms
): EnumRef {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  return transformType(result, transforms.leave);
}

export function visitArrayDefinition(
  def: ArrayDefinition,
  transforms: TypeInfoTransforms
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
  transforms: TypeInfoTransforms
): PropertyDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  result = visitAnyDefinition(result, transforms);

  return transformType(result, transforms.leave);
}

export function visitMethodDefinition(
  def: MethodDefinition,
  transforms: TypeInfoTransforms
): MethodDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  for (let i = 0; i < result.arguments.length; ++i) {
    result.arguments[i] = visitPropertyDefinition(
      result.arguments[i],
      transforms
    );
  }

  if (result.return) {
    result.return = visitPropertyDefinition(result.return, transforms);
  }

  return transformType(result, transforms.leave);
}

export function visitQueryDefinition(
  def: QueryDefinition,
  transforms: TypeInfoTransforms
): QueryDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  for (let i = 0; i < result.methods.length; ++i) {
    result.methods[i] = visitMethodDefinition(result.methods[i], transforms);
  }

  return transformType(result, transforms.leave);
}

export function visitInterfaceDefinition(
  def: InterfaceDefinition,
  transforms: TypeInfoTransforms
): InterfaceDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  return transformType(result, transforms.leave);
}

export function visitImportedQueryDefinition(
  def: ImportedQueryDefinition,
  transforms: TypeInfoTransforms
): ImportedQueryDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  for (let i = 0; i < result.methods.length; ++i) {
    result.methods[i] = visitMethodDefinition(result.methods[i], transforms);
  }

  return transformType(result, transforms.leave);
}

export function visitImportedObjectDefinition(
  def: ImportedObjectDefinition,
  transforms: TypeInfoTransforms
): ImportedObjectDefinition {
  return visitObjectDefinition(def, transforms) as ImportedObjectDefinition;
}

export function visitImportedEnumDefinition(
  def: ImportedEnumDefinition,
  transforms: TypeInfoTransforms
): ImportedEnumDefinition {
  return visitEnumDefinition(def, transforms) as ImportedEnumDefinition;
}

export function transformType<TDefinition extends GenericDefinition>(
  type: TDefinition,
  transform?: TypeInfoTransformer
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
    QueryDefinition,
    InterfaceDefinition,
    ImportedEnumDefinition,
    ImportedQueryDefinition,
    ImportedObjectDefinition,
    InterfaceImplementedDefinition,
  } = transform;

  if (GenericDefinition && isKind(result, DefinitionKind.Generic)) {
    result = Object.assign(result, GenericDefinition(result));
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
  if (QueryDefinition && isKind(result, DefinitionKind.Query)) {
    result = Object.assign(result, QueryDefinition(result as any));
  }
  if (InterfaceDefinition && isKind(result, DefinitionKind.Interface)) {
    result = Object.assign(result, InterfaceDefinition(result as any));
  }
  if (ImportedQueryDefinition && isKind(result, DefinitionKind.ImportedQuery)) {
    result = Object.assign(result, ImportedQueryDefinition(result as any));
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

  return result;
}
