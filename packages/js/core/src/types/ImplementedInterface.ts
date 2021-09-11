export interface GetImplementedInterfacesOptions {
  ignore?: ImplementedType;
}

export interface ImplementedInterface {
  type: string;
  interfaces: Interface[];
}

export enum ImplementedType {
  Object = "Object",
  Query = "Query",
}

export interface Interface {
  uri: string;
  type: string;
  namespace: string;
}
