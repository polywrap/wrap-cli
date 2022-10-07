import {
  AnyProjectManifest,
  AnyProjectManifestLanguage,
  isAppManifestLanguage,
  isPluginManifestLanguage,
  isPolywrapManifestLanguage,
} from "../manifests";
import { AppProject } from "../AppProject";
import { PluginProject } from "../PluginProject";
import { PolywrapProject } from "../PolywrapProject";
import { Project } from "../Project";
import { Logger } from "../../logging";
import { getProjectManifestLanguage } from "./getProjectManifestLanguage";

import fs from "fs";
import path from "path";

export type ManifestProjectTypeProps = {
  // >= 0.2
  project?: {
    type: AnyProjectManifestLanguage;
  };
  // legacy
  language?: AnyProjectManifestLanguage;
};

export async function getProjectFromManifest(
  manifestFile: string,
  logger: Logger
): Promise<Project<AnyProjectManifest> | undefined> {
  const manifestPath = path.resolve(manifestFile);
  const manifest = fs.readFileSync(manifestPath, "utf-8");
  const type = getProjectManifestLanguage(manifest);
  if (!type) {
    return undefined;
  }

  let project: Project<AnyProjectManifest> | undefined = undefined;

  if (isPolywrapManifestLanguage(type)) {
    project = new PolywrapProject({
      rootDir: path.dirname(manifestPath),
      polywrapManifestPath: manifestPath,
      logger,
    });
  } else if (isPluginManifestLanguage(type)) {
    project = new PluginProject({
      rootDir: path.dirname(manifestPath),
      pluginManifestPath: manifestPath,
      logger,
    });
  } else if (isAppManifestLanguage(type)) {
    project = new AppProject({
      rootDir: path.dirname(manifestPath),
      appManifestPath: manifestPath,
      logger,
    });
  } else {
    return undefined;
  }

  await project.validate();

  return project;
}
