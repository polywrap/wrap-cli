import { CompilerOverrides } from "../../../../Compiler";
import { intlMsg } from "../../../../intl";
import { resolvePathIfExists } from "../../../../system";

import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";

/** go.mod
 * module bla-bla
 */
export function getCompilerOverrides(): CompilerOverrides {
  let golangModuleName = "";
  return {
    validateManifest: (manifest: PolywrapManifest) => {
      const module = manifest.source.module;

      if (!module || module.indexOf("go.mod") === -1) {
        throw Error(
          intlMsg.lib_wasm_golang_invalidModule({ path: module as string })
        );
      }
      const goModPaths = [module as string];
      const goModFile = resolvePathIfExists(goModPaths);
      if (!goModFile) {
        throw Error(
          intlMsg.commands_build_error_goModNotFound({
            paths: module as string,
          })
        );
      }

      // file open
      // file parse
      const value = "github.com/consideritdone/testproject";
      golangModuleName = value;
    },
    getCompilerOptions: (): Record<string, unknown> => {
      return {
        golangModuleName,
      };
    },
    generationSubPath: "wrap",
  };
}
