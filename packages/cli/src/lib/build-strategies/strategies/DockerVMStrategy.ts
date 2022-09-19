import {
  ensureDockerDaemonRunning,
  FileLock,
  isDockerInstalled,
  runCommand,
} from "../../system";
import { BuildStrategyArgs, BuildStrategy } from "../BuildStrategy";
import { intlMsg } from "../../intl";
import { PolywrapManifestLanguage, PolywrapProject } from "../../project";

import fse from "fs-extra";
import path from "path";
import Mustache from "mustache";

type BuildImageId = string;
const VOLUME_DIR_CACHE_SUBPATH = "build/volume";
const VM_SCRIPTS_DIR = path.join(
  __dirname,
  "..",
  "..",
  "defaults",
  "build-vm-scripts"
);
const ADDITIONAL_INCLUDES: Record<PolywrapManifestLanguage, string[]> = {
  "wasm/assemblyscript": ["package.json", "node_modules"],
  "wasm/rust": ["Cargo.toml", "Cargo.lock", "target"],
  interface: ["package.json"],
};

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
      };

      if (fse.existsSync(volumePaths.project)) {
        fse.removeSync(volumePaths.project);
      }

      const manifestDir = this.project.getManifestDir();
      const buildManifest = await this.project.getBuildManifest();
      const buildManifestConfig = buildManifest.config as BuildManifestConfig;

      // Copy manifests
      buildManifestConfig.polywrap_manifests.forEach((manifestPath) => {
        fse.copySync(
          path.join(manifestDir, manifestPath),
          path.join(volumePaths.project, manifestPath)
        );
      });

      const language = await this.project.getManifestLanguage();

      // Copy additional includes

      ADDITIONAL_INCLUDES[language].forEach((include) => {
        if (fse.existsSync(path.join(manifestDir, include))) {
          fse.copySync(
            path.join(manifestDir, include),
            path.join(volumePaths.project, include),
            {
              overwrite: false,
            }
          );
        }
      });

      // Copy includes
      if (buildManifestConfig.include) {
        buildManifestConfig.include.forEach((includePath) => {
          fse.copySync(
            path.join(manifestDir, includePath),
            path.join(volumePaths.project, includePath),
            {
              overwrite: false,
            }
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

        const scriptTemplate = fse.readFileSync(
          path.join(VM_SCRIPTS_DIR, `${language}.mustache`),
          "utf8"
        );

        const scriptContent = Mustache.render(
          scriptTemplate,
          buildManifestConfig
        );
        const buildScriptPath = path.join(
          volumePaths.project,
          "polywrap-build.sh"
        );
        fse.writeFileSync(buildScriptPath, scriptContent);

        await runCommand(
          `docker run --rm -v ${path.resolve(
            volumePaths.project
          )}:/project -v ${path.resolve(
            volumePaths.linkedPackages
          )}:/linked-packages namesty/base-assemblyscript:latest /bin/bash -c "${scriptContent}"`
        );

        // Copy build output
        fse.copySync(path.join(volumePaths.project, "build"), this.outputDir);
      }

      await this._dockerLock.release();

      return "";
    } catch (e) {
      await this._dockerLock.release();
      throw e;
    }
  }
}
