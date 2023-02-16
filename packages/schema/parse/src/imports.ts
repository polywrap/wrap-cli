import { DependencyTree } from "./DependencyTree";
import { AbiMerger } from "./AbiMerger";
import { ExternalImportStatement, LocalImportStatement, SchemaParser } from "./types";
import { UnlinkedAbiDefs, UnlinkedFunctionDef, UnlinkedObjectDef } from "./UnlinkedDefs";
import { UnlinkedAbiVisitor } from "./visitor";
import { EnumDef, RefType } from "./definitions";

export class ImportsParser {
  private _schemaDependencyTree = new DependencyTree<UnlinkedAbiDefs>()
  private _defintionDependencyTree = new DependencyTree<string>()

  constructor(private _schemaParser: SchemaParser, private _fetchers: {
    external: (uri: string) => Promise<string>;
    local: (path: string) => Promise<string>;
  }, private _abiMerger: AbiMerger) { }

  private _extractAdditionaAndTransitiveDeps(abiToVisit: {
    uri: string,
    abi: UnlinkedAbiDefs,
    extImports: ExternalImportStatement[],
  }, typesToVisit: string[], typesVisited: string[] = []): {
    typesToImport: Set<[string, string]>,
    transitiveImportDeps: Set<ExternalImportStatement>,
  } {
    typesToVisit = typesToVisit.filter(t => !typesVisited.includes(t))
    const typesToImport = new Set<[string, string]>()
    const transitiveImportDeps = new Set<ExternalImportStatement>()

    if (!typesToVisit.length) {
      return {
        typesToImport,
        transitiveImportDeps
      }
    }

    const state: { currentObject?: string } = {}
    const externalAbiVisitor = new UnlinkedAbiVisitor({
      enter: {
        ObjectDef: (def) => {
          if (typesToVisit.includes(def.name)) {
            state.currentObject = def.name
          }
        },
        RefType: (ref) => {
          if (state.currentObject &&
            !typesToVisit.includes(ref.ref_name)) {
            typesToImport.add([state.currentObject, ref.ref_name])

            this._defintionDependencyTree.addNode(ref.ref_name, abiToVisit.uri)
            this._defintionDependencyTree.addEdge(state.currentObject, ref.ref_name)
          }
        },
        ImportRefType: (ref) => {
          if (state.currentObject) {
            const transitiveDependency = abiToVisit.extImports.find(t => t.importedTypes.includes(ref.ref_name))

            if (!transitiveDependency) {
              throw new Error(`Found import reference to '${ref.ref_name}' which isn't an imported definition`)
            }

            transitiveImportDeps.add(transitiveDependency)

            this._defintionDependencyTree.addNode(ref.ref_name, abiToVisit.uri)
            this._defintionDependencyTree.addEdge(state.currentObject, ref.ref_name)
            this._schemaDependencyTree.addEdge(abiToVisit.uri, transitiveDependency.uriOrPath)
          }
        }
      },
      leave: {
        ObjectDef: () => {
          state.currentObject = undefined
        }
      }
    })
    externalAbiVisitor.visit(abiToVisit.abi)

    const {
      typesToImport: resultingTypesToImport,
      transitiveImportDeps: resultingTransitiveImportDeps,
    } = this._extractAdditionaAndTransitiveDeps(abiToVisit, Array.from(typesToImport).map(([_, dep]) => dep), [...typesVisited, ...typesToVisit])

    return {
      typesToImport: new Set([...typesToImport, ...resultingTypesToImport]),
      transitiveImportDeps: new Set([...transitiveImportDeps, ...resultingTransitiveImportDeps]),
    }
  }

  private async _getTransitiveDependencies(extImportStatements: ExternalImportStatement[]) {
    for await (const externalImportStatement of extImportStatements) {
      const extImportUri = externalImportStatement.uriOrPath
      const externalSchema = await this._fetchers.external(extImportUri)
      const importedTypes = externalImportStatement.importedTypes;
      const externalAbi = await this._schemaParser.parse(externalSchema)

      this._schemaDependencyTree.addNode(extImportUri, externalAbi)
      externalImportStatement.importedTypes.forEach(importedType => this._defintionDependencyTree.addNode(importedType, extImportUri))

      const transitiveImports = await this._schemaParser.parseExternalImportStatements(externalSchema)
      const {
        transitiveImportDeps,
      } = this._extractAdditionaAndTransitiveDeps({
        uri: extImportUri,
        extImports: transitiveImports,
        abi: externalAbi,
      }, importedTypes)

      await this._getTransitiveDependencies([...transitiveImportDeps])
    }
  }

