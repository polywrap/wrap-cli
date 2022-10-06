/* eslint-disable @typescript-eslint/naming-convention */

import { FileLock } from "./";
import { intlMsg } from "../";

import { system, print } from "gluegun";
import YAML from "js-yaml";
import path from "path";
import fs from "fs";

export function isDockerInstalled(): boolean {
  return !!system.which("docker");
}

export async function ensureDockerDaemonRunning(): Promise<void> {
  try {
    await system.run("docker stats --no-stream");
  } catch (e) {
    throw new Error(intlMsg.lib_helpers_docker_couldNotConnect());
  }
}

export function getDockerFileLock(): FileLock {
  return new FileLock(__dirname + "/DOCKER_LOCK", print.error);
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
  const dockerComposeFile = YAML.safeLoad(
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
