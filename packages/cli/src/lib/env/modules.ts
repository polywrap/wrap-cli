/* eslint-disable @typescript-eslint/no-explicit-any */
import { correctBuildImageOptionPaths } from "./docker";
import { Module } from "./types";

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import YAML from "js-yaml";

interface BasePackageJSON {
  name: string;
  version: string;
  private: boolean;
  dependencies: Record<string, any>;
}

export const installModules = async (
  basePackageJson: BasePackageJSON,
  testEnvDirPath: string,
  modules: Module[]
): Promise<BasePackageJSON> => {
  //Compose package.json under .w3 folder and install deps
  const packageJSON = {
    ...basePackageJson,
    dependencies: modules.reduce((acc, current) => {
      acc[current.module] = current.version;
      return acc;
    }, {} as Record<string, any>),
  };

  fs.writeFileSync(
    path.join(testEnvDirPath, "package.json"),
    JSON.stringify(packageJSON)
  );
  await exec(`cd ${testEnvDirPath} && npm i`);

  const nodeModulesPath = path.join(testEnvDirPath, "node_modules");

  modules.forEach((m) => {
    const defaultPath = "./docker-compose.yml";

    const moduleDir = path.join(
      process.cwd(),
      nodeModulesPath,
      m.module,
      m.dockerComposePath || defaultPath
    );

    console.log(process.cwd());
    console.error(moduleDir);

    //Adjust module's docker-compose's build option if it exists

    if (!fs.existsSync(moduleDir)) {
      throw new Error(
        `Couldn't find docker-compose.yml file for module "${m.module}" at path '${moduleDir}'`
      );
    }

    const composeFileWithCorrectPaths = correctBuildImageOptionPaths(moduleDir);

    //Ovewrite old docker-compose with corrected version
    const newComposeFile = YAML.dump(composeFileWithCorrectPaths);
    fs.writeFileSync(moduleDir, newComposeFile);
  });

  return packageJSON;
};
