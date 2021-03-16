import { runCommand } from "./command";

import rimraf from "rimraf";

interface CopyArgs {
  tempDir: string;
  imageName: string;
  sourceDir: string;
  destinationDir: string;
}

interface BuildArgs {
  tempDir: string;
  outputImageName: string;
  args: string;
}

export function transformEnvToArgs(
  env: Record<string, string | string[]>
): string {
  return Object.entries(env)
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `--build-arg ${key}=${value}`;
      } else if (Array.isArray(value)) {
        return `--build-arg ${key}="${value.join(" ")}"`;
      } else {
        throw new Error(
          "Unsupported env variable type. Supported types: string, string[]"
        );
      }
    })
    .join(" ");
}

export async function copyFromImageToHost(
  { tempDir, imageName, sourceDir, destinationDir }: CopyArgs,
  quiet = true
): Promise<void> {
  await runCommand(
    `cd ${tempDir} && docker create -ti --name temp ${imageName}`,
    quiet
  );
  await runCommand(
    `cd ${tempDir} && docker cp temp:/app/${sourceDir}/. ${destinationDir}`,
    quiet
  );
  await runCommand(`cd ${tempDir} && docker rm -f temp`, quiet);

  try {
    rimraf.sync(tempDir);
  } catch (e) {
    console.log(e);
  }
}

export async function buildImage(
  { tempDir, outputImageName, args }: BuildArgs,
  quiet = true
): Promise<void> {
  await runCommand(
    `cd ${tempDir} && docker build --no-cache -t ${outputImageName} . ${args}`,
    quiet
  );
}
