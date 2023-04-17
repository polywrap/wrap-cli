/* eslint-disable @typescript-eslint/naming-convention */

import { FileLock } from "./";
import { intlMsg, Logger, runCommandSync } from "../";

import YAML from "yaml";
import path from "path";
import fs from "fs";

export function isDockerInstalled(logger: Logger): boolean {
  const { stdout } = runCommandSync("docker", ["version"], logger);
  return stdout ? stdout.includes("Version") : false;
}

export async function ensureDockerDaemonRunning(logger: Logger): Promise<void> {
  try {
    runCommandSync("docker", ["stats", "--no-stream"], logger);
  } catch (e) {
    throw new Error(intlMsg.lib_helpers_docker_couldNotConnect());
  }
}

export function getDockerFileLock(logger: Logger): FileLock {
  return new FileLock(__dirname + "/DOCKER_LOCK", (message: string) =>
    logger.error(message)
  );
}

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

export function correctBuildContextPathsFromCompose(
  dockerComposePath: string
): DockerCompose {
  const dockerComposeFile = YAML.parse(
    fs.readFileSync(dockerComposePath, "utf-8")
  ) as DockerCompose;

  const composeContextDir = path.dirname(path.resolve(dockerComposePath));

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
          build: path.isAbsolute(value.build)
            ? value.build
            : path.join(composeContextDir, value.build),
        },
      ];
    } else {
      return [
        serviceName,
        {
          ...value,
          build: {
            ...value.build,
            context: path.isAbsolute(value.build.context)
              ? value.build.context
              : path.join(composeContextDir, value.build.context),
          },
        },
      ];
    }
  });

  return {
    ...dockerComposeFile,
    services: Object.fromEntries(correctedServiceEntries),
  };
}

export function generateDockerImageName(uuid: string): string {
  return `polywrap-build-env-${uuid}`;
}
