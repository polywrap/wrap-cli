/* eslint-disable @typescript-eslint/naming-convention */
import { ImportedModuleDefinition } from "@polywrap/wrap-manifest-types-js";
import { AbiTransforms } from "@polywrap/schema-parse";

export const addNamespaceToImportedMethods: AbiTransforms = {
  enter: {
    ImportedModuleDefinition: (
      def: ImportedModuleDefinition
    ): ImportedModuleDefinition => {
      const methods = def.methods?.map((method) => ({
        ...method,
        namespace: def.namespace,
      }));
      return {
        ...def,
        methods,
      };
    },
  },
};
