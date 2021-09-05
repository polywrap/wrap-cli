import { Uri } from "./Uri";
import { InvokableModules } from "./Invoke";

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

export interface GetDependenciesOptions {
  module?: InvokableModules;
  include?: DependencyType[];
  ignore?: DependencyType[];
}
