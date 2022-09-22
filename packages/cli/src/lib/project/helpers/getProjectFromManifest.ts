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
import { filesystem } from "gluegun";
import { getProjectManifestLanguage } from "./getProjectManifestLanguage";
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
  manifestFile: string
): Promise<Project<AnyProjectManifest> | undefined> {
  const manifest = filesystem.read(manifestFile) as string;
  const type = getProjectManifestLanguage(manifest);
  if (!type) {
    return undefined;
  }

  let project: Project<AnyProjectManifest> | undefined = undefined;

  if (isPolywrapManifestLanguage(type)) {
    project = new PolywrapProject({
      rootDir: path.dirname(manifestFile),
      polywrapManifestPath: manifestFile,
    });
  } else if (isPluginManifestLanguage(type)) {
    project = new PluginProject({
      rootDir: path.dirname(manifestFile),
      pluginManifestPath: manifestFile,
    });
  } else if (isAppManifestLanguage(type)) {
    project = new AppProject({
      rootDir: path.dirname(manifestFile),
      appManifestPath: manifestFile,
    });
  } else {
    return undefined;
  }

  await project.validate();

  return project;
}
