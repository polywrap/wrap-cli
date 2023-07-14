import { Project, AnyProjectManifest, AnyProjectManifestLanguage } from "../";

import path from "path";
import fs from "fs";

export interface CodegenOverrides {
  getSchemaBindConfig: (
    project: Project<AnyProjectManifest>
  ) => Promise<Record<string, unknown>>;
}

export async function tryGetCodegenOverrides(
  language: AnyProjectManifestLanguage
): Promise<CodegenOverrides | undefined> {
  const modulePath = path.join(
    __dirname,
    "..",
    "defaults",
    "language-overrides",
    language,
    "index.js"
  );
  let overrides: CodegenOverrides | undefined;

  if (fs.existsSync(modulePath)) {
    const module = await import(modulePath);

    // Get any build overrides for the given build-image
    if (module.getCodegenOverrides) {
      overrides = module.getCodegenOverrides() as CodegenOverrides;
    }
  }

  return Promise.resolve(overrides);
}
