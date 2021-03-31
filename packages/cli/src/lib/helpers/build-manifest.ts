import { transformEnvToArgs } from "./docker";
import { ModuleName } from "..";

import path from "path";
import YAML from "js-yaml";
import { existsSync, readdirSync, readFileSync } from "fs";

export interface BuildManifest {
  image: {
    dockerfile: string;
    name: string;
  };
  env: {
    [key: string]: string | string[];
    ignorePaths: string[];
    outputDir: string;
  };
}

export interface BuildVars {
  tempDir: string;
  dockerfile: string;
  outputDir: string;
  args: string;
  outputImageName: string;
  ignorePaths: string[];
}

const BASE_DOCKERFILE_PATH = path.join(__dirname, "..", "env", "build-images");

export type ModulesToBuild = "query" | "mutation" | "both";

export const parseManifest = (modulesToBuild: ModuleName[]): BuildVars => {
  const doc = YAML.safeLoad(
    readFileSync("./web3api.build.yaml", "utf8")
  ) as BuildManifest;

  if (modulesToBuild.includes("query") && modulesToBuild.includes("mutation")) {
    doc.env.modules_to_build = "both";
  } else if (modulesToBuild.includes("query")) {
    doc.env.modules_to_build = "query";
  } else if (modulesToBuild.includes("mutation")) {
    doc.env.modules_to_build = "mutation";
  } else {
    throw new Error("No modules to build declared");
  }

  const { dockerfile, name: imageName } = doc.image;

  const tempDirPath = path.join(process.cwd(), ".w3", "build", imageName);
  const buildArgsString = transformEnvToArgs(doc.env);

  const dockerFilePathExists = existsSync(dockerfile);

  const dockerFilePath = dockerFilePathExists
    ? dockerfile
    : getDockerfilePathFromCatalog(dockerfile);
  const ignorePaths = doc.env.ignorePaths;
  const outputDir = doc.env.outputDir;

  return {
    tempDir: tempDirPath,
    dockerfile: dockerFilePath,
    outputDir,
    args: buildArgsString,
    outputImageName: imageName,
    ignorePaths,
  };
};

const getDockerfilePathFromCatalog = (name: string) => {
  const imageFolders = readdirSync(BASE_DOCKERFILE_PATH);
  const imageExists = existsSync(path.join(BASE_DOCKERFILE_PATH, name));

  if (!imageExists) {
    throw new Error(
      `Image "${name}" does not exist. Please use on of the following: ${imageFolders.map(
        (i) => `\n- ${i}`
      )}`
    );
  }

  return path.join(BASE_DOCKERFILE_PATH, name, "Dockerfile");
};
