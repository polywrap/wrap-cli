import { SchemaFile, SchemaResolvers } from "./types";
import {
  resolveEnviromentTypes,
  resolveImportsAndParseSchemas,
} from "./resolve";
import { renderSchema } from "./render";

import { TypeInfo, combineTypeInfo } from "@web3api/schema-parse";

export * from "./types";

export interface SchemaInfo {
  schema?: string;
  typeInfo?: TypeInfo;
}

export interface ComposerOutput {
  [name: string]: SchemaInfo;
  combined: SchemaInfo;
}

export enum ComposerFilter {
  Schema = 1 << 0,
  TypeInfo = 1 << 1,
  All = Schema | TypeInfo,
}

export interface ComposerOptions {
  schemas: {
    [name: string]: SchemaFile;
  };
  resolvers: SchemaResolvers;
  output: ComposerFilter;
}

export async function composeSchema(
  options: ComposerOptions
): Promise<ComposerOutput> {
  const { schemas, resolvers } = options;
  const typeInfos: {
    [name: string]: TypeInfo;
  } = {};

  if (Object.keys(schemas).length === 0) {
    throw Error("No schema provided");
  }

  for (const name of Object.keys(schemas)) {
    const schema = schemas[name];

    typeInfos[name] = await resolveImportsAndParseSchemas(
      schema.schema,
      schema.absolutePath,
      name === "mutation",
      resolvers
    );
    resolveEnviromentTypes(typeInfos[name], name === "mutation");
  }

  // Forming our output structure for the caller
  const output: ComposerOutput = {
    combined: {},
  };
  const includeSchema = options.output & ComposerFilter.Schema;
  const includeTypeInfo = options.output & ComposerFilter.TypeInfo;
  const createSchemaInfo = (typeInfo: TypeInfo): SchemaInfo => ({
    schema: includeSchema ? renderSchema(typeInfo, true) : undefined,
    typeInfo: includeTypeInfo ? typeInfo : undefined,
  });
  const typeInfoNames = Object.keys(typeInfos);

  for (const name of typeInfoNames) {
    const typeInfo = typeInfos[name];
    output[name] = createSchemaInfo(typeInfo);
  }

  if (typeInfoNames.length > 1) {
    const combinedTypeInfo = combineTypeInfo(
      typeInfoNames.map((name) => typeInfos[name])
    );

    output.combined = createSchemaInfo(combinedTypeInfo);
  } else {
    output.combined = output[typeInfoNames[0]];
  }

  return output;
}
