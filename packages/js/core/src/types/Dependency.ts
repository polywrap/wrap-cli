import { InvokableModules } from "./Invoke";

// This is copy/pasted from @web3api/schema-parse in order to avoid adding it as dependency. Thoughts?
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
  ImportedEnum = 1 << 9,
  ImportedObject = (1 << 10) | DefinitionKind.Object,
  InterfaceImplemented = 1 << 11,
  UnresolvedObjectOrEnum = 1 << 12,
  ObjectRef = 1 << 13,
  EnumRef = 1 << 14,
}

export interface GetDependenciesOptions {
  module?: InvokableModules;
  include?: DependencyType[];
  ignore?: DependencyType[];
}

export interface Dependency {
  uri: string;
  namespace: string;
  types: DependencyTypeDefinition[];
}

export interface DependencyTypeDefinition {
  name: string;
  type: DependencyType;
  interface: boolean;
}

export enum DependencyType {
  Object = "Object",
  Query = "Query",
  Enum = "Enum",
  Interface = "Interface",
}

export const kindToType = (kind: DefinitionKind): DependencyType => {
  switch (kind) {
    case DefinitionKind.ImportedObject:
      return DependencyType.Object;
    case DefinitionKind.ImportedQuery:
      return DependencyType.Query;
    case DefinitionKind.ImportedEnum:
      return DependencyType.Enum;
    default:
      throw Error("Unknown dependency type");
  }
};
