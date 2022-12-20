//TODO: interfaces and capabilities

export interface Definition {
    name: string;
    kind: string;
    comment?: string;
}

export interface ImportedDefinition {
    uri: "test-interface.eth",
    namespace: "Interface",
    imported: true;
}

export interface Reference {
    definition: Definition;
    required: boolean
}

// Definitions

export interface ScalarDefinition extends Definition {
    kind: "Scalar";
    name: "UInt"
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

// References

export interface MapReference extends Reference {
    keys: Reference,
    values: Reference
}

export interface ArrayReference extends Reference {
    items: Reference;
}

// Helpers

export interface ObjectProperty {
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
    importedObjectTypes: (ObjectDefinition & ImportedDefinition)[];
    importedModuleTypes: (ModuleDefinition & ImportedDefinition)[];
    importedEnumTypes: (EnumDefinition & ImportedDefinition)[];
    importedEnvTypes: (EnvDefinition & ImportedDefinition)[];
    envType?: EnvDefinition;
}