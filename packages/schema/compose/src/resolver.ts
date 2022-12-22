import { createImportedEnumDefinition, createImportedEnvDefinition, createImportedModuleDefinition, createImportedObjectDefinition, DefinitionKind, visitEnumDefinition, visitEnvDefinition, visitModuleDefinition, visitObjectDefinition } from "@polywrap/schema-parse";
import { EnumDefinition, EnvDefinition, GenericDefinition, ImportedEnumDefinition, ImportedEnvDefinition, ImportedModuleDefinition, ImportedObjectDefinition, ModuleDefinition, ObjectDefinition, WrapAbi } from "@polywrap/wrap-manifest-types-js";

type UriStr = string;
interface ImportStatement {
    typeNames: string[]
}

type ExternalImportStatement = ImportStatement & Namespaced

interface Namespaced {
    __namespaced?: boolean;
    uri: UriStr;
    namespace: string;
}

type ResolvedType = (ImportedModuleDefinition | ImportedObjectDefinition | ImportedEnumDefinition | ImportedEnvDefinition) & Namespaced;

type ImportMap = Map<
    string, ResolvedType
>;

type ImportDefWithKind = {
    extDefinition: ImportedModuleDefinition,
    kind: "ImportedModule"
} | {
    extDefinition: ImportedEnvDefinition,
    kind: "ImportedEnv"
} | {
    extDefinition: ImportedObjectDefinition,
    kind: "ImportedObject"
} | {
    extDefinition: ImportedEnumDefinition,
    kind: "ImportedEnum"
}

type LocalDefWithKind = {
    extDefinition: ModuleDefinition,
    kind: "Module"
} | {
    extDefinition: EnvDefinition,
    kind: "Env"
} | {
    extDefinition: ObjectDefinition,
    kind: "Object"
} | {
    extDefinition: EnumDefinition,
    kind: "Enum"
}

type ExternalDefinitionWithKind = ImportDefWithKind | LocalDefWithKind


export abstract class ImportsResolver<TImportStatement extends ImportStatement> {
    constructor(protected mainAbi: WrapAbi, protected imports: TImportStatement[], protected importAbis: Map<UriStr, WrapAbi>) { }

    protected determineKind(importAbi: WrapAbi, importType: string): ExternalDefinitionWithKind {
        const extObj = importAbi.objectTypes?.find(def => def.type == importType)
        if (extObj) {
            return { extDefinition: extObj, kind: "Object" }
        }

        const extImportObj = importAbi.importedObjectTypes?.find(def => def.type == importType);
        if (extImportObj) {
            return { extDefinition: extImportObj, kind: "ImportedObject" }
        }

        const extEnum = importAbi.enumTypes?.find(def => def.type == importType);
        if (extEnum) {
            return { extDefinition: extEnum, kind: "Enum" }
        }

        const extImportEnum = importAbi.importedEnumTypes?.find(def => def.type == importType);
        if (extImportEnum) {
            return { extDefinition: extImportEnum, kind: "ImportedEnum" }
        }

        const extModule = importAbi.moduleType;
        if (extModule && extModule.type == importType) {
            return { extDefinition: extModule, kind: "Module" }
        }

        const extModuleImport = importAbi.importedModuleTypes?.find(def => def.type == importType);
        if (extModuleImport) {
            return { extDefinition: extModuleImport, kind: "ImportedModule" }
        }

        const extEnv = importAbi.envType;
        if (extEnv && extEnv.type == importType) {
            return { extDefinition: extEnv, kind: "Env" }
        }

        const extImportEnv = importAbi.importedEnvTypes?.find(def => def.type == importType);
        if (extImportEnv) {
            return { extDefinition: extImportEnv, kind: "ImportedEnv" }
        }

        throw new Error(`Could not determine kind of imported type '${importType}'`)
    }

    // private copyAllDefinitions(importAbi: WrapAbi) {
    //     if (importAbi) {
    //         this.mainAbi.importedEnumTypes = this.mainAbi.importedEnumTypes?.concat(importAbi.enumTypes ?? [])
    //     }
    // }

    protected namespaceResolvedType(unnamespacedResolvedType: ResolvedType, uri: UriStr, namespace: string): ResolvedType {
        // TODO: more performant way of doing it?
        const objectCopy = JSON.parse(JSON.stringify(unnamespacedResolvedType)) as ResolvedType;

        objectCopy.namespace = namespace;
        objectCopy.uri = uri;
        objectCopy.type = `${namespace}_${objectCopy.type}`;

        return objectCopy
    }

