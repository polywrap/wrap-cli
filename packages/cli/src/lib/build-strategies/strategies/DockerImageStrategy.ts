import {
  displayPath,
  ensureDockerDaemonRunning,
  FileLock,
  generateDockerImageName,
  isDockerInstalled,
  runCommand,
  runCommandSync,
} from "../../system";
import { BuildStrategyArgs, BuildStrategy } from "../BuildStrategy";
import { intlMsg } from "../../intl";
import { logActivity } from "../../logging";

import fs from "fs";
import path from "path";
import { isWin, writeFileSync } from "@polywrap/os-js";
import Mustache from "mustache";

type BuildImageId = string;

export class DockerImageBuildStrategy extends BuildStrategy<BuildImageId> {
  private _dockerLock: FileLock;

  constructor(args: BuildStrategyArgs) {
    super(args);

    if (!isDockerInstalled(this.project.logger)) {
      throw new Error(intlMsg.lib_docker_noInstall());
    }

    this._dockerLock = new FileLock(
      this.project.getCachePath("build/DOCKER_LOCK"),
      (msg) => {
        throw new Error(msg);
      }
    );
  }

  getStrategyName(): string {
    return "image";
  }

  public async buildSources(): Promise<BuildImageId> {
    await this._dockerLock.request();
    try {
      await ensureDockerDaemonRunning(this.project.logger);

      const buildManifestPath = await this.project.getBuildManifestPath();
      const buildManifestDir =
        buildManifestPath && path.dirname(buildManifestPath);
      const buildManifest = await this.project.getBuildManifest();
      const imageName =
        buildManifest?.strategies?.image?.name ||
        generateDockerImageName(await this.project.getBuildUuid());

      const language = await this.project.getManifestLanguage();

      const dockerfileTemplatePath = path.join(
        __dirname,
        "..",
        "..",
        "defaults",
        "build-strategies",
        language,
        this.getStrategyName(),
        "Dockerfile.mustache"
      );

      let dockerfilePath: string;

      const customManifestDockerfilePath =
        buildManifest?.strategies?.image?.dockerfile;

      if (buildManifestDir && customManifestDockerfilePath) {
        dockerfilePath = path.join(
          buildManifestDir,
          customManifestDockerfilePath
        );
      } else {
        dockerfilePath = this._generateDockerfile(dockerfileTemplatePath, {
          ...buildManifest.config,
          ...buildManifest.strategies?.image,
        });
      }

      await this.project.cacheBuildManifestLinkedPackages();

      const dockerBuildxConfig = buildManifest?.strategies?.image?.buildx;
      const useBuildx = !!dockerBuildxConfig;

      let cacheDir: string | undefined;
      let removeBuilder = false;

      if (dockerBuildxConfig && typeof dockerBuildxConfig !== "boolean") {
        const cache = dockerBuildxConfig.cache;

        if (cache == true) {
          cacheDir = this.project.getCachePath("build/image/cache");
        } else if (cache) {
          if (path.isAbsolute(cache)) {
            cacheDir = cache;
          } else {
            cacheDir = path.join(this.project.getManifestDir(), cache);
          }
        }

        removeBuilder = !!dockerBuildxConfig.removeBuilder;
      }

      const removeImage = !!buildManifest?.strategies?.image?.removeImage;

      // Construct the build image
      const dockerImageId = await this._createBuildImage(
        this.project.getManifestDir(),
        imageName,
        dockerfilePath,
        cacheDir,
        useBuildx
      );

      await this._copyArtifactsFromBuildImage(
        this.outputDir,
        "wrap.wasm",
        imageName,
        removeBuilder,
        removeImage,
        useBuildx
      );

      await this._dockerLock.release();
      return dockerImageId;
    } catch (e) {
      await this._dockerLock.release();
      throw e;
    }
  }

