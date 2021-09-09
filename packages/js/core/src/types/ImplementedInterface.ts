import { Uri } from "./Uri";
import { DependencyType } from "./Dependency";

export interface GetImplementedInterfacesOptions {
  ignore?: ImplementedType;
}

export interface ImplementedInterface {
  type: ImplementedType;
  interfaces: Interface[];
}

export enum ImplementedType {
  Object = "Object",
  Query = "Query",
}

export interface Interface {
  uri: Uri | string;
  type: DependencyType;
  namespace: string;
}
