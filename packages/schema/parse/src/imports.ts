import { DependencyTree } from "./DependencyTree";
import { ExternalImportStatement, SchemaParser } from "./types";
import { UnlinkedAbiDefs } from "./UnlinkedDefs";
import { UnlinkedAbiVisitor } from "./visitor";

export class ImportsParser {
  private _schemaDependencyTree = new DependencyTree<string>()
  private _defintionDependencyTree = new DependencyTree<string>()

  constructor(private _schemaParser: SchemaParser, private _fetchers: {
    external: (uri: string) => Promise<string>
  }) { }

  private _extractAdditionaAndTransitiveDeps(typesToVisit: string[], transitiveImports: ExternalImportStatement[], abiToVisitUri: string, abiToVisit: UnlinkedAbiDefs, typesToSkip: string[] = []): {
    typesToImport: Set<[string, string]>,
    transitiveImportDeps: Set<ExternalImportStatement>,
  } {
    typesToVisit = typesToVisit.filter(t => !typesToSkip.includes(t))
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

            this._defintionDependencyTree.addNode(ref.ref_name, abiToVisitUri)
            this._defintionDependencyTree.addEdge(state.currentObject, ref.ref_name)
          }
        },
        ImportRefType: (ref) => {
          if (state.currentObject) {
            const transitiveDependency = transitiveImports.find(t => t.importedTypes.includes(ref.ref_name))

            if (!transitiveDependency) {
              throw new Error(`Found import reference to '${ref.ref_name}' which isn't an imported definition`)
            }

            transitiveImportDeps.add(transitiveDependency)

            this._defintionDependencyTree.addNode(ref.ref_name, abiToVisitUri)
            this._defintionDependencyTree.addEdge(state.currentObject, ref.ref_name)
            this._schemaDependencyTree.addEdge(abiToVisitUri, transitiveDependency.uriOrPath)
          }
        }
      },
      leave: {
        ObjectDef: () => {
          state.currentObject = undefined
        }
      }
    })
    externalAbiVisitor.visit(abiToVisit)

    const {
      typesToImport: resultingTypesToImport,
      transitiveImportDeps: resultingTransitiveImportDeps,
    } = this._extractAdditionaAndTransitiveDeps([...typesToImport.values()].map(([_, dep]) => dep), transitiveImports, abiToVisitUri, abiToVisit, [...typesToSkip, ...typesToVisit])

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

      this._schemaDependencyTree.addNode(extImportUri, externalSchema)
      externalImportStatement.importedTypes.forEach(importedType => this._defintionDependencyTree.addNode(importedType, extImportUri))

      const externalAbi = await this._schemaParser.parse(externalSchema)
      const transitiveImports = await this._schemaParser.parseExternalImportStatements(externalSchema)
      const {
        transitiveImportDeps,
      } = this._extractAdditionaAndTransitiveDeps(importedTypes, transitiveImports, extImportUri, externalAbi)

      await this._getTransitiveDependencies([...transitiveImportDeps])
    }

    return {
      definitionDependencyTree: this._defintionDependencyTree,
      schemaDependencyTree: this._schemaDependencyTree
    }
  }

  async getImports(rootSchema: string, parser: SchemaParser) {
    const externalImportStatements = await parser.parseExternalImportStatements(rootSchema);
    return this._getTransitiveDependencies(externalImportStatements)
  }
}