  private async _copyArtifactsFromBuildImage(
    outputDir: string,
    buildArtifact: string,
    imageName: string,
    removeBuilder = false,
    removeImage = false,
    useBuildx = false
  ): Promise<void> {
    const run = async (): Promise<void> => {
      // Make sure the interactive terminal name is available

      useBuildx &&= await this._isDockerBuildxInstalled();

      const { stdout: containerLsOutput } = runCommandSync(
        "docker container ls -a",
        this.project.logger
      );

      if (
        containerLsOutput &&
        containerLsOutput.indexOf(`root-${imageName}`) > -1
      ) {
        await runCommand(`docker rm -f root-${imageName}`, this.project.logger);
      }

      // Create a new interactive terminal
      await runCommand(
        `docker create -ti --name root-${imageName} ${imageName}`,
        this.project.logger
      );

      // Make sure the "project" directory exists
      const { stdout: projectLsOutput } = runCommandSync(
        `docker run --rm ${imageName} /bin/bash -c "ls /project"`,
        this.project.logger
      );

      if (!projectLsOutput || projectLsOutput.length <= 1) {
        throw Error(
          intlMsg.lib_helpers_docker_projectFolderMissing({ image: imageName })
        );
      }

      const { stdout: buildLsOutput } = runCommandSync(
        `docker run --rm ${imageName} /bin/bash -c "ls /project/build"`,
        this.project.logger
      );

      if (!buildLsOutput || buildLsOutput.indexOf(buildArtifact) === -1) {
        throw Error(
          intlMsg.lib_helpers_docker_projectBuildFolderMissing({
            image: imageName,
            artifact: buildArtifact,
          })
        );
      }

      await runCommand(
        `docker cp root-${imageName}:/project/build/${buildArtifact} ${outputDir}`,
        this.project.logger
      );

      await runCommand(`docker rm -f root-${imageName}`, this.project.logger);

      if (useBuildx) {
        if (removeBuilder) {
          await runCommand(
            `docker buildx rm ${imageName}`,
            this.project.logger
          );
        }
      }
      if (removeImage) {
        await runCommand(`docker rmi ${imageName}`, this.project.logger);
      }
    };

    const args = {
      path: displayPath(outputDir),
      image: imageName,
    };
    return await logActivity<void>(
      this.project.logger,
      intlMsg.lib_helpers_docker_copyText(args),
      intlMsg.lib_helpers_docker_copyError(args),
      intlMsg.lib_helpers_docker_copyWarning(args),
      async () => {
        return await run();
      }
    );
  }

  private async _createBuildImage(
    rootDir: string,
    imageName: string,
    dockerfile: string,
    cacheDir?: string,
    useBuildx = false
  ): Promise<string> {
    const run = async (): Promise<string> => {
      useBuildx = useBuildx && (await this._isDockerBuildxInstalled());

      if (useBuildx) {
        const cacheFrom =
          cacheDir && fs.existsSync(path.join(cacheDir, "index.json"))
            ? `--cache-from type=local,src=${cacheDir}`
            : "";
        const cacheTo = cacheDir
          ? `--cache-to type=local,dest=${cacheDir}`
          : "";

        // Build the docker image
        let buildxUseFailed: boolean;
        try {
          const { stderr } = runCommandSync(
            `docker buildx use ${imageName}`,
            this.project.logger
          );
          buildxUseFailed = !!stderr;
        } catch (e) {
          buildxUseFailed = true;
        }

        if (buildxUseFailed) {
          await runCommand(
            `docker buildx create --use --name ${imageName}`,
            this.project.logger
          );
        }
        await runCommand(
          `docker buildx build -f ${dockerfile} -t ${imageName} ${rootDir} ${cacheFrom} ${cacheTo} --output=type=docker`,
          this.project.logger,
          undefined,
          undefined,
          true
        );
      } else {
        await runCommand(
          `docker build -f ${dockerfile} -t ${imageName} ${rootDir}`,
          this.project.logger,
          isWin()
            ? undefined
            : {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                DOCKER_BUILDKIT: "true",
              },
          undefined,
          true
        );
      }

      // Get the docker image ID
      const { stdout } = runCommandSync(
        `docker image inspect ${imageName} -f "{{.ID}}"`,
        this.project.logger
      );

      if (!stdout || stdout.indexOf("sha256:") === -1) {
        throw Error(
          intlMsg.lib_docker_invalidImageId({ imageId: stdout || "N/A" })
        );
      }

      return stdout;
    };

    const args = {
      image: imageName,
      dockerfile: displayPath(dockerfile),
      context: displayPath(rootDir),
    };
    return await logActivity<string>(
      this.project.logger,
      intlMsg.lib_helpers_docker_buildText(args),
      intlMsg.lib_helpers_docker_buildError(args),
      intlMsg.lib_helpers_docker_buildWarning(args),
      async () => {
        return await run();
      }
    );
  }

  private async _isDockerBuildxInstalled(): Promise<boolean> {
    const { stdout: version } = runCommandSync(
      "docker buildx version",
      this.project.logger
    );
    return version && version.startsWith("github.com/docker/buildx")
      ? true
      : false;
  }

  private _generateDockerfile(
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
}
