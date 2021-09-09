import { Uri } from "./Uri";
import { InvokableModules } from "./Invoke";

import { DefinitionKind } from "@web3api/schema-parse";

export interface GetDependenciesOptions {
  module?: InvokableModules;
  include?: DependencyType[];
  ignore?: DependencyType[];
}

export interface Dependency {
  uri: Uri | string;
  types: DependencyTypeDefinition[];
  namespace: string;
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
    case DefinitionKind.Object:
      return DependencyType.Object;
    case DefinitionKind.ImportedQuery:
      return DependencyType.Query;
    case DefinitionKind.Query:
      return DependencyType.Query;
    case DefinitionKind.ImportedEnum:
      return DependencyType.Enum;
    case DefinitionKind.Enum:
      return DependencyType.Enum;
    case DefinitionKind.InterfaceImplemented:
      return DependencyType.Interface;
    default:
      throw Error("Unknown dependency type");
  }
};
