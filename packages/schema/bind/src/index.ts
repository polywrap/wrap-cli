/* eslint-disable @typescript-eslint/naming-convention */
import { generateBinding, generateEntrypointBinding } from "./bindings";
import { getRelativePath, findCommonTypes, extendCommonTypes } from "./utils";

import { Manifest, MetaManifest } from "@web3api/core-js";
import { transformTypeInfo, TypeInfo } from "@web3api/schema-parse";

export * from "./utils";

export type BindLanguage = "wasm-as" | "plugin-ts";

export type OutputEntry = FileEntry | DirectoryEntry | TemplateEntry;

export interface FileEntry {
  type: "File";
  name: string;
  data: string;
}

export interface DirectoryEntry {
  type: "Directory";
  name: string;
  data: OutputEntry[];
}

export interface TemplateEntry {
  type: "Template";
  name: string;
  data: string;
}

export interface OutputDirectory {
  entries: OutputEntry[];
}

export interface BindOutput {
  entrypoint?: OutputDirectory;
  combined?: OutputDirectory;
  query?: OutputDirectory;
  mutation?: OutputDirectory;
}

export interface BindModuleOptions {
  typeInfo: TypeInfo;
  outputDirAbs: string;
}

export interface BindEntrypointOptions {
  typeInfo: TypeInfo;
  schema: string;
  outputDirAbs: string;
  manifest: Manifest;
  metaManifest?: MetaManifest;
}

export interface BindOptions {
  bindLanguage: BindLanguage;
  entrypoint?: BindEntrypointOptions;
  combined?: BindModuleOptions;
  query?: BindModuleOptions;
  mutation?: BindModuleOptions;
}

export function bindSchema(options: BindOptions): BindOutput {
  const { entrypoint, combined, query, mutation, bindLanguage } = options;

  // If both Query & Mutation modules are present,
  // determine which types are shared between them,
  // and add the __common & __commonPath properties
  if (query && mutation) {
    // Find all common types
    const commonTypes = findCommonTypes(query.typeInfo, mutation.typeInfo);

    if (commonTypes.length) {
      query.typeInfo = transformTypeInfo(
        query.typeInfo,
        extendCommonTypes(commonTypes)
      );

      // Compute the __commonPath
      const commonPath =
        getRelativePath(mutation.outputDirAbs, query.outputDirAbs) + "/common";

      mutation.typeInfo = {
        ...transformTypeInfo(
          mutation.typeInfo,
          extendCommonTypes(commonTypes, commonPath)
        ),
        __commonPath: commonPath,
      } as TypeInfo;
    }
  }

  return {
    entrypoint: entrypoint
      ? generateEntrypointBinding(
          bindLanguage,
          entrypoint.typeInfo,
          entrypoint.schema,
          entrypoint.manifest,
          entrypoint.metaManifest,
        )
      : undefined,
    combined: combined
      ? generateBinding(bindLanguage, combined.typeInfo)
      : undefined,
    query: query ? generateBinding(bindLanguage, query.typeInfo) : undefined,
    mutation: mutation
      ? generateBinding(bindLanguage, mutation.typeInfo)
      : undefined,
  };
}
