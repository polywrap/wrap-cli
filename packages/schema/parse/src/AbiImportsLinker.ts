import { IAbiMerger } from "./AbiMerger";
import { ExternalImportStatement, ExternalSchemaFetcher, LocalImportStatement, LocalSchemaFetcher, SchemaParser } from "./types";
import { Abi, ImportedAbi } from "./definitions";
import { IAbiTreeShaker } from "./AbiTreeShaker";

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

  async embedExternalImports(rootAbi: Abi, extImportStatements: ExternalImportStatement[]) {
    let abiClone: Abi = JSON.parse(JSON.stringify(rootAbi));

    for await (const extImportStatement of extImportStatements) {
      const externalSchema = await this._fetchers.external.fetch(extImportStatement.uriOrPath);
      const importedAbi: ImportedAbi = {
        ...externalSchema,
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

  async mergeLocalImports(rootAbi: Abi, localImportStatements: LocalImportStatement[]): Promise<{
    abi: Abi,
    transitiveExternalImports: ExternalImportStatement[]
  }> {
    let mergedAbi: Abi = JSON.parse(JSON.stringify(rootAbi))
    const transitiveExternalImports: ExternalImportStatement[] = []

    for await (const localImportStatement of localImportStatements) {
      const localSchema = await this._fetchers.local.fetch(localImportStatement.uriOrPath);
      const localAbi = await this._schemaParser.parse(localSchema)
      const localShakenAbi = await this._abiTreeShaker.shakeTree(localAbi, localImportStatement.importedTypes)

      const transitiveExtImports = await this._schemaParser.parseExternalImportStatements(localSchema)
      transitiveExternalImports.push(...transitiveExtImports)

      const transitiveLocalImports = await this._schemaParser.parseLocalImportStatements(localSchema)
      const subResult = await this.mergeLocalImports(localShakenAbi, transitiveLocalImports)
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
  }): Promise<Abi> {
    const localImportStatementsFromRoot = importStatements?.local || []
    const externalImportStatementsFromRoot = importStatements?.external || []

    const { abi: abiWithLocalImports, transitiveExternalImports } = await this.mergeLocalImports(rootAbi, localImportStatementsFromRoot)

    const externalImportStatements = [...externalImportStatementsFromRoot, ...transitiveExternalImports]
    const abiWithExtImports = await this.embedExternalImports(abiWithLocalImports, externalImportStatements)

    return abiWithExtImports
  }
}
