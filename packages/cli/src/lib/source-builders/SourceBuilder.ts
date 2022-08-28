import {
  copyArtifactsFromBuildImage,
  createBuildImage,
  ensureDockerDaemonRunning,
  generateDockerfile,
  generateDockerImageName,
} from "../system";
import { PolywrapProject } from "../project";

import path from "path";

interface SourceBuildArgs {
  project: PolywrapProject;
  outputDir: string;
}

export interface SourceBuildStrategy {
  build: (args: SourceBuildArgs) => Promise<string>;
}

export class DockerBuildStrategy implements SourceBuildStrategy {
  public async build({ project, outputDir }: SourceBuildArgs): Promise<string> {
    await ensureDockerDaemonRunning();

    const buildManifestDir = await project.getBuildManifestDir();
    const buildManifest = await project.getBuildManifest();
    const imageName =
      buildManifest?.docker?.name ||
      generateDockerImageName(await project.getBuildUuid());
    let dockerfile = buildManifest?.docker?.dockerfile
      ? path.join(buildManifestDir, buildManifest?.docker?.dockerfile)
      : path.join(buildManifestDir, "Dockerfile");

    await project.cacheBuildManifestLinkedPackages();

    // If the dockerfile path isn't provided, generate it
    if (!buildManifest?.docker?.dockerfile) {
      // Make sure the default template is in the cached .polywrap/wasm/build/image folder
      await project.cacheDefaultBuildImage();

      dockerfile = generateDockerfile(
        project.getCachePath(
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
        cacheDir = project.getCachePath(
          PolywrapProject.cacheLayout.buildImageCacheDir
        );
      } else if (cache) {
        if (!path.isAbsolute(cache)) {
          cacheDir = path.join(project.getManifestDir(), cache);
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
      project.getManifestDir(),
      imageName,
      dockerfile,
      cacheDir,
      useBuildx,
      project.quiet
    );

    await copyArtifactsFromBuildImage(
      outputDir,
      "wrap.wasm",
      imageName,
      removeBuilder,
      removeImage,
      useBuildx,
      project.quiet
    );

    return dockerImageId;
  }
}
