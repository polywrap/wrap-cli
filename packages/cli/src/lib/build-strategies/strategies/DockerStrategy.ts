import {
  displayPath,
  ensureDockerDaemonRunning,
  FileLock,
  generateDockerImageName,
  isDockerInstalled,
  runCommand,
} from "../../system";
import { PolywrapProject } from "../../project";
import { BuildStrategyArgs, BuildStrategy } from "../BuildStrategy";
import { intlMsg } from "../../intl";
import { withSpinner } from "../../helpers";

import fs from "fs";
import path from "path";
import { isWin, writeFileSync } from "@polywrap/os-js";
import Mustache from "mustache";

type BuildImageId = string;

export class DockerBuildStrategy extends BuildStrategy<BuildImageId> {
  private _dockerLock: FileLock;

  constructor(args: BuildStrategyArgs) {
    super(args);

    if (!isDockerInstalled()) {
      throw new Error(intlMsg.lib_docker_noInstall());
    }

    this._dockerLock = new FileLock(
      this.project.getCachePath("build/DOCKER_LOCK"),
      (msg) => {
        throw new Error(msg);
      }
    );
  }

  public async build(): Promise<BuildImageId> {
    await this._dockerLock.request();
    try {
      await ensureDockerDaemonRunning();

      const buildManifestDir = await this.project.getBuildManifestDir();
      const buildManifest = await this.project.getBuildManifest();
      const imageName =
        buildManifest?.strategies?.image?.name ||
        generateDockerImageName(await this.project.getBuildUuid());
      let dockerfile = buildManifest?.strategies?.image?.dockerfile
        ? path.join(
            buildManifestDir,
            buildManifest?.strategies?.image?.dockerfile
          )
        : path.join(buildManifestDir, "Dockerfile");

      await this.project.cacheBuildManifestLinkedPackages();

      // If the dockerfile path isn't provided, generate it
      if (!buildManifest?.strategies?.image?.dockerfile) {
        // Make sure the default template is in the cached .polywrap/wasm/build/image folder
        await this.project.cacheDefaultBuildImage();

        dockerfile = this._generateDockerfile(
          this.project.getCachePath(
            path.join(
              PolywrapProject.cacheLayout.buildImageDir,
              "Dockerfile.mustache"
            )
          ),
          buildManifest.config || {}
        );
      }

      const dockerBuildxConfig = buildManifest?.strategies?.image?.buildx;
      const useBuildx = !!dockerBuildxConfig;

      let cacheDir: string | undefined;
      let removeBuilder = false;

      if (dockerBuildxConfig && typeof dockerBuildxConfig !== "boolean") {
        const cache = dockerBuildxConfig.cache;

        if (cache == true) {
          cacheDir = this.project.getCachePath(
            PolywrapProject.cacheLayout.buildImageCacheDir
          );
        } else if (cache) {
          if (!path.isAbsolute(cache)) {
            cacheDir = path.join(this.project.getManifestDir(), cache);
          } else {
            cacheDir = cache;
          }
        }

        removeBuilder = !!dockerBuildxConfig.removeBuilder;
      }

      const removeImage = !!buildManifest?.strategies?.image?.removeImage;

      // If the dockerfile path contains ".mustache", generate
      if (dockerfile.indexOf(".mustache") > -1) {
        dockerfile = this._generateDockerfile(
          dockerfile,
          buildManifest.config || {}
        );
      }

      // Construct the build image
      const dockerImageId = await this._createBuildImage(
        this.project.getManifestDir(),
        imageName,
        dockerfile,
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

      const { stdout: containerLsOutput } = await runCommand(
        "docker container ls -a",
        this.project.quiet
      );

      if (containerLsOutput.indexOf(`root-${imageName}`) > -1) {
        await runCommand(`docker rm -f root-${imageName}`, this.project.quiet);
      }

      // Create a new interactive terminal
      await runCommand(
        `docker create -ti --name root-${imageName} ${imageName}`,
        this.project.quiet
      );

      // Make sure the "project" directory exists
      const { stdout: projectLsOutput } = await runCommand(
        `docker run --rm ${imageName} /bin/bash -c "ls /project"`,
        this.project.quiet
      ).catch(() => ({ stdout: "" }));

      if (projectLsOutput.length <= 1) {
        throw Error(
          intlMsg.lib_helpers_docker_projectFolderMissing({ image: imageName })
        );
      }

      const { stdout: buildLsOutput } = await runCommand(
        `docker run --rm ${imageName} /bin/bash -c "ls /project/build"`,
        this.project.quiet
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
        this.project.quiet
      );

      await runCommand(`docker rm -f root-${imageName}`, this.project.quiet);

      if (useBuildx) {
        if (removeBuilder) {
          await runCommand(`docker buildx rm ${imageName}`, this.project.quiet);
        }
      }
      if (removeImage) {
        await runCommand(`docker rmi ${imageName}`, this.project.quiet);
      }
    };

    if (this.project.quiet) {
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
          const { stderr } = await runCommand(
            `docker buildx use ${imageName}`,
            this.project.quiet
          );
          buildxUseFailed = !!stderr;
        } catch (e) {
          buildxUseFailed = true;
        }

        if (buildxUseFailed) {
          await runCommand(
            `docker buildx create --use --name ${imageName}`,
            this.project.quiet
          );
        }
        await runCommand(
          `docker buildx build -f ${dockerfile} -t ${imageName} ${rootDir} ${cacheFrom} ${cacheTo} --output=type=docker`,
          this.project.quiet
        );
      } else {
        await runCommand(
          `docker build -f ${dockerfile} -t ${imageName} ${rootDir}`,
          this.project.quiet,
          isWin()
            ? undefined
            : {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                DOCKER_BUILDKIT: "true",
              }
        );
      }

      // Get the docker image ID
      const { stdout } = await runCommand(
        `docker image inspect ${imageName} -f "{{.ID}}"`,
        this.project.quiet
      );

      if (stdout.indexOf("sha256:") === -1) {
        throw Error(intlMsg.lib_docker_invalidImageId({ imageId: stdout }));
      }

      return stdout;
    };

    if (this.project.quiet) {
      // Show spinner with helpful messages
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
    } else {
      // Verbose output will be emitted within run()
      return await run();
    }
  }

  private async _isDockerBuildxInstalled(): Promise<boolean> {
    const { stdout: version } = await runCommand("docker buildx version", true);
    return version.startsWith("github.com/docker/buildx");
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
