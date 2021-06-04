import { runCommand } from "./command";

import { writeFileSync } from "@web3api/os-js";

import Mustache from "mustache";
import path from "path";
import fs from "fs";

export async function copyArtifactsFromBuildImage(
  outputDir: string,
  imageName: string,
  quiet = true
): Promise<void> {
  await runCommand(
    `docker create -ti --name root-${imageName} ${imageName}`,
    quiet
  );

  await runCommand(
    `docker cp root-${imageName}:/project/build ${outputDir}`,
    quiet
  );

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
