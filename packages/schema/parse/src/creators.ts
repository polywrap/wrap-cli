import { ArrayReference, EnumDefinition, EnvDefinition, Imported, MapReference, ModuleDefinition, ObjectDefinition, Scalar, ScalarDefinition } from "./definitions";

export const createScalarDefinition = (scalar: Scalar): ScalarDefinition => {
    return {
        kind: "Scalar",
        name: scalar,
    }
}

export const createObjectDefinition = (args: Omit<ObjectDefinition, "kind">): ObjectDefinition => {
    return {
        kind: "Object",
        ...args
    }
}

export const createImportedObjectDefinition = (args: Omit<ObjectDefinition & Imported, "kind">): ObjectDefinition & Imported => {
    return {
        kind: "Object",
        ...args
    }
}

export const createEnvDefinition = (args: Omit<EnvDefinition, "kind">): EnvDefinition => {
    return {
        kind: "Env",
        ...args
    }
}

export const createImportedEnvDefinition = (args: Omit<EnvDefinition & Imported, "kind">): EnvDefinition & Imported => {
    return {
        kind: "Env",
        ...args
    }
}

export const createEnumDefinition = (args: Omit<EnumDefinition, "kind">): EnumDefinition => {
    return {
        kind: "Enum",
        ...args
    }
}

export const createImportedEnumDefinition = (args: Omit<EnumDefinition & Imported, "kind">): EnumDefinition & Imported => {
    return {
        kind: "Enum",
        ...args
    }
}

export const createModuleDefinition = (args: Omit<ModuleDefinition, "kind">): ModuleDefinition => {
    return {
        kind: "Module",
        ...args
    }
}

export const createImportedModuleDefinition = (args: Omit<ModuleDefinition & Imported, "kind">): ModuleDefinition & Imported => {
    return {
        kind: "Module",
        ...args
    }
}

export const createMapReference = (args: Omit<MapReference, "kind">): MapReference => {
    return {
        kind: "Map",
        ...args
    }
}

export const createImportedMapReference = (args: Omit<MapReference & Imported, "kind">): MapReference & Imported => {
    return {
        kind: "Map",
        ...args
    }
}

export const createArrayReference = (args: Omit<ArrayReference, "kind">): ArrayReference => {
    return {
        kind: "Array",
        ...args
    }
}

export const createImportedArrayReference = (args: Omit<ArrayReference & Imported, "kind">): ArrayReference & Imported => {
    return {
        kind: "Array",
        ...args
    }
}