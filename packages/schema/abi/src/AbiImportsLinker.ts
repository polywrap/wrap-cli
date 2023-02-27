import { IAbiMerger } from "./AbiMerger";
import { IAbiTreeShaker } from "./AbiTreeShaker";

import { Abi, ExternalImportStatement, ExternalSchemaFetcher, ImportedAbi, LocalImportStatement, LocalSchemaFetcher, SchemaParser, UniqueDefKind } from "@polywrap/abi-types"
import { AbiVisitor } from "./AbiVisitor";
import { LinkerVisitor } from "./LinkerVisitor";

export interface IAbiImportsLinker {
  link: (rootAbi: Abi, importStatements?: {
    local: LocalImportStatement[];
    external: ExternalImportStatement[];
  }) => Promise<Abi>
}

export class AbiImportsLinker implements IAbiImportsLinker {
  constructor(protected _schemaParser: SchemaParser, protected _fetchers: {
    external: ExternalSchemaFetcher;
    local: LocalSchemaFetcher;
  }, protected _abiMerger: IAbiMerger, protected _abiTreeShaker: IAbiTreeShaker) { }

  async embedExternalImports(rootAbi: Abi | ImportedAbi, extImportStatements: ExternalImportStatement[]) {
    let abiClone: Abi | ImportedAbi = JSON.parse(JSON.stringify(rootAbi));

    for await (const extImportStatement of extImportStatements) {
      const externalAbi = await this._fetchers.external.fetch(extImportStatement.uriOrPath);
      const importedAbi: ImportedAbi = {
        objects: externalAbi.objects,
        enums: externalAbi.enums,
        functions: externalAbi.functions,
        imports: externalAbi.imports,
        namespace: extImportStatement.namespace,
        id: extImportStatement.namespace,
        uri: extImportStatement.uriOrPath,
        // TODO: how to get this?
        type: "wasm"
      }
      abiClone.imports = abiClone.imports ? [...abiClone.imports, importedAbi] : [importedAbi]
    }

    return abiClone
  }

  async mergeLocalImports(rootAbi: Abi | ImportedAbi, localImportStatements: LocalImportStatement[]): Promise<{
    abi: Abi | ImportedAbi,
    transitiveExternalImports: ExternalImportStatement[]
  }> {
    let mergedAbi: Abi | ImportedAbi = JSON.parse(JSON.stringify(rootAbi))
    const transitiveExternalImports: ExternalImportStatement[] = []

    for await (const localImportStatement of localImportStatements) {
      const localSchema = await this._fetchers.local.fetch(localImportStatement.uriOrPath);
      const localAbi = await this._schemaParser.parse(localSchema)
      const localShakenAbi = await this._abiTreeShaker.shakeTree(localAbi, localImportStatement.importedTypes)

      const transitiveExtImports = await this._schemaParser.parseExternalImportStatements(localSchema)
      transitiveExternalImports.push(...transitiveExtImports)

      const transitiveLocalImports = await this._schemaParser.parseLocalImportStatements(localSchema)
      const subResult = await this.mergeLocalImports(localShakenAbi, transitiveLocalImports)
      mergedAbi = this._abiMerger.merge(mergedAbi as Abi, [subResult.abi])
      transitiveExternalImports.push(...subResult.transitiveExternalImports)
    }

    return {
      abi: mergedAbi,
      transitiveExternalImports
    }
  }

  mapImportsToNamespacePaths(rootAbi: Abi): Map<string, { abi: ImportedAbi, absoluteIdPath: string }> {
    const importMap = new Map<string, { abi: ImportedAbi, absoluteIdPath: string }>()
    const state: { currentNamespacePath: string[]; currentIdPath: string[] } = {
      currentNamespacePath: [],
      currentIdPath: []
    }

    const importVisitor = new AbiVisitor({
      enter: {
        Import: (importAbi) => {
          state.currentNamespacePath.push(importAbi.namespace)
          state.currentIdPath.push(importAbi.id)
          importMap.set(state.currentNamespacePath.join("_"), { abi: importAbi, absoluteIdPath: state.currentIdPath.join(".") })
          return importAbi
        }
      },
      leave: {
        Import: (importAbi) => {
          state.currentNamespacePath.pop()
          state.currentIdPath.pop()
          return importAbi
        },
      }
    })

    importVisitor.visit(rootAbi)
    return importMap
  }

  getUniqueDefinitionsMap(abi: Abi): Map<string, UniqueDefKind> {
    const uniqueDefinitionsMap = new Map<string, UniqueDefKind>()

    const uniqueDefVisitor = new AbiVisitor({
      enter: {
        EnumDef: (enumDef) => {
          uniqueDefinitionsMap.set(enumDef.name, "Enum")
          return enumDef
        },
        ObjectDef: (objectDef) => {
          uniqueDefinitionsMap.set(objectDef.name, "Object")
          return objectDef
        },
        FunctionDef: (functionDef) => {
          uniqueDefinitionsMap.set(functionDef.name, "Function")
          return functionDef
        }
      }
    })

    uniqueDefVisitor.visit(abi)
    return uniqueDefinitionsMap
  }

  linkImportReferences(rootAbi: Abi): Abi {
    const abiClone = JSON.parse(JSON.stringify(rootAbi))
    const rootAbiUniqueDefsMap = this.getUniqueDefinitionsMap(rootAbi)
    const importMap = this.mapImportsToNamespacePaths(rootAbi)

    const linkVisitor = new LinkerVisitor({
      enter: {
        UnlinkedImportRefType: (refType) => {
          const nameSplit = refType.ref_name.split("_");

          if (nameSplit.length < 2) {
            const foundDefinitionKind = rootAbiUniqueDefsMap.get(refType.ref_name)

            if (!foundDefinitionKind) {
              throw new Error(`Could not find local definition for ${refType.ref_name}`)
            }

            return {
              kind: "Ref",
              ref_name: refType.ref_name,
              ref_kind: foundDefinitionKind
            }
          } else {
            // if Foo_Bar_Baz_SomeDef, then namespace path is ["Foo", "Bar", "Baz"]
            const namespacePath = nameSplit.slice(0, -1)
            const refName = nameSplit.slice(-1)[0]
            const importAbi = importMap.get(namespacePath.join("_"))

            if (!importAbi) {
              throw new Error(`Could not find import for ${refType.ref_name}`)
            }

            const foundDefinition = this._abiTreeShaker.findReferencedDefinition(importAbi.abi, refName)

            if (!foundDefinition) {
              throw new Error(`Could not find imported definition for ${refType.ref_name}`)
            }

            return {
              kind: "ImportRef",
              ref_name: refName,
              ref_kind: foundDefinition.kind,
              import_id: importAbi.absoluteIdPath
            }
          }
        }
      },
    })

    linkVisitor.visit(abiClone)
    return abiClone
  }

  async link(rootAbi: Abi, importStatements?: {
    local?: LocalImportStatement[];
    external?: ExternalImportStatement[];
  }): Promise<Abi> {
    const localImportStatementsFromRoot = importStatements?.local || []
    const externalImportStatementsFromRoot = importStatements?.external || []
    const { abi: abiWithLocalImports, transitiveExternalImports } = await this.mergeLocalImports(rootAbi, localImportStatementsFromRoot)

    const externalImportStatements = [...externalImportStatementsFromRoot, ...transitiveExternalImports]
    const abiWithExtImports = await this.embedExternalImports(abiWithLocalImports, externalImportStatements)
    const abiWithLinkedRefs = this.linkImportReferences(abiWithExtImports as Abi)

    return abiWithLinkedRefs
  }
}
