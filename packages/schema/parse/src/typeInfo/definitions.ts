export enum DefinitionKind {
  Generic = 0,
  Object = 1 << 0,
  Any = 1 << 1,
  Scalar = 1 << 2,
  Array = (1 << 3) | DefinitionKind.Any,
  Property = (1 << 4) | DefinitionKind.Any,
  Method = 1 << 5,
  Query = 1 << 6,
  ImportedQuery = (1 << 7) | DefinitionKind.Query,
  ImportedObject = (1 << 8) | DefinitionKind.Object
}

export function isKind(type: GenericDefinition, kind: DefinitionKind) {
  return (type.kind & kind) === kind;
}

export interface GenericDefinition {
  name: string;
  type: string | null;
  required: boolean | null;
  kind: DefinitionKind;
}
export function createGenericDefinition(name: string, type?: string, required?: boolean): GenericDefinition {
  return {
    name,
    type: type ? type : null,
    required: required ? required : null,
    kind: DefinitionKind.Generic
  }
}

export interface ObjectDefinition extends GenericDefinition {
  properties: PropertyDefinition[];
}
export function createObjectDefinition(name: string, type?: string, required?: boolean): ObjectDefinition {
  return {
    name,
    type: type ? type : null,
    required: required ? required : null,
    properties: [],
    kind: DefinitionKind.Object
  }
}

export interface AnyDefinition extends GenericDefinition {
  array: ArrayDefinition | null;
  scalar: ScalarDefinition | null;
}
export function createAnyDefinition(
  name: string,
  type?: string,
  required?: boolean,
  array?: ArrayDefinition,
  scalar?: ScalarDefinition
): AnyDefinition {
  return {
    name,
    type: type ? type : null,
    required: required ? required : null,
    array: array ? array : null,
    scalar: scalar ? scalar : null,
    kind: DefinitionKind.Any
  }
}

export interface ScalarDefinition extends GenericDefinition {

}
export function createScalarDefinition(name: string, type?: string, required?: boolean): ScalarDefinition {
  return {
    name,
    type: type ? type : null,
    required: required ? required : null,
    kind: DefinitionKind.Scalar
  }
}

export interface ArrayDefinition extends AnyDefinition {
  item: GenericDefinition | null;
}
export function createArrayDefinition(
  name: string,
  type?: string,
  required?: boolean,
  item?: GenericDefinition
): ArrayDefinition {
  return {
    name,
    type: type ? type : null,
    required: required ? required : null,
    array: item && isKind(item, DefinitionKind.Array) ? item as ArrayDefinition : null,
    scalar: item && isKind(item, DefinitionKind.Scalar) ? item as ScalarDefinition : null,
    kind: DefinitionKind.Array,
    item: item ? item : null
  }
}

export interface PropertyDefinition extends AnyDefinition {

}
export function createPropertyDefinition(
  name: string,
  type?: string,
  required?: boolean,
  array?: ArrayDefinition,
  scalar?: ScalarDefinition
): PropertyDefinition {
  return {
    name,
    type: type ? type : null,
    required: required ? required : null,
    array: array ? array : null,
    scalar: scalar ? scalar : null,
    kind: DefinitionKind.Property
  }
}

export function createScalarPropertyDefinition(name: string, type: string, required: boolean): PropertyDefinition {
  return createPropertyDefinition(
    name, type, required, undefined,
    createScalarDefinition(name, type, required)
  )
}

export function createArrayPropertyDefinition(name: string, type: string, required: boolean, item: GenericDefinition): PropertyDefinition {
  return createPropertyDefinition(
    name, type, required,
    createArrayDefinition(
      name, type, required, item
    ), undefined
  );
}

export type Operation = "query" | "mutation";

export interface MethodDefinition extends GenericDefinition {
  arguments: PropertyDefinition[];
  return: PropertyDefinition | null;
  operation: Operation;
}

export function createMethodDefinition(
  operation: Operation,
  name: string,
  type?: string,
  required?: boolean,
  args?: PropertyDefinition[],
  returnDef?: PropertyDefinition
): MethodDefinition {
  return {
    name,
    type: type ? type : null,
    required: required ? required : null,
    arguments: args ? args : [],
    return: returnDef ? returnDef : null,
    operation,
    kind: DefinitionKind.Method
  }
}

export interface QueryDefinition extends GenericDefinition {
  methods: MethodDefinition[];
}
export function createQueryDefinition(name: string, type?: string, required?: boolean): QueryDefinition {
  return {
    name,
    type: type ? type : null,
    required: required ? required : null,
    methods: [],
    kind: DefinitionKind.Query
  }
}

export interface ImportedQueryDefinition extends QueryDefinition {
  uri: string;
  namespace: string;
}
export function createImportedQueryDefinition(
  uri: string,
  namespace: string,
  name: string,
  type?: string,
  required?: boolean
): ImportedQueryDefinition {
  return {
    name,
    type: type ? type : null,
    required: required ? required : null,
    uri,
    namespace,
    methods: [],
    kind: DefinitionKind.ImportedQuery
  }
}

export interface ImportedObjectDefinition extends ObjectDefinition {
  uri: string;
  namespace: string;
}
export function createImportedObjectDefinition(
  uri: string,
  namespace: string,
  name: string,
  type?: string,
  required?: boolean
): ImportedObjectDefinition {
  return {
    name,
    type: type ? type : null,
    required: required ? required : null,
    uri,
    namespace,
    properties: [],
    kind: DefinitionKind.ImportedObject
  }
}
