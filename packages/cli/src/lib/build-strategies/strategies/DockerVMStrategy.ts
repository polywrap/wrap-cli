import {
  ensureDockerDaemonRunning,
  FileLock,
  isDockerInstalled,
  runCommand,
} from "../../system";
import { BuildStrategyArgs, BuildStrategy } from "../BuildStrategy";
import { intlMsg } from "../../intl";
import { PolywrapProject } from "../../project";

import fse from "fs-extra";
import path from "path";

type BuildImageId = string;
const VOLUME_DIR_CACHE_SUBPATH = "build/volume";
const CONTAINER_NAME = "vm-build-container";
const VM_SCRIPTS_DIR = path.join(
  __dirname,
  "..",
  "..",
  "defaults",
  "build-vm",
  "scripts"
);

interface BuildManifestConfig {
  [k: string]: unknown;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  polywrap_module?: {
    name: string;
    dir: string;
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  polywrap_linked_packages?: {
    dir: string;
    name: string;
  }[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  polywrap_manifests: string[];
  include?: string[];
}

export class DockerVMBuildStrategy extends BuildStrategy<BuildImageId> {
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

  public async build(): Promise<string> {
    await this._dockerLock.request();
    try {
      await ensureDockerDaemonRunning();
      const volumePaths = {
        project: this.project.getCachePath(VOLUME_DIR_CACHE_SUBPATH),
        linkedPackages: this.project.getCachePath(
          PolywrapProject.cacheLayout.buildLinkedPackagesDir
        ),
        build: this.project.getCachePath("build/output"),
      };
      const manifestDir = this.project.getManifestDir();
      const buildManifest = await this.project.getBuildManifest();
      const buildManifestConfig = buildManifest.config as BuildManifestConfig;

      // Copy manifests
      buildManifestConfig.polywrap_manifests.forEach((manifestPath) => {
        fse.copyFileSync(
          path.join(manifestDir, manifestPath),
          path.join(volumePaths.project, manifestPath)
        );
      });

      // Link Packages
      let packageJson = fse.readJsonSync(
        path.join(manifestDir, "package.json")
      );

      if (buildManifestConfig.polywrap_linked_packages) {
        await this.project.cacheBuildManifestLinkedPackages();

        packageJson = {
          ...packageJson,
          dependencies: {
            ...packageJson.dependencies,
            ...buildManifestConfig.polywrap_linked_packages.reduce(
              (acc, pkg) => {
                acc[pkg.name] = `../linked-packages/${pkg.name}`;
                return acc;
              },
              {} as Record<string, string>
            ),
          },
        };
      }

      fse.writeJsonSync(
        path.join(volumePaths.project, "package.json"),
        packageJson
      );

      // Copy includes
      if (buildManifestConfig.include) {
        buildManifestConfig.include.forEach((includePath) => {
          fse.copySync(
            path.join(manifestDir, includePath),
            path.join(volumePaths.project, includePath)
          );
        });
      }

      // Copy sources and build
      if (buildManifestConfig.polywrap_module) {
        fse.copySync(
          path.join(manifestDir, buildManifestConfig.polywrap_module.dir),
          path.join(
            volumePaths.project,
            buildManifestConfig.polywrap_module.dir
          )
        );

        const buildCommand = `./node_modules/.bin/asc ${buildManifestConfig.polywrap_module.dir}/wrap/entry.ts \
        --path ./node_modules \
        --outFile ./build/wrap.wasm \
        --use abort=${buildManifestConfig.polywrap_module.dir}/wrap/entry/wrapAbort \
        --optimize --importMemory \
        --runtime stub \
        --runPasses asyncify`;

        await runCommand(
          `docker run -v ${path.resolve(
            volumePaths.project
          )}:/project -v ${path.resolve(
            volumePaths.linkedPackages
          )}:/linked-packages --name ${CONTAINER_NAME} -ti polywrap-vm-as /bin/bash -c "${buildCommand}"`
        );

        // Copy build output
        await runCommand(
          `docker cp ${CONTAINER_NAME}:/project/build/wrap.wasm ${this.outputDir}`,
          this.project.quiet
        );

        // Remove container
        await runCommand(`docker container rm -f ${CONTAINER_NAME}`);
      }

      await this._dockerLock.release();

      return "";
    } catch (e) {
      await this._dockerLock.release();
      throw e;
    }
  }
}
