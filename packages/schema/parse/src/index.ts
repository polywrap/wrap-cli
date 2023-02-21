import { AbiMerger } from "./AbiMerger";
import { AbiTreeShaker } from "./AbiTreeShaker";
import { Abi } from "./definitions";
import { ImportsLinker } from "./ImportsLinker";
import { ExternalSchemaFetcher, LocalSchemaFetcher, SchemaParser } from "./types";

export * from "./abi";
export * from "./types";

interface Args {
  schema: string
  parser: SchemaParser
  fetchers: {
    external: ExternalSchemaFetcher;
    local: LocalSchemaFetcher;
  }
}

export const parseAndLinkSchema = async ({ schema, parser, fetchers }: Args): Promise<Abi> => {
  const abi = await parser.parse(schema)
  const externalImportStatements = await parser.parseExternalImportStatements(schema)
  const localImportStatements = await parser.parseLocalImportStatements(schema)

  const merger = new AbiMerger()
  const shaker = new AbiTreeShaker()
  const linker = new ImportsLinker(parser, fetchers, merger, shaker)
  const linkedAbi = await linker.link(abi, {
    external: externalImportStatements,
    local: localImportStatements
  })

  return linkedAbi
}

