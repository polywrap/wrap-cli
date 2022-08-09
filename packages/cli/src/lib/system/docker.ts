/* eslint-disable @typescript-eslint/naming-convention */

import { displayPath, runCommand, FileLock } from "./";
import { withSpinner, intlMsg } from "../";

import { isWin, writeFileSync } from "@polywrap/os-js";
import { system, print } from "gluegun";
import Mustache from "mustache";
import YAML from "js-yaml";
import path from "path";
import fs from "fs";

export function isDockerInstalled(): boolean {
  return !!system.which("docker");
}

export function getDockerFileLock(): FileLock {
  return new FileLock(__dirname + "/DOCKER_LOCK", print.error);
}

export async function isDockerBuildxInstalled(): Promise<boolean> {
  const { stdout: version } = await runCommand("docker buildx version", true);
  return version.startsWith("github.com/docker/buildx");
}

export async function copyArtifactsFromBuildImage(
  outputDir: string,
  buildArtifact: string,
  imageName: string,
  removeBuilder = false,
  removeImage = false,
  useBuildx = false,
  quiet = true
): Promise<void> {
  const run = async (): Promise<void> => {
    // Make sure the interactive terminal name is available

    useBuildx &&= await isDockerBuildxInstalled();

    const { stdout: containerLsOutput } = await runCommand(
      "docker container ls -a",
      quiet
    );

    if (containerLsOutput.indexOf(`root-${imageName}`) > -1) {
      await runCommand(`docker rm -f root-${imageName}`, quiet);
    }

    // Create a new interactive terminal
    await runCommand(
      `docker create -ti --name root-${imageName} ${imageName}`,
      quiet
    );

    // Make sure the "project" directory exists
    const { stdout: projectLsOutput } = await runCommand(
      `docker run --rm ${imageName} /bin/bash -c "ls /project"`,
      quiet
    ).catch(() => ({ stdout: "" }));

    if (projectLsOutput.length <= 1) {
      throw Error(
        intlMsg.lib_helpers_docker_projectFolderMissing({ image: imageName })
      );
    }

    const { stdout: buildLsOutput } = await runCommand(
      `docker run --rm ${imageName} /bin/bash -c "ls /project/build"`,
      quiet
    ).catch(() => ({ stdout: "" }));

    if (buildLsOutput.indexOf(buildArtifact) === -1) {
      throw Error(
        intlMsg.lib_helpers_docker_projectBuildFolderMissing({
          image: imageName,
          artifact: buildArtifact,
        })
      );
    }

    await runCommand(
      `docker cp root-${imageName}:/project/build/${buildArtifact} ${outputDir}`,
      quiet
    );

    await runCommand(`docker rm -f root-${imageName}`, quiet);

    if (useBuildx) {
      if (removeBuilder) {
        await runCommand(`docker buildx rm ${imageName}`, quiet);
      }
    }
    if (removeImage) {
      await runCommand(`docker rmi ${imageName}`, quiet);
    }
  };

  if (quiet) {
    return await run();
  } else {
    const args = {
      path: displayPath(outputDir),
      image: imageName,
    };
    return (await withSpinner(
      intlMsg.lib_helpers_docker_copyText(args),
      intlMsg.lib_helpers_docker_copyError(args),
      intlMsg.lib_helpers_docker_copyWarning(args),
      async (_spinner) => {
        return await run();
      }
    )) as void;
  }
}

export async function createBuildImage(
  rootDir: string,
  imageName: string,
  dockerfile: string,
  cacheDir?: string,
  useBuildx = false,
  quiet = true
): Promise<string> {
  const run = async (): Promise<string> => {
    useBuildx = useBuildx && (await isDockerBuildxInstalled());

    if (useBuildx) {
      const cacheFrom =
        cacheDir && fs.existsSync(path.join(cacheDir, "index.json"))
          ? `--cache-from type=local,src=${cacheDir}`
          : "";
      const cacheTo = cacheDir ? `--cache-to type=local,dest=${cacheDir}` : "";

      // Build the docker image
      let buildxUseFailed: boolean;
      try {
        const { stderr } = await runCommand(
          `docker buildx use ${imageName}`,
          quiet
        );
        buildxUseFailed = !!stderr;
      } catch (e) {
        buildxUseFailed = true;
      }

      if (buildxUseFailed) {
        await runCommand(
          `docker buildx create --use --name ${imageName}`,
          quiet
        );
      }
      await runCommand(
        `docker buildx build -f ${dockerfile} -t ${imageName} ${rootDir} ${cacheFrom} ${cacheTo} --output=type=docker`,
        quiet
      );
    } else {
      await runCommand(
        `docker build -f ${dockerfile} -t ${imageName} ${rootDir}`,
        quiet,
        isWin()
          ? undefined
          : {
              DOCKER_BUILDKIT: "true",
            }
      );
    }

    // Get the docker image ID
    const { stdout } = await runCommand(
      `docker image inspect ${imageName} -f "{{.ID}}"`,
      quiet
    );

    if (stdout.indexOf("sha256:") === -1) {
      throw Error(intlMsg.lib_docker_invalidImageId({ imageId: stdout }));
    }

    return stdout;
  };

  if (quiet) {
    return await run();
  } else {
    const args = {
      image: imageName,
      dockerfile: displayPath(dockerfile),
      context: displayPath(rootDir),
    };
    return (await withSpinner(
      intlMsg.lib_helpers_docker_buildText(args),
      intlMsg.lib_helpers_docker_buildError(args),
      intlMsg.lib_helpers_docker_buildWarning(args),
      async (_spinner) => {
        return await run();
      }
    )) as string;
  }
}

export function generateDockerfile(
  templatePath: string,
  config: Record<string, unknown>
): string {
  const outputDir = path.dirname(templatePath);
  const outputFilePath = path.join(outputDir, "Dockerfile");
  const template = fs.readFileSync(templatePath, "utf-8");
  const dockerfile = Mustache.render(template, config);
  writeFileSync(outputFilePath, dockerfile, "utf-8");
  return outputFilePath;
}

export function generateDockerImageName(uuid: string): string {
  return `polywrap-build-env-${uuid}`;
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
