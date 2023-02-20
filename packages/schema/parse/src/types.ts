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
  parseLocalImportStatements: (schema: string) => Promise<LocalImportStatement[]>
  parse: (schema: string) => Promise<UnlinkedAbiDefs>
}

export interface ParserOptions {
  noValidate?: boolean;
}