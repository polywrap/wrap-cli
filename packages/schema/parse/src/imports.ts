import { AbiMerger } from "./AbiMerger";
import { ExternalImportStatement, LocalImportStatement, SchemaParser } from "./types";
import { AbiVisitor } from "./visitors";
import { Abi, EnumDef, ObjectDef, RefType, UniqueDefKind } from "./definitions";

type ReferenceableDefKind = Exclude<UniqueDefKind, "Function">

abstract class ImportsLinker {
  constructor(protected _schemaParser: SchemaParser, protected _fetchers: {
    external: (uri: string) => Promise<Abi>;
    local: (path: string) => Promise<string>;
  }, protected _abiMerger: AbiMerger) { }

  extractReferenceableDefs(abi: Abi): Map<string, ReferenceableDefKind> {
    const result = new Map<string, ReferenceableDefKind>()

    const visitor = new AbiVisitor({
      enter: {
        ObjectDef: (def) => {
          result.set(def.name, "Object")
        },
        EnumDef: (def) => {
          result.set(def.name, "Enum")
        },
      }
    })

    visitor.visit(abi)

    return result
  }
}

export class LocalImportsLinker extends ImportsLinker {
  async handleExternalImports(extImportStatements: ExternalImportStatement[]) {
    for await (const extImportStatement of extImportStatements) {
      const externalSchema = await this._fetchers.external(extImportStatement.uriOrPath);

    }
  }

  async mergeLocalImports(rootAbi: Abi, localImportStatements: LocalImportStatement[]): Promise<{
    abi: Abi,
    transitiveExternalImports: ExternalImportStatement[]
  }> {
    let mergedAbi: Abi = JSON.parse(JSON.stringify(rootAbi))
    const transitiveExternalImports: ExternalImportStatement[] = []

    for await (const localImportStatement of localImportStatements) {
      const treeShakenLocalAbi: Abi = {
        version: "0.2",
        objects: [],
        enums: [],
        functions: [],
      }

      const localSchema = await this._fetchers.local(localImportStatement.uriOrPath);
      const localAbi = await this._schemaParser.parse(localSchema)

      // TODO: not tree shaking transitive local imports yet
      const state: { currentObject?: string; currentFunction?: string } = {}
      const localAbiVisitor = new AbiVisitor({
        enter: {
          ObjectDef: (def) => {
            if (localImportStatement.importedTypes.includes(def.name)) {
              state.currentObject = def.name
              treeShakenLocalAbi.objects!.push(def)
            }
          },
          EnumDef: (def) => {
            if (localImportStatement.importedTypes.includes(def.name)) {
              treeShakenLocalAbi.enums!.push(def)
            }
          },
          FunctionDef: (def) => {
            if (localImportStatement.importedTypes.includes(def.name)) {
              state.currentFunction = def.name
              treeShakenLocalAbi.functions!.push(def)
            }
          },
          RefType: (ref) => {
            const containingDefName = state.currentObject || state.currentFunction as string
            if (containingDefName && !localImportStatement.importedTypes.includes(ref.ref_name)) {
              const referencedDef = this.findDefinitionFromReference(localAbi, ref)
              if (referencedDef.kind === "Object") {
                treeShakenLocalAbi.objects!.push(referencedDef)
              } else {
                treeShakenLocalAbi.enums!.push(referencedDef)
              } 
            }
          },
        },
        leave: {
          ObjectDef: () => {
            state.currentObject = undefined
          },
          FunctionDef: () => {
            state.currentFunction = undefined
          }
        }
      })

      localAbiVisitor.visit(localAbi)

      const transitiveLocalImports = await this._schemaParser.parseLocalImportStatements(localSchema)
      const transitiveExtImports = await this._schemaParser.parseExternalImportStatements(localSchema)
      transitiveExternalImports.push(...transitiveExtImports)

      const subResult = await this.mergeLocalImports(treeShakenLocalAbi, transitiveLocalImports)
      mergedAbi = this._abiMerger.merge([mergedAbi, subResult.abi])
      transitiveExternalImports.push(...subResult.transitiveExternalImports)
    }

    return {
      abi: mergedAbi,
      transitiveExternalImports
    }
  }

  async link(rootAbi: Abi, importStatements?: {
    local?: LocalImportStatement[];
    external?: ExternalImportStatement[];
  }): Promise<{ abi: Abi; externalImportStatements: ExternalImportStatement[] }> {
    const localImportStatementsFromRoot = importStatements?.local || []
    const externalImportStatementsFromRoot = importStatements?.external || []
    const { abi, transitiveExternalImports } = await this.mergeLocalImports(rootAbi, localImportStatementsFromRoot)
    const externalImportStatements = [...externalImportStatementsFromRoot, ...transitiveExternalImports]

    return {
      abi,
      externalImportStatements,
    }
  }
}
