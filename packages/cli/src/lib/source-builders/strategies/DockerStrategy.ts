import {
  copyArtifactsFromBuildImage,
  createBuildImage,
  ensureDockerDaemonRunning,
  FileLock,
  generateDockerfile,
  generateDockerImageName,
  isDockerInstalled,
} from "../../system";
import { PolywrapProject } from "../../project";
import { CompilerOverrides } from "../../Compiler";
import { SourceBuildArgs, SourceBuildStrategy } from "../SourceBuilder";
import { intlMsg } from "../../intl";

import path from "path";
import fs from "fs";

type BuildImageId = string;

export class DockerBuildStrategy extends SourceBuildStrategy<BuildImageId> {
  private _dockerLock: FileLock;

  constructor(args: SourceBuildArgs) {
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

  public async getCompilerOverrides(): Promise<CompilerOverrides | undefined> {
    let compilerOverrides: CompilerOverrides | undefined;
    const manifest = await this.project.getManifest();
    const buildImageDir = `${__dirname}/defaults/build-images/${manifest.project.type}`;
    const buildImageEntryFile = path.join(buildImageDir, "index.ts");

    if (fs.existsSync(buildImageEntryFile)) {
      const module = await import(buildImageDir);

      // Get any compiler overrides for the given build-image
      if (module.getCompilerOverrides) {
        compilerOverrides = module.getCompilerOverrides() as CompilerOverrides;
      }

      if (compilerOverrides) {
        // Validate the manifest for the given build-image
        if (compilerOverrides.validateManifest) {
          compilerOverrides.validateManifest(manifest);
        }
      }
    }

    return compilerOverrides;
  }

  public async build(): Promise<BuildImageId> {
    await this._dockerLock.request();
    try {
      await ensureDockerDaemonRunning();

      const buildManifestDir = await this.project.getBuildManifestDir();
      const buildManifest = await this.project.getBuildManifest();
      const imageName =
        buildManifest?.docker?.name ||
        generateDockerImageName(await this.project.getBuildUuid());
      let dockerfile = buildManifest?.docker?.dockerfile
        ? path.join(buildManifestDir, buildManifest?.docker?.dockerfile)
        : path.join(buildManifestDir, "Dockerfile");

      await this.project.cacheBuildManifestLinkedPackages();

      // If the dockerfile path isn't provided, generate it
      if (!buildManifest?.docker?.dockerfile) {
        // Make sure the default template is in the cached .polywrap/wasm/build/image folder
        await this.project.cacheDefaultBuildImage();

        dockerfile = generateDockerfile(
          this.project.getCachePath(
            path.join(
              PolywrapProject.cacheLayout.buildImageDir,
              "Dockerfile.mustache"
            )
          ),
          buildManifest.config || {}
        );
      }

      const dockerBuildxConfig = buildManifest?.docker?.buildx;
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

      const removeImage = !!buildManifest?.docker?.removeImage;

      // If the dockerfile path contains ".mustache", generate
      if (dockerfile.indexOf(".mustache") > -1) {
        dockerfile = generateDockerfile(dockerfile, buildManifest.config || {});
      }

      // Construct the build image
      const dockerImageId = await createBuildImage(
        this.project.getManifestDir(),
        imageName,
        dockerfile,
        cacheDir,
        useBuildx,
        this.project.quiet
      );

      await copyArtifactsFromBuildImage(
        this.outputDir,
        "wrap.wasm",
        imageName,
        removeBuilder,
        removeImage,
        useBuildx,
        this.project.quiet
      );

      return dockerImageId;
    } catch (e) {
      await this._dockerLock.release();
      throw e;
    }
  }
}
