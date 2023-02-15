import { DependencyTree } from "./DependencyTree";
import { ExternalImportStatement, SchemaParser } from "./types";
import { UnlinkedAbiVisitor } from "./visitor";

export class ImportsParser {
  private _schemaDependencyTree = new DependencyTree<string>()
  private _defintionDependencyTree = new DependencyTree<string>()

  constructor(private _schemaParser: SchemaParser, private _fetchers: {
    external: (uri: string) => Promise<string>
  }) { }

  private async _getTransitiveDependencies(extImportStatements: ExternalImportStatement[]) {
    for await (const externalImportStatement of extImportStatements) {
      const extImportUri = externalImportStatement.uriOrPath
      const externalSchema = await this._fetchers.external(extImportUri)
      const importedTypes = externalImportStatement.importedTypes;

      this._schemaDependencyTree.addNode(extImportUri, externalSchema)
      externalImportStatement.importedTypes.forEach(importedType => this._defintionDependencyTree.addNode(importedType, extImportUri))

      const externalAbi = await this._schemaParser.parse(externalSchema)
      const transitiveImports = await this._schemaParser.parseExternalImportStatements(externalSchema)
      const additionalImports = new Set<[string, string]>()
      const transitiveImportDeps = new Set<ExternalImportStatement>()

      const state: { currentObject?: string } = {}
      const externalAbiVisitor = new UnlinkedAbiVisitor({
        enter: {
          ObjectDef: (def) => {
            if (importedTypes.includes(def.name)) {
              state.currentObject = def.name
            }
          },
          RefType: (ref) => {
            if (state.currentObject &&
              !importedTypes.includes(ref.ref_name)) {
              additionalImports.add([state.currentObject, ref.ref_name])
            }
          },
          ImportRefType: (ref) => {
            if (state.currentObject) {
              const transitiveDependency = transitiveImports.find(t => t.importedTypes.includes(ref.ref_name))

              if (!transitiveDependency) {
                throw new Error(`Found import reference to '${ref.ref_name}' which isn't an imported definition`)
              }

              transitiveImportDeps.add(transitiveDependency)
            }
          }
        },
        leave: {
          ObjectDef: () => {
            state.currentObject = undefined
          }
        }
      })
      externalAbiVisitor.visit(externalAbi)

      additionalImports.forEach(([dependentType, dependencyType]) => {
        this._defintionDependencyTree.addNode(dependencyType, extImportUri)
        this._defintionDependencyTree.addEdge(dependentType, dependencyType)
      })

      transitiveImportDeps.forEach(transitiveDep => {
        this._schemaDependencyTree.addEdge(extImportUri, transitiveDep.uriOrPath)
      })

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
