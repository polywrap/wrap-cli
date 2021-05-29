import { runCommand } from "./command";

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
  args?: Record<string, unknown>,
  quiet: boolean = true
): Promise<void> {
  const dockerArgs = args ? formatBuildArgs(args) : "";

  await runCommand(
    `docker build -f ${dockerfile} -t ${imageName} ${rootDir} ${dockerArgs}`,
    quiet
  );
}

function formatBuildArgs(
  args: Record<string, unknown>,
  prefix: string = ""
): string {
  return Object.entries(args)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      const type = typeof value;
      let buildArg = `--build-arg ${prefix}${key}=`;

      if (Array.isArray(value)) {
        // TODO: support arrays of non-base types, like objects
        buildArg += `"${value.join(",")}"`;
      } else if (type === "string") {
        buildArg += `"${value}"`;
      } else if (type === "boolean") {
        buildArg += `${value ? "true" : "false"}`;
      } else if (type === "number") {
        buildArg += `${(value as number).toString()}`;
      } else if (type === "object") {
        return formatBuildArgs(
          value as Record<string, unknown>,
          prefix ? `${prefix}_${key}_` : `${key}_`
        );
      } else {
        throw Error(
          `Unsupported BuildManifest.env variable "${key}". Type: ${type}, Value: ${value}`
        );
      }

      return buildArg;
    })
    .join(" ");
}
