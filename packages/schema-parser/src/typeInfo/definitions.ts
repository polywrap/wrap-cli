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
  type: Maybe<string>;
  required: Maybe<boolean>;
  kind: DefinitionKind;
}
export function createGenericDefinition(name: string, type?: string, required?: boolean): GenericDefinition {
  return {
    name,
    type,
    required,
    kind: DefinitionKind.Generic
  }
}

export interface ObjectDefinition extends GenericDefinition {
  properties: PropertyDefinition[];
}
export function createObjectDefinition(name: string, type?: string, required?: boolean): ObjectDefinition {
  return {
    name,
    type,
    required,
    properties: [],
    kind: DefinitionKind.Object
  }
}

export interface AnyDefinition extends GenericDefinition {
  array: Maybe<ArrayDefinition>;
  scalar: Maybe<ScalarDefinition>;
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
    type,
    required,
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
    type,
    required,
    kind: DefinitionKind.Any
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
    type,
    required,
    array: array ? array : null,
    scalar: scalar ? scalar : null,
    kind: DefinitionKind.Property
  }
}

export interface ArrayDefinition extends AnyDefinition {
  item: Maybe<GenericDefinition>;
}
export function createArrayDefinition(
  name: string,
  type?: string,
  required?: boolean,
  array?: ArrayDefinition,
  scalar?: ScalarDefinition
): ArrayDefinition {
  return {
    name,
    type,
    required,
    array: array ? array : null,
    scalar: scalar ? scalar : null,
    kind: DefinitionKind.Array,
    item: undefined
  }
}

export type Operation = "query" | "mutation";

export interface MethodDefinition extends GenericDefinition {
  arguments: PropertyDefinition[];
  return: Maybe<PropertyDefinition>;
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
    type,
    required,
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
    type,
    required,
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
    type,
    required,
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
    type,
    required,
    uri,
    namespace,
    properties: [],
    kind: DefinitionKind.ImportedObject
  }
}
