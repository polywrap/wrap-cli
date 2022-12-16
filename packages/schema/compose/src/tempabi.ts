/* eslint-disable @typescript-eslint/naming-convention */
/* tslint:disable */

export type ObjectDefinition = GenericDefinition &
  WithComment & {
    properties?: PropertyDefinition[];
    interfaces?: InterfaceImplementedDefinition[];
  };
export type GenericDefinition = WithKind & {
  type: string;
  name?: string;
  required?: boolean;
};
export type PropertyDefinition = WithComment & AnyDefinition;
export type AnyDefinition = GenericDefinition & {
  array?: ArrayDefinition;
  scalar?: ScalarDefinition;
  map?: MapDefinition;
  object?: ObjectRef;
  enum?: EnumRef;
  unresolvedObjectOrEnum?: UnresolvedObjectOrEnumRef;
};
export type ArrayDefinition = AnyDefinition & {
  item?: GenericDefinition;
};
export type ScalarDefinition = GenericDefinition & {
  type:
    | "UInt"
    | "UInt8"
    | "UInt16"
    | "UInt32"
    | "Int"
    | "Int8"
    | "Int16"
    | "Int32"
    | "String"
    | "Boolean"
    | "Bytes"
    | "BigInt"
    | "BigNumber"
    | "JSON";
};
export type MapDefinition = AnyDefinition &
  WithComment & {
    key?: MapKeyDefinition;
    value?: GenericDefinition;
  };
export type MapKeyDefinition = AnyDefinition & {
  type?: "UInt" | "UInt8" | "UInt16" | "UInt32" | "Int" | "Int8" | "Int16" | "Int32" | "String";
};
export type ObjectRef = GenericDefinition;
export type EnumRef = GenericDefinition;
export type UnresolvedObjectOrEnumRef = GenericDefinition;
export type InterfaceImplementedDefinition = GenericDefinition;
export type ModuleDefinition = GenericDefinition &
  WithComment & {
    methods?: MethodDefinition[];
    imports?: ImportedModuleRef[];
    interfaces?: InterfaceImplementedDefinition[];
  };
export type MethodDefinition = GenericDefinition &
  WithComment & {
    arguments?: PropertyDefinition[];
    env?: {
      required?: boolean;
    };
    return?: PropertyDefinition;
  };
export type EnumDefinition = GenericDefinition &
  WithComment & {
    constants?: string[];
  };
export type InterfaceDefinition = GenericDefinition &
  ImportedDefinition & {
    capabilities?: CapabilityDefinition;
  };
export type ImportedObjectDefinition = ObjectDefinition & ImportedDefinition & WithComment;
export type ImportedModuleDefinition = GenericDefinition &
  ImportedDefinition &
  WithComment & {
    methods?: MethodDefinition[];
    isInterface?: boolean;
  };
export type ImportedEnumDefinition = EnumDefinition & ImportedDefinition;
export type ImportedEnvDefinition = ImportedObjectDefinition;
export type EnvDefinition = ObjectDefinition;

export interface WrapManifest {
  /**
   * WRAP Standard Version
   */
  version: "0.1.0" | "0.1";
  /**
   * Wrapper Package Type
   */
  type: "wasm" | "interface" | "plugin";
  /**
   * Wrapper Name
   */
  name: string;
  abi: Abi;
}
/**
 * Information of modules
 */
export interface Abi {
  /**
   * ABI Version
   */
  version?: "0.1";
  types?: {
    objectTypes?: ObjectDefinition[];
    moduleType?: ModuleDefinition;
    enumTypes?: EnumDefinition[];
    interfaceTypes?: InterfaceDefinition[];
    envType?: EnvDefinition;
  }
  importTypes?: {
    importedObjectTypes?: ImportedObjectDefinition[];
    importedModuleTypes?: ImportedModuleDefinition[];
    importedEnumTypes?: ImportedEnumDefinition[];
    importedEnvTypes?: ImportedEnvDefinition[];
  }
}
export interface WithKind {
  kind: number;
}
export interface WithComment {
  comment?: string;
}
export interface ImportedModuleRef {
  type?: string;
}
export interface ImportedDefinition {
  uri: string;
  namespace: string;
  nativeType: string;
}
export interface CapabilityDefinition {
  getImplementations?: {
    enabled: boolean;
  };
}
