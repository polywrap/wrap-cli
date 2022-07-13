import { ManifestFile, AbiResolvers } from "./types";
import { resolveImportsAndParseSchemas } from "./resolve";
import { renderSchema } from "./render";

import { Abi, combineAbi } from "@polywrap/schema-parse";

export * from "./types";
export { renderSchema };

export interface ComposerOptions {
  abis: ManifestFile[];
  resolvers: AbiResolvers;
}

export async function composeSchema(options: ComposerOptions): Promise<Abi> {
  const abis = await resolveImports(options.abis, options.resolvers);
  return abis.length === 1 ? abis[0] : combineAbi(abis);
}

export async function resolveImports(
  manifests: ManifestFile[],
  resolvers: AbiResolvers
): Promise<Abi[]> {
  const abis: Abi[] = [];

  if (manifests.length === 0) {
    throw Error("No schema provided");
  }

  for (const manifest of manifests) {
    abis.push(
      await resolveImportsAndParseSchemas(
        manifest.abi,
        manifest.absolutePath,
        resolvers
      )
    );
  }

  return abis;
}
