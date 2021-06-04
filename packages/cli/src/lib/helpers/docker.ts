import { runCommand } from "./command";

import { writeFileSync } from "@web3api/os-js";
import Mustache from "mustache";
import path from "path";
import fs from "fs";
import { intlMsg } from "../intl";

export async function copyArtifactsFromBuildImage(
  outputDir: string,
  buildArtifacts: string[],
  imageName: string,
  quiet = true
): Promise<void> {
  // Make sure the interactive terminal name is available
  /* eslint-disable @typescript-eslint/no-empty-function */
  await runCommand(`docker rm -f root-${imageName}`, quiet).catch(() => {});

  await runCommand(
    `docker create -ti --name root-${imageName} ${imageName}`,
    quiet
  );

  for (const buildArtifact of buildArtifacts) {
    await runCommand(
      `docker cp root-${imageName}:/project/build/${buildArtifact} ${outputDir}`,
      quiet
    );
  }

  await runCommand(`docker rm -f root-${imageName}`, quiet);
}

export async function createBuildImage(
  rootDir: string,
  imageName: string,
  dockerfile: string,
  quiet = true
): Promise<string> {
  // Build the docker image
  await runCommand(
    `docker build -f ${dockerfile} -t ${imageName} ${rootDir}`,
    quiet
  );

  // Get the docker image ID
  const { stdout } = await runCommand(
    `docker image inspect ${imageName} -f "{{.ID}}"`,
    quiet
  );

  if (stdout.indexOf("sha256:") === -1) {
    throw Error(
      intlMsg.lib_docker_invalidImageId({ imageId: stdout })
    );
  }

  return stdout;
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
