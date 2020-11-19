export enum TypeDefinitionKind {
  Generic,
  Object,
  Any,
  Scalar,
  Array,
  Property,
  Method,
  Query,
  ImportedQuery,
  ImportedObject
}

export interface TypeDefinition {
  name: string,
  type: Maybe<string>,
  required: Maybe<boolean>
  kind: TypeDefinitionKind
}
export function createTypeDefinition(name: string, type?: string, required?: boolean): TypeDefinition {
  return {
    name,
    type,
    required,
    kind: TypeDefinitionKind.Generic
  }
}

export interface ObjectTypeDefinition extends TypeDefinition {
  properties: PropertyDefinition[];
}
export function createObjectTypeDefinition(name: string, type?: string, required?: boolean): ObjectTypeDefinition {
  return {
    name,
    type,
    required,
    properties: [],
    kind: TypeDefinitionKind.Object
  }
}

export interface AnyTypeDefinition extends TypeDefinition {
  array: Maybe<ArrayDefinition>;
  scalar: Maybe<ScalarDefinition>;
}
export function createAnyTypeDefinition(name: string, type?: string, required?: boolean, array?: ArrayDefinition, scalar?: ScalarDefinition): AnyTypeDefinition {
  return {
    name,
    type,
    required,
    array: array ? array : null,
    scalar: scalar ? scalar : null,
    kind: TypeDefinitionKind.Any
  }
}

export interface ScalarDefinition extends TypeDefinition {

}
export function createScalarDefinition(name: string, type?: string, required?: boolean): ScalarDefinition {
  return {
    name,
    type,
    required,
    kind: TypeDefinitionKind.Any
  }
}

export interface PropertyDefinition extends AnyTypeDefinition {
  
}
export function createPropertyDefinition(name: string, type?: string, required?: boolean, array?: ArrayDefinition, scalar?: ScalarDefinition): PropertyDefinition {
  return {
    name,
    type,
    required,
    array: array ? array : null,
    scalar: scalar ? scalar : null,
    kind: TypeDefinitionKind.Property
  }
}

export interface ArrayDefinition extends AnyTypeDefinition {
  item: Maybe<TypeDefinition>;
}
export function createArrayDefinition(name: string, type?: string, required?: boolean, array?: ArrayDefinition, scalar?: ScalarDefinition): ArrayDefinition {
  return {
    name,
    type,
    required,
    array: array ? array : null,
    scalar: scalar ? scalar : null,
    kind: TypeDefinitionKind.Array,
    item: undefined
  }
}

export interface MethodDefinition extends TypeDefinition {
  arguments: PropertyDefinition[];
  return: Maybe<PropertyDefinition>;
  operation: "query" | "mutation";
}

export function createMethodDefinition(operation: "query" | "mutation", name: string, type?: string, required?: boolean, args?: PropertyDefinition[], returnDef?: PropertyDefinition): MethodDefinition {
  return {
    name,
    type,
    required,
    arguments: args ? args : [],
    return: returnDef ? returnDef : null,
    operation,
    kind: TypeDefinitionKind.Method
  }
}

export interface QueryTypeDefinition extends TypeDefinition {
  methods: MethodDefinition[]
}
export function createQueryTypeDefinition(name: string, type?: string, required?: boolean): QueryTypeDefinition {
  return {
    name,
    type,
    required,
    methods: [],
    kind: TypeDefinitionKind.Query
  }
}

export interface ImportedQueryTypeDefinition extends QueryTypeDefinition {
  uri: string,
  namespace: string
}
export function createImportedQueryTypeDefinition(uri: string, namespace: string, name: string, type?: string, required?: boolean): ImportedQueryTypeDefinition {
  return {
    name,
    type,
    required,
    uri,
    namespace,
    methods: [],
    kind: TypeDefinitionKind.ImportedQuery
  }
}

export interface ImportedObjectTypeDefinition extends ObjectTypeDefinition {
  uri: string,
  namespace: string
}
export function createImportedObjectTypeDefinition(uri: string, namespace: string, name: string, type?: string, required?: boolean): ImportedObjectTypeDefinition {
  return {
    name,
    type,
    required,
    uri,
    namespace,
    properties: [],
    kind: TypeDefinitionKind.ImportedObject
  }
}
