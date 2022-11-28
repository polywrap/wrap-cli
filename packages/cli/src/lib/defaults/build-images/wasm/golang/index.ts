import { CompilerOverrides } from "../../../../Compiler";
import { intlMsg } from "../../../../intl";
import { resolvePathIfExists } from "../../../../system";

import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";
import fs from "fs";

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
      const goModPaths = [`../${module}`, module as string];
      const goModFile = resolvePathIfExists(goModPaths);
      if (!goModFile) {
        throw Error(
          intlMsg.commands_build_error_goModNotFound({
            paths: module as string,
          })
        );
      }

      golangModuleName = loadGoModeFile(goModFile);
    },
    getCompilerOptions: (): Record<string, unknown> => {
      return {
        golangModuleName,
      };
    },
    generationSubPath: "wrap",
  };
}

function loadGoModeFile(filePath: string): string {
  const goMod = fs.readFileSync(filePath, "utf-8");

  if (!goMod) {
    const noLoadMessage = intlMsg.lib_helpers_gomod_unableToLoad({
      path: filePath,
    });
    throw Error(noLoadMessage);
  }

  const regex = /module (.+)/m;
  const module = goMod.match(regex);
  if (!module || module.length != 2) {
    throw Error(intlMsg.lib_helpers_gomod_invalid({ path: filePath }));
  }

  return module[1];
}
