import { AbiMerger } from "./AbiMerger";
import { ExternalImportStatement, LocalImportStatement, SchemaParser } from "./types";
import { UnlinkedAbiDefs, UnlinkedObjectDef } from "./UnlinkedDefs";
import { UnlinkedAbiVisitor } from "./visitor";
import { Abi, EnumDef, RefType, UniqueDefKind } from "./definitions";

type ReferenceableDefKind = Exclude<UniqueDefKind, "Function">

export class Parser {
  constructor(private _schemaParser: SchemaParser, private _fetchers: {
    external: (uri: string) => Promise<Abi>;
    local: (path: string) => Promise<string>;
  }, private _abiMerger: AbiMerger) { }

  findDefinitionFromReference(abi: UnlinkedAbiDefs, ref: RefType): UnlinkedObjectDef | EnumDef {
    let result: UnlinkedObjectDef | EnumDef | undefined;

    switch (ref.ref_kind) {
      case "Object":
        result = abi.objects?.find(o => o.name === ref.ref_name)
        break;
      case "Enum":
        result = abi.enums?.find(o => o.name === ref.ref_name)
        break;
      default:
        throw new Error(`Unknown kind ${ref.kind}`)
    }

    if (!result) {
      throw new Error(`Could not find ${ref.ref_kind} ${ref.ref_name}`)
    }

    return result
  }

  extractLocalReferenceableDefs(abi: UnlinkedAbiDefs): Map<string, ReferenceableDefKind> {
    const result = new Map<string, ReferenceableDefKind>()

    const visitor = new UnlinkedAbiVisitor({
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

  linkLocalReferences(abi: UnlinkedAbiDefs, referenceableDefs: Map<string, ReferenceableDefKind>): UnlinkedAbiDefs {
    const result: UnlinkedAbiDefs = JSON.parse(JSON.stringify(abi))

    const visitor = new UnlinkedAbiVisitor({
      enter: {
        RefType: (ref) => {
          const defKind = referenceableDefs.get(ref.ref_name)
          if (!defKind) {
            throw new Error(`Could not find ${ref.ref_name}`)
          }

          ref.ref_kind = defKind
        }
      }
    })

    visitor.visit(result)

    return result
  }

  async mergeLocalImports(rootAbi: UnlinkedAbiDefs, localImportStatements: LocalImportStatement[]): Promise<{
    abi: UnlinkedAbiDefs,
    transitiveExternalImports: ExternalImportStatement[]
  }> {
    let mergedAbi: UnlinkedAbiDefs = JSON.parse(JSON.stringify(rootAbi))
    const transitiveExternalImports: ExternalImportStatement[] = []

    for await (const localImportStatement of localImportStatements) {
      const treeShakenLocalAbi: UnlinkedAbiDefs = {
        objects: [],
        enums: [],
        functions: [],
      }

      const localSchema = await this._fetchers.local(localImportStatement.uriOrPath);
      const localAbi = await this._schemaParser.parse(localSchema)
      const transitiveLocalImports = await this._schemaParser.parseLocalImportStatements(localSchema)
      const transitiveExtImports = await this._schemaParser.parseExternalImportStatements(localSchema)
      transitiveExternalImports.push(...transitiveExtImports)

      // TODO: not tree shaking transitive local imports yet
      const state: { currentObject?: string; currentFunction?: string } = {}
      const localAbiVisitor = new UnlinkedAbiVisitor({
        enter: {
          ObjectDef: (def) => {
            if (localImportStatement.importedTypes.includes(def.name)) {
              state.currentObject = def.name
              treeShakenLocalAbi.objects.push(def)
            }
          },
          EnumDef: (def) => {
            if (localImportStatement.importedTypes.includes(def.name)) {
              treeShakenLocalAbi.enums.push(def)
            }
          },
          FunctionDef: (def) => {
            if (localImportStatement.importedTypes.includes(def.name)) {
              state.currentFunction = def.name
              treeShakenLocalAbi.functions.push(def)
            }
          },
          RefType: (ref) => {
            const containingDefName = state.currentObject || state.currentFunction as string
            if (containingDefName && !localImportStatement.importedTypes.includes(ref.ref_name)) {
              const referencedDef = this.findDefinitionFromReference(localAbi, ref)
              if (referencedDef.kind === "Object") {
                treeShakenLocalAbi.objects.push(referencedDef)
              } else {
                treeShakenLocalAbi.enums.push(referencedDef)
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

      const subResult = await this.mergeLocalImports(treeShakenLocalAbi, transitiveLocalImports)
      mergedAbi = this._abiMerger.merge([mergedAbi, subResult.abi])
      transitiveExternalImports.push(...subResult.transitiveExternalImports)
    }

    return {
      abi: mergedAbi,
      transitiveExternalImports
    }
  }

  async parse(rootSchema: string): Promise<{ abi: UnlinkedAbiDefs; externalImportStatements: ExternalImportStatement[] }> {
    const rootAbi = await this._schemaParser.parse(rootSchema)
    const externalImportStatementsFromRoot = await this._schemaParser.parseExternalImportStatements(rootSchema);
    const localImportStatementsFromRoot = await this._schemaParser.parseLocalImportStatements(rootSchema);

    const { abi, transitiveExternalImports } = await this.mergeLocalImports(rootAbi, localImportStatementsFromRoot)

    const extractLocalReferenceableDefs = this.extractLocalReferenceableDefs(abi)
    const locallyLinkedAbi = this.linkLocalReferences(abi, extractLocalReferenceableDefs)

    const externalImportStatements = [...externalImportStatementsFromRoot, ...transitiveExternalImports]

    return {
      abi: locallyLinkedAbi,
      externalImportStatements,
    }
  }
}
