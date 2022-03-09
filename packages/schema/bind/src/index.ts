/* eslint-disable @typescript-eslint/naming-convention */
import { BindOptions, BindOutput } from "./types";
import { generateBinding } from "./bindings";
import { getRelativePath, findCommonTypes, extendCommonTypes } from "./utils";

import { transformTypeInfo, TypeInfo } from "@web3api/schema-parse";

export * from "./types";
export * from "./utils";
export * from "./bindings";

export function bindSchema(options: BindOptions): BindOutput {
  const { combined, query, mutation, bindLanguage } = options;

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
    combined: combined
      ? generateBinding(
          bindLanguage,
          combined.typeInfo,
          combined.schema,
          combined.config || {}
        )
      : undefined,
    query: query
      ? generateBinding(
          bindLanguage,
          query.typeInfo,
          query.schema,
          query.config || {}
        )
      : undefined,
    mutation: mutation
      ? generateBinding(
          bindLanguage,
          mutation.typeInfo,
          mutation.schema,
          mutation.config || {}
        )
      : undefined,
  };
}
