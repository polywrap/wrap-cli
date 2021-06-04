import { runCommand } from "./command";

import { writeFileSync } from "@web3api/os-js";

import Mustache from "mustache";
import path from "path";
import fs from "fs";

export async function copyArtifactsFromBuildImage(
  outputDir: string,
  buildArtifacts: string[],
  imageName: string,
  quiet = true
): Promise<void> {
  // Make sure the interactive terminal name is available
  await runCommand(`docker rm -f root-${imageName}`, quiet)
    .catch((e) => {});

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
  quiet: boolean = true
): Promise<void> {
  await runCommand(
    `docker build -f ${dockerfile} -t ${imageName} ${rootDir}`,
    quiet
  );
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
