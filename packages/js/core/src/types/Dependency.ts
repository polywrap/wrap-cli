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
  Object,
  Query,
  Enum,
  Interface,
}

export interface GetDependenciesOptions {
  uri: Uri | string;
  module?: InvokableModules;
  include?: DependencyType | DependencyType[]
  ignore?: DependencyType | DependencyType[]
}