import {
  AnyProjectManifest,
  isAppManifestLanguage,
  isPluginManifestLanguage,
  isPolywrapManifestLanguage,
} from "../manifests";
import { Project } from "../Project";
import { PolywrapProject } from "../PolywrapProject";
import { AppProject } from "../AppProject";
import { PluginProject } from "../PluginProject";

import { filesystem } from "gluegun";
import YAML from "js-yaml";
import path from "path";
import {
  AnyAppManifest,
  AnyPluginManifest,
  AnyPolywrapManifest,
  AppManifest_0_1_0,
  AppManifest_0_2_0,
  PluginManifest_0_1_0,
  PluginManifest_0_2_0,
  PolywrapManifest_0_1_0,
  PolywrapManifest_0_2_0,
} from "@polywrap/polywrap-manifest-types-js";

type AnyManifest = AnyPolywrapManifest | AnyPluginManifest | AnyAppManifest;

type AvailableManifestFormats = AnyManifest["format"] | undefined;

type PolywrapProjectType = "wasm/interface" | "plugin" | "app" | undefined;

export async function getProjectFromManifest(
  manifestFile: string
): Promise<Project<AnyProjectManifest> | undefined> {
  const manifest = filesystem.read(manifestFile) as string;

  const format = getManifestFormat(manifest);

  switch (format) {
    case "0.1":
    case "0.1.0":
      return getProjectFromManifest_0_1_0(manifest, manifestFile);
    case "0.2.0":
      return getProjectFromManifest_latest(manifest, manifestFile);
  }

  return undefined;
}

function getManifestFormat(manifest: string): AvailableManifestFormats {
  let anyManifest: AnyManifest | undefined;

  try {
    anyManifest = JSON.parse(manifest) as AnyManifest;
  } catch (e) {
    anyManifest = YAML.safeLoad(manifest) as AnyManifest | undefined;
  }

  return anyManifest?.format;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
async function getProjectFromManifest_0_1_0(
  manifest: string,
  manifestFile: string
): Promise<Project<AnyProjectManifest> | undefined> {
  const type = getManifestProjectType_0_1_0(manifest);
  let project: Project<AnyProjectManifest> | undefined = undefined;

  switch (type) {
    case "wasm/interface":
      project = new PolywrapProject({
        rootDir: path.dirname(manifestFile),
        polywrapManifestPath: manifestFile,
      });
      break;

    case "app":
      project = new AppProject({
        rootDir: path.dirname(manifestFile),
        appManifestPath: manifestFile,
      });
      break;

    case "plugin":
      project = new PluginProject({
        rootDir: path.dirname(manifestFile),
        pluginManifestPath: manifestFile,
      });
      break;
  }

  return project;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
async function getProjectFromManifest_latest(
  manifest: string,
  manifestFile: string
): Promise<Project<AnyProjectManifest> | undefined> {
  const type = getManifestProjectType_latest(manifest);
  let project: Project<AnyProjectManifest> | undefined = undefined;

  switch (type) {
    case "wasm/interface":
      project = new PolywrapProject({
        rootDir: path.dirname(manifestFile),
        polywrapManifestPath: manifestFile,
      });
      await project.validate();
      break;

    case "app":
      project = new AppProject({
        rootDir: path.dirname(manifestFile),
        appManifestPath: manifestFile,
      });
      await project.validate();
      break;

    case "plugin":
      project = new PluginProject({
        rootDir: path.dirname(manifestFile),
        pluginManifestPath: manifestFile,
      });
      await project.validate();
      break;
  }

  return project;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function getManifestProjectType_0_1_0(manifest: string): PolywrapProjectType {
  type ManifestsV01 =
    | PolywrapManifest_0_1_0
    | AppManifest_0_1_0
    | PluginManifest_0_1_0;

  let manifestObject: ManifestsV01 | undefined;

  try {
    manifestObject = JSON.parse(manifest) as ManifestsV01;
  } catch (e) {
    manifestObject = YAML.safeLoad(manifest) as ManifestsV01 | undefined;
  }

  const type = manifestObject?.language;

  if (!type) {
    return undefined;
  }

  if (isPolywrapManifestLanguage(type)) {
    return "wasm/interface";
  } else if (isPluginManifestLanguage(type)) {
    return "plugin";
  } else if (isAppManifestLanguage(type)) {
    return "app";
  } else {
    return undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function getManifestProjectType_latest(manifest: string): PolywrapProjectType {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  type LatestManifests =
    | PolywrapManifest_0_2_0
    | AppManifest_0_2_0
    | PluginManifest_0_2_0;

  let manifestObject: LatestManifests | undefined;

  try {
    manifestObject = JSON.parse(manifest) as LatestManifests;
  } catch (e) {
    manifestObject = YAML.safeLoad(manifest) as LatestManifests | undefined;
  }

  const type = manifestObject?.project.type;

  if (!type) {
    return undefined;
  }

  if (isPolywrapManifestLanguage(type)) {
    return "wasm/interface";
  } else if (isPluginManifestLanguage(type)) {
    return "plugin";
  } else if (isAppManifestLanguage(type)) {
    return "app";
  } else {
    return undefined;
  }
}
