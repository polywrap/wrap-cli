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
  isKind
} from "../typeInfo";

export * from "./extendType";
export * from "./addFirstLast";

export interface TypeInfoTransforms {
  enter?: TypeInfoTransformer;
  leave?: TypeInfoTransformer;
}

export interface TypeInfoTransformer {
  TypeInfo?:
    (typeInfo: TypeInfo) => TypeInfo
  GenericDefinition?:
    (def: GenericDefinition) => GenericDefinition;
  ObjectDefinition?:
    (def: ObjectDefinition) => ObjectDefinition;
  AnyDefinition?:
    (def: AnyDefinition) => AnyDefinition;
  ScalarDefinition?:
    (def: ScalarDefinition) => ScalarDefinition;
  PropertyDefinition?:
    (def: PropertyDefinition) => PropertyDefinition;
  ArrayDefinition?:
    (def: ArrayDefinition) => ArrayDefinition;
  MethodDefinition?:
    (def: MethodDefinition) => MethodDefinition;
  QueryDefinition?:
    (def: QueryDefinition) => QueryDefinition;
  ImportedQueryDefinition?:
    (def: ImportedQueryDefinition) => ImportedQueryDefinition;
  ImportedObjectDefinition?:
    (def: ImportedObjectDefinition) => ImportedObjectDefinition;
}

export function performTransforms(typeInfo: TypeInfo, transforms: TypeInfoTransforms): TypeInfo {
  let result = Object.assign({}, typeInfo);

  if (transforms.enter && transforms.enter.TypeInfo) {
    result = transforms.enter.TypeInfo(result);
  }

  for (let i = 0; i < result.userTypes.length; ++i) {
    result.userTypes[i] = visitObjectDefinition(
      result.userTypes[i], transforms
    );
  }

  for (let i = 0; i < result.queryTypes.length; ++i) {
    result.queryTypes[i] = visitQueryDefinition(
      result.queryTypes[i], transforms
    );
  }

  for (let i = 0; i < result.importedObjectTypes.length; ++i) {
    result.importedObjectTypes[i] = visitImportedObjectDefinition(
      result.importedObjectTypes[i], transforms
    );
  }

  for (let i = 0; i < result.importedQueryTypes.length; ++i) {
    result.importedQueryTypes[i] = visitImportedQueryDefinition(
      result.importedQueryTypes[i], transforms
    );
  }

  if (transforms.leave && transforms.leave.TypeInfo) {
    result = transforms.leave.TypeInfo(result);
  }

  return result;
}

function visitObjectDefinition(def: ObjectDefinition, transforms: TypeInfoTransforms): ObjectDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  for (let i = 0; i < result.properties.length; ++i) {
    result.properties[i] = visitPropertyDefinition(
      result.properties[i], transforms
    );
  }

  return transformType(result, transforms.leave);
}

function visitAnyDefinition(def: AnyDefinition, transforms: TypeInfoTransforms): AnyDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  if (result.array) {
    result.array = visitArrayDefinition(
      result.array, transforms
    );
  }

  if (result.scalar) {
    result.scalar = visitScalarDefinition(
      result.scalar, transforms
    );
  }

  return result;
}

function visitScalarDefinition(def: ScalarDefinition, transforms: TypeInfoTransforms): ScalarDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);
  return transformType(result, transforms.leave);
}

function visitArrayDefinition(def: ArrayDefinition, transforms: TypeInfoTransforms): ArrayDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  result = visitAnyDefinition(result, transforms) as any;

  if (result.item) {
    result.item = transformType(result.item, transforms.enter);
    result.item = transformType(result.item, transforms.leave);
  }

  return transformType(result, transforms.leave);
}

function visitPropertyDefinition(def: PropertyDefinition, transforms: TypeInfoTransforms): PropertyDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  result = visitAnyDefinition(result, transforms);

  return transformType(result, transforms.leave);
}

function visitMethodDefinition(def: MethodDefinition, transforms: TypeInfoTransforms): MethodDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  for (let i = 0; i < result.arguments.length; ++i) {
    result.arguments[i] = visitPropertyDefinition(
      result.arguments[i], transforms
    );
  }

  if (result.return) {
    result.return = visitPropertyDefinition(
      result.return, transforms
    );
  }

  return transformType(result, transforms.leave);
}

function visitQueryDefinition(def: QueryDefinition, transforms: TypeInfoTransforms): QueryDefinition {
  let result = Object.assign({}, def);
  result = transformType(result, transforms.enter);

  for (let i = 0; i < result.methods.length; ++i) {
    result.methods[i] = visitMethodDefinition(
      result.methods[i], transforms
    );
  }

  return transformType(result, transforms.leave);
}

function visitImportedQueryDefinition(def: ImportedQueryDefinition, transforms: TypeInfoTransforms): ImportedQueryDefinition {
  return visitQueryDefinition(def, transforms) as ImportedQueryDefinition;
}

function visitImportedObjectDefinition(def: ImportedObjectDefinition, transforms: TypeInfoTransforms): ImportedObjectDefinition {
  return visitObjectDefinition(def, transforms) as ImportedObjectDefinition;
}

function transformType<TDefinition extends GenericDefinition>(
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
    ArrayDefinition,
    PropertyDefinition,
    MethodDefinition,
    QueryDefinition,
    ImportedQueryDefinition,
    ImportedObjectDefinition
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
  if (ImportedObjectDefinition && isKind(result, DefinitionKind.ImportedObject)) {
    result = Object.assign(result, ImportedObjectDefinition(result as any));
  }

  return result;
}
