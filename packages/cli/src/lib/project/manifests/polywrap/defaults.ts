import {
  isPolywrapManifestLanguage,
  polywrapManifestLanguages,
} from "./languages";
import { defaultSchemaPath } from "../defaults";
import { intlMsg } from "../../../intl";

import fs from "fs";
import path from "path";
import { PolywrapManifest } from "@polywrap/polywrap-manifest-types-js";

export function applyPolywrapManifestDefaults(
  manifest: PolywrapManifest,
  manifestPath: string
): PolywrapManifest {
  if (!manifest.source) {
    manifest.source = {};
  }
  if (!manifest.source.module) {
    const language = manifest.project.type;
    manifest.source.module = defaultModulePath(language, manifestPath);
  }
  if (!manifest.source.schema) {
    manifest.source.schema = defaultSchemaPath(manifestPath);
  }
  return manifest;
}

function defaultModulePath(
  language: string,
  manifestPath: string
): string | undefined {
  if (!isPolywrapManifestLanguage(language)) {
    throw Error(
      intlMsg.lib_language_unsupportedManifestLanguage({
        language: language,
        supported: Object.keys(polywrapManifestLanguages).join(", "),
      })
    );
  }

  let relEntryPoint: string;
  if (language === "wasm/typescript" || language === "wasm/assemblyscript") {
    relEntryPoint = "src/index.ts";
  } else if (language == "wasm/rust") {
    relEntryPoint = "Cargo.toml";
  } else if (language == "wasm/golang") {
    relEntryPoint = "go.mod";
  } else if (language == "interface") {
    return undefined;
  } else {
    throw Error(intlMsg.lib_project_no_default_module());
  }

  const manifestDir = path.dirname(manifestPath);
  const absEntryPoint = path.resolve(manifestDir, relEntryPoint);
  if (fs.existsSync(absEntryPoint)) {
    return absEntryPoint;
  }

  throw Error(intlMsg.lib_project_no_default_module());
}
