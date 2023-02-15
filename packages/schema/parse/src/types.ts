import { UniqueDefKind } from "./definitions";
import { UnlinkedAbiDefs } from "./UnlinkedDefs";

export interface ImportStatement {
  kind: "local" | "external";
  importedTypes: string[];
  uriOrPath: string;
}

export interface ExternalImportStatement extends ImportStatement {
  kind: "external";
  namespace: string;
}

export interface LocalImportStatement extends ImportStatement {
  kind: "local";
}

export interface SchemaParser {
  parseExternalImportStatements: (schema: string) => Promise<ExternalImportStatement[]>
  getImportStatements: (schema: string) => Promise<ImportStatement[]>
  getImportedSchemasTable: (schema: string, schemaPath: string) => Promise<Map<string, string>>
  getUniqueDefinitionsTable: (schema: string) => Promise<Map<string, UniqueDefKind>>
  parse: (schema: string) => Promise<UnlinkedAbiDefs>
}

export interface ParserOptions {
  noValidate?: boolean;
}