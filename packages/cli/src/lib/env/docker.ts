import { parseManifest, Manifest } from ".";

import YAML from "js-yaml";
import fs from "fs";
import path from "path";

interface DockerCompose {
  services: {
    [key: string]: {
      build?:
        | string
        | {
            context: string;
          };
    };
  };
}

export const generateBaseDockerCompose = (
  manifest: Manifest,
  baseComposePath: string
): string => {
  const fileContent = YAML.dump(manifest.dockerCompose);

  fs.writeFileSync(baseComposePath, fileContent);

  return baseComposePath;
};

export const getDockerComposePaths = (
  modulesDirPath: string,
  modules: Manifest["modules"],
  modulesToExtract?: string[]
): string[] => {
  const filteredModules = modulesToExtract
    ? Object.keys(modules).filter((key) => modulesToExtract.includes(key))
    : Object.keys(modules);

  const defaultPath = "./docker-compose.yml";

  return filteredModules.map((moduleName) => {
    const dockerComposePath =
      modules[moduleName].dockerComposePath || defaultPath;

    return path.join(
      modulesDirPath,
      modules[moduleName].module,
      dockerComposePath
    );
  });
};

export const correctBuildImageOptionPaths = (
  dockerComposePath: string
): DockerCompose => {
  const dockerComposeFile = parseManifest<DockerCompose>(dockerComposePath);

  const correctedServiceEntries = Object.entries(
    dockerComposeFile.services || {}
  ).map(([serviceName, value]) => {
    if (!value.build) {
      return [serviceName, value];
    }

    if (typeof value.build === "string") {
      return [
        serviceName,
        {
          ...value,
          build: path.join(
            process.cwd(),
            path.join(path.join(dockerComposePath, ".."), value.build)
          ),
        },
      ];
    } else {
      return [
        serviceName,
        {
          ...value,
          build: {
            ...value.build,
            context: path.join(
              process.cwd(),
              path.join(dockerComposePath, "..")
            ),
          },
        },
      ];
    }
  });

  return {
    ...dockerComposeFile,
    services: Object.fromEntries(correctedServiceEntries),
  };
};

export const generateBaseComposedCommand = (
  baseComposePath: string,
  modulePaths: string[]
): string => {
  return `docker-compose -f ${baseComposePath} ${modulePaths
    .map((path) => ` -f ${path}`)
    .join("")}`;
};
