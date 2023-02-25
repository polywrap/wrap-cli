import { SchemaParser, Abi, ExternalImportStatement, LocalImportStatement } from "@polywrap/abi-types"

export const mockSchemaParser = (): SchemaParser => {
  return {
    parse: async (schema: string): Promise<Abi> => {
      return {
        version: "0.2",
      }
    },
    parseExternalImportStatements: async (schema: string): Promise<ExternalImportStatement[]> => {
      return []
    },
    parseLocalImportStatements: async (schema: string): Promise<LocalImportStatement[]> => {
      return []
    }
  }
}

export const mockFetchers = () => {
  return {
    external: {
      fetch: async (url: string): Promise<Abi> => {
        return {
          version: "0.2",
        }
      }
    },
    local: {
      fetch: async (path: string): Promise<string> => {
        return ""
      }
    },
  }
}