  findDefFromRef(abi: UnlinkedAbiDefs, ref: RefType): UnlinkedObjectDef | EnumDef {
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

  async extractLocalDefs(localImportStatements: LocalImportStatement[]): Promise<{
    locallyImportedDefs: UnlinkedAbiDefs,
    additionalExternalImports: ExternalImportStatement[]
  }> {
    const objectsToMerge = new Set<UnlinkedObjectDef>()
    const enumsToMerge = new Set<EnumDef>()
    const functionsToMerge = new Set<UnlinkedFunctionDef>()
    const additionalExternalImports = new Set<ExternalImportStatement>()

    for await (const localImportStatement of localImportStatements) {
      const localSchema = await this._fetchers.local(localImportStatement.uriOrPath);
      const localAbi = await this._schemaParser.parse(localSchema)
      const transitiveExtImports = await this._schemaParser.parseExternalImportStatements(localSchema)

      const state: { currentObject?: string; currentFunction?: string } = {}
      const localAbiVisitor = new UnlinkedAbiVisitor({
        enter: {
          ObjectDef: (def) => {
            if (localImportStatement.importedTypes.includes(def.name)) {
              state.currentObject = def.name
              objectsToMerge.add(def)
            }
          },
          EnumDef: (def) => {
            if (localImportStatement.importedTypes.includes(def.name)) {
              enumsToMerge.add(def)
            }
          },
          FunctionDef: (def) => {
            if (localImportStatement.importedTypes.includes(def.name)) {
              state.currentFunction = def.name
              functionsToMerge.add(def)
            }
          },
          RefType: (ref) => {
            const containingDefName = state.currentObject || state.currentFunction as string
            if (containingDefName && !localImportStatement.importedTypes.includes(ref.ref_name)) {
              
              const referencedDef = this.findDefFromRef(localAbi, ref)
              if (referencedDef.kind === "Object") {
                objectsToMerge.add(referencedDef)
              } else {
                enumsToMerge.add(referencedDef)
              }
            }
          },
          ImportRefType: (ref) => {
            const containingDefName = state.currentObject || state.currentFunction as string
            // TODO: namespaced re-exported ext import?
            if (containingDefName) {
              const referencedTransitiveImport = transitiveExtImports.find(t => t.importedTypes.includes(ref.ref_name))

              if (!referencedTransitiveImport) {
                throw new Error(`Could not find transitive import for ${ref.ref_name}`)
              }
              additionalExternalImports.add(referencedTransitiveImport)
            }
          }
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
    }

    return {
      locallyImportedDefs: {objects: [...objectsToMerge], enums: [...enumsToMerge], functions: [...functionsToMerge]},
      additionalExternalImports: [...additionalExternalImports]
    }
  }

  async getImports(rootSchema: string) {
    const rootAbi = await this._schemaParser.parse(rootSchema)
    const localImportStatements = await this._schemaParser.parseLocalImportStatements(rootSchema);

    const { locallyImportedDefs, additionalExternalImports } = await this.extractLocalDefs(localImportStatements)

    const externalImportStatementsFromRoot = await this._schemaParser.parseExternalImportStatements(rootSchema);
    const externalImportStatements = [...externalImportStatementsFromRoot, ...additionalExternalImports]

    const mergedRootAbi = this._abiMerger.merge([rootAbi, locallyImportedDefs])

    this._schemaDependencyTree.addNode("root", mergedRootAbi)

    const state: { currentObject?: string; currentFunction?: string } = {}
    const rootAbiVisitor = new UnlinkedAbiVisitor({
      enter: {
        ObjectDef: (def) => {
          state.currentObject = def.name
        },
        FunctionDef: (def) => {
          state.currentFunction = def.name
        },
        ImportRefType: (ref) => {
          if (!state.currentObject && !state.currentFunction) {
            throw new Error(`Found import reference to '${ref.ref_name}' outside of an object or function definition`)
          }
          const containingDefName = state.currentObject || state.currentFunction as string
          const correspondingAbiImport = externalImportStatements.find(t => t.importedTypes.includes(ref.ref_name))

          if (!correspondingAbiImport) {
            throw new Error(`Found import reference to '${ref.ref_name}' which isn't an imported definition`)
          }

          this._defintionDependencyTree.addNode(containingDefName, "root")
          this._defintionDependencyTree.addEdge(containingDefName, ref.ref_name)
          this._schemaDependencyTree.addEdge("root", correspondingAbiImport.uriOrPath)
        }
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

    rootAbiVisitor.visit(rootAbi)

    return this._getTransitiveDependencies(externalImportStatements)
  }
}
