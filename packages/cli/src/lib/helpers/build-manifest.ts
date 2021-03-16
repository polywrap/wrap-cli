import { transformEnvToArgs } from "./docker";

import path from "path";
import YAML from "js-yaml";
import { readFileSync } from "fs";

export interface BuildManifest {
  image: {
    dockerfile?: string;
    name: string;
  };
  env: {
    [key: string]: string | string[];
    sources: string[];
    outputDir: string;
  };
}

export interface BuildVars {
  paths: {
    tempDir: string;
    dockerfile: string;
    outputDir: string;
  };
  args: string;
  outputImageName: string;
  sources: string[];
}

const BASE_DOCKERFILE_PATH = path.join(
  __dirname,
  "..",
  "lib",
  "env",
  "build-env"
);

export const parseManifest = (): BuildVars => {
  const doc = YAML.safeLoad(
    readFileSync("./web3api.build.yaml", "utf8")
  ) as BuildManifest;

  const tempDirPath = path.join(process.cwd(), ".w3", "temp");
  const buildArgsString = transformEnvToArgs(doc.env);
  const { dockerfile: userDockerfile, name: imageName } = doc.image;
  const dockerFilePath = userDockerfile || BASE_DOCKERFILE_PATH;
  const sources = doc.env.sources;
  const outputDir = doc.env.outputDir;

  return {
    paths: {
      tempDir: tempDirPath,
      dockerfile: dockerFilePath,
      outputDir,
    },
    args: buildArgsString,
    outputImageName: imageName,
    sources,
  };
};
