import { Abi, CapabilityType } from "@polywrap/schema-parse";

export interface SchemaFile {
  schema: string;
  absolutePath: string;
}

export type AbiResolver = (uri: string) => Promise<Abi>;
export type SchemaResolver = (path: string) => Promise<string>;

export interface AbiResolvers {
  external: AbiResolver;
  local: SchemaResolver;
}



export interface Use {
  usedTypes: CapabilityType[];
  namespace: string;
}



