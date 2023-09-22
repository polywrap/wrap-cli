import { defaultSchemaPath } from "../defaults";
import { isPluginManifestLanguage, pluginManifestLanguages } from "./languages";
import { intlMsg } from "../../../intl";

import fs from "fs";
import path from "path";
import { PluginManifest } from "@polywrap/polywrap-manifest-types-js";

export function applyPluginManifestDefaults(
  manifest: PluginManifest,
  manifestPath: string
): PluginManifest {
  if (!manifest.source) {
    manifest.source = {};
  }
  if (!manifest.source?.module) {
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
  if (!isPluginManifestLanguage(language)) {
    throw Error(
      intlMsg.lib_language_unsupportedManifestLanguage({
        language: language,
        supported: Object.keys(pluginManifestLanguages).join(", "),
      })
    );
  }

  let relEntryPoint: string;
  if (language === "plugin/typescript") {
    relEntryPoint = "src/index.ts";
  } else if (language == "plugin/rust") {
    relEntryPoint = "Cargo.toml";
  } else if (language == "plugin/python") {
    relEntryPoint = "src/__init__.py";
  } else if (language == "plugin/swift") {
    relEntryPoint = "Package.swift";
  } else if (language == "plugin/kotlin") {
    relEntryPoint = "src/commonMain/kotlin";
  } else {
    throw Error(intlMsg.lib_project_no_default_module());
  }

  const manifestDir = path.dirname(manifestPath);
  const absEntryPoint = path.resolve(manifestDir, relEntryPoint);
  if (fs.existsSync(absEntryPoint)) {
    return relEntryPoint;
  }

  throw Error(intlMsg.lib_project_no_default_module());
}
