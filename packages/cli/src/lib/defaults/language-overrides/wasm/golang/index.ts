import { BuildOverrides } from "../../../../build-strategies";
import { CodegenOverrides } from "../../../../codegen";
import { PolywrapProject } from "../../../../project";
import { resolvePathIfExists } from "../../../../system";
import { intlMsg } from "../../../../intl";

import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";
import fs from "fs";

export function getBuildOverrides(): BuildOverrides {
  return {
    validateManifest: (manifest: PolywrapManifest) => {
      getGoModulePath(manifest);
      return Promise.resolve();
    },
    sourcesSubDirectory: "module"
  };
}

export function getCodegenOverrides(): CodegenOverrides {
  return {
    getSchemaBindConfig: async (project: PolywrapProject) => {
      const manifest = await project.getManifest();
      const goModpath = getGoModulePath(manifest);
      const goModuleName = readGoModuleName(goModpath);
      return {
        goModuleName,
      };
    },
  };
}

function getGoModulePath(manifest: PolywrapManifest): string {
  // Ensure `module: ...` is pointing to a `go.mod` file
  const module = manifest.source.module;
  if (!module || module.indexOf("go.mod") === -1) {
    throw Error(
      intlMsg.lib_wasm_golang_invalidModule({ path: module || "N/A" })
    );
  }

  // Ensure the `go.mod` file exists
  const goModFile = resolvePathIfExists([module]);
  if (!goModFile) {
    throw Error(
      intlMsg.commands_build_error_goModNotFound({
        paths: module,
      })
    );
  }

  return goModFile;
}

function readGoModuleName(filePath: string): string {
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
