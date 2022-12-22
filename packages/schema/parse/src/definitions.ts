//TODO: interfaces and capabilities

export const SUPPORTED_SCALARS = [
    "UInt",
    "UInt8",
    "UInt16",
    "UInt32",
    "Int",
    "Int8",
    "Int16",
    "Int32",
    "String",
    "Boolean",
    "Bytes",
    "BigInt",
    "BigNumber",
    "JSON",
] as const

export type Scalar = typeof SUPPORTED_SCALARS[number];

export const SUPPORTED_MAP_KEYS = [
    "UInt",
    "UInt8",
    "UInt16",
    "UInt32",
    "Int",
    "Int8",
    "Int16",
    "Int32",
    "String"
] as const

export type MapKeyType = typeof SUPPORTED_MAP_KEYS[number];

export interface Definition {
    name: string;
    kind: string;
    comment?: string;
}

export interface Imported {
    uri: "test-interface.eth",
    namespace: "Interface",
    imported: true;
}

export type Reference = {
    kind: "Scalar" | "Object" | "Enum"
    required: boolean
    type: string
} | ArrayReference | MapReference

export interface ArrayReference {
    kind: "Array"
    definition: ArrayDefinition
    required: boolean
}

export interface MapReference {
    kind: "Map"
    definition: MapDefinition
    required: boolean
}

// Definitions

export interface ScalarDefinition extends Definition {
    kind: "Scalar";
    name: Scalar;
}

export interface ObjectDefinition extends Definition {
    kind: "Object";
    properties: ObjectProperty[]
}

export interface EnvDefinition extends Definition {
    kind: "Env";
    properties: ObjectProperty[]
}

export interface EnumDefinition extends Definition {
    kind: "Enum";
    constants: string[];
}

export interface MethodDefinition extends Definition {
    kind: "Method";
    arguments: MethodArgument[];
    env?: {
        required?: boolean
    };
    return: Reference
}

export interface ModuleDefinition extends Definition {
    kind: "Module"
    methods: MethodDefinition[]
}

// Special cases: References with embedded definitions

export interface MapDefinition extends Definition {
    name: ""
    kind: "Map",
    keys: {
        kind: "Scalar"
        required: boolean
        type: string
    },
    values: Reference
}

export interface ArrayDefinition extends Definition {
    name: ""
    kind: "Array"
    items: Reference;
}

// Helpers

export interface ObjectProperty {
    comment?: string;
    name: string;
    type: Reference
}

export interface MethodArgument {
    name: string;
    type: Reference;
}

// Exports

export interface WrapManifest {
    version: "0.1.0" | "0.1";
    type: "wasm" | "interface" | "plugin";
    name: string;
    abi: Abi;
}

export interface Abi {
    version: "0.1";
    objectTypes: ObjectDefinition[];
    moduleType?: ModuleDefinition;
    enumTypes: EnumDefinition[];
    importedObjectTypes: (ObjectDefinition & Imported)[];
    importedModuleTypes: (ModuleDefinition & Imported)[];
    importedEnumTypes: (EnumDefinition & Imported)[];
    importedEnvTypes: (EnvDefinition & Imported)[];
    envType?: EnvDefinition;
}