    protected _resolveImport(importAbi: WrapAbi, importType: string): { unnamespacedResolvedType: ResolvedType; visitor: Function } {
        const extDefWithKind = this.determineKind(importAbi, importType)
        // TODO: Namespace and Uri in TrueType

        switch (extDefWithKind.kind) {
            case "Object":
            case "ImportedObject":
                return {
                    unnamespacedResolvedType: {
                        ...createImportedObjectDefinition({
                            ...extDefWithKind.extDefinition,
                            type: importType,
                            name: undefined,
                            required: undefined,
                            nativeType: extDefWithKind.extDefinition.type,
                            uri: "",
                            namespace: ""
                        }),
                        properties: extDefWithKind.extDefinition.properties,
                    },

                    visitor: visitObjectDefinition
                };
            case "Enum":
            case "ImportedEnum":
                return {
                    unnamespacedResolvedType: createImportedEnumDefinition({
                        ...extDefWithKind.extDefinition,
                        type: importType,
                        name: undefined,
                        required: undefined,
                        nativeType: extDefWithKind.extDefinition.type,
                        uri: "",
                        namespace: ""
                    }),
                    visitor: visitEnumDefinition
                };
            case "Module":
                return {
                    unnamespacedResolvedType: {
                        ...createImportedModuleDefinition({
                            ...extDefWithKind.extDefinition,
                            required: undefined,
                            nativeType: extDefWithKind.extDefinition.type,
                            uri: "",
                            namespace: "",
                        }),
                        methods: extDefWithKind.extDefinition.methods,
                    },
                    visitor: visitModuleDefinition
                };
            case "Env":
                return {
                    unnamespacedResolvedType: {
                        ...createImportedEnvDefinition({
                            ...extDefWithKind.extDefinition,
                            name: undefined,
                            required: undefined,
                            nativeType: extDefWithKind.extDefinition.type,
                            uri: "",
                            namespace: "",
                        }),
                        properties: extDefWithKind.extDefinition.properties,
                    },
                    visitor: visitEnvDefinition
                };
            case "ImportedModule":
            case "ImportedEnv":
                throw new Error(`Cannot import an import's imported ${extDefWithKind.kind}. Tried to import ${importType}`)
        }
    }


    abstract resolveImportsStatement(importStatement: TImportStatement): ImportMap;


    // TODO: Add all imported types into the aggregate Abi
}

export class ExternalImportsResolver extends ImportsResolver<ExternalImportStatement> {
    protected extractDependencyTypes(importAbi: WrapAbi, genericDefinition: GenericDefinition): GenericDefinition[] {

        switch (genericDefinition.kind) {
            case DefinitionKind.Scalar:
                return [];
            case DefinitionKind.ObjectRef:
                return []
            case DefinitionKind.EnumRef:
                return [genericDefinition];
            case DefinitionKind.Object:
            case DefinitionKind.ImportedObject:
                return [genericDefinition, ...(genericDefinition as ObjectDefinition).properties?.map(p => this.extractDependencyTypes(importAbi, p))]
        }
    }

    protected extractDeps(resolvedType: ResolvedType, extracted: ResolvedType[] = []) {
        switch (resolvedType.kind) {
            case DefinitionKind.Scalar:
                return []
            case DefinitionKind.Object:
            case DefinitionKind.ImportedObject:
                const abi = this.importAbis.get(resolvedType.uri);

                (resolvedType as ObjectDefinition).properties?.forEach(property => {

                })

                const objectDef = abi?.objectTypes?.find(obj => obj.type === resolvedType.nativeType);
                objectDef?.properties?.forEach(property => {

                })

                if 

                const importObjectDef = abi?.importedObjectTypes?.find(obj => obj.type === resolvedType.nativeType)

                if (importObjectDef) {
                    this.extractDeps(importObjectDef)
                }
        }
    }

    resolveImportsStatement(importStatatement: ExternalImportStatement): ImportMap {
        const { uri, namespace, typeNames } = importStatatement;
        const importAbi = this.importAbis.get(uri);
        const typesToImport: ImportMap = new Map()

        if (!importAbi) {
            throw Error(`Unable to resolve abi at "${uri}"`);
        }

        if (typeNames.includes("*")) {
            // TODO
        }

        for (const typeName of typeNames) {
            const { visitor, unnamespacedResolvedType } = this._resolveImport(importAbi, typeName)

            // TODO: EXTERNAL IMPORTS ONLY

            const namespacedResolvedType = this.namespaceResolvedType(unnamespacedResolvedType, uri, namespace)


            //TODO: continue if we already imported it?

            typesToImport.set(namespacedResolvedType.type, namespacedResolvedType)

            visitor(namespacedResolvedType, extractImportDependencies())
        }

        return typesToImport;
    }
}