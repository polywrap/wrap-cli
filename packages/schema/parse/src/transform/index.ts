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
} from "../typeInfo";

export * from "./finalizePropertyDef";
export * from "./extendType";
export * from "./addFirstLast";
export * from "./toGraphQLType";

export interface TypeInfoTransforms {
  enter?: TypeInfoTransformer;
  leave?: TypeInfoTransformer;
}

export interface TypeInfoTransformer {
  TypeInfo?: (typeInfo: TypeInfo) => TypeInfo;
  GenericDefinition?: (def: GenericDefinition) => GenericDefinition;
  ObjectDefinition?: (def: ObjectDefinition) => ObjectDefinition;
  AnyDefinition?: (def: AnyDefinition) => AnyDefinition;
  ScalarDefinition?: (def: ScalarDefinition) => ScalarDefinition;
  EnumDefinition?: (def: EnumDefinition) => EnumDefinition;
  PropertyDefinition?: (def: PropertyDefinition) => PropertyDefinition;
  ArrayDefinition?: (def: ArrayDefinition) => ArrayDefinition;
  MethodDefinition?: (def: MethodDefinition) => MethodDefinition;
  QueryDefinition?: (def: QueryDefinition) => QueryDefinition;
  ImportedEnumDefinition?: (
    def: ImportedEnumDefinition
  ) => ImportedEnumDefinition;
  ImportedQueryDefinition?: (
    def: ImportedQueryDefinition
  ) => ImportedQueryDefinition;
  ImportedObjectDefinition?: (
    def: ImportedObjectDefinition
  ) => ImportedObjectDefinition;
}

export function performTransforms(
  typeInfo: TypeInfo,
  transforms: TypeInfoTransforms
): TypeInfo {
  let result = Object.assign({}, typeInfo);

  if (transforms.enter && transforms.enter.TypeInfo) {
    result = transforms.enter.TypeInfo(result);
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
    result.object = visitObjectDefinition(result.object, transforms);
  }

  if (result.enum) {
    result.enum = visitEnumDefinition(result.enum, transforms);
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
    AnyDefinition,
    ScalarDefinition,
    EnumDefinition,
    ArrayDefinition,
    PropertyDefinition,
    MethodDefinition,
    QueryDefinition,
    ImportedEnumDefinition,
    ImportedQueryDefinition,
    ImportedObjectDefinition,
  } = transform;

  if (GenericDefinition && isKind(result, DefinitionKind.Generic)) {
    result = Object.assign(result, GenericDefinition(result));
  }
  if (ObjectDefinition && isKind(result, DefinitionKind.Object)) {
    result = Object.assign(result, ObjectDefinition(result as any));
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

  return result;
}
