import {
  displayPath,
  ensureDockerDaemonRunning,
  isDockerInstalled,
  runCommand,
} from "../../system";
import { BuildStrategyArgs, BuildStrategy } from "../BuildStrategy";
import { intlMsg } from "../../intl";
import { PolywrapManifestLanguage, PolywrapProject } from "../../project";
import { withSpinner } from "../../helpers";

import fse from "fs-extra";
import path from "path";
import Mustache from "mustache";

type BuildableLanguage = Exclude<PolywrapManifestLanguage, "interface">;
const VOLUME_DIR_CACHE_SUBPATH = "build/volume";
const VM_SCRIPTS_DIR = path.join(
  __dirname,
  "..",
  "..",
  "defaults",
  "build-vm-scripts"
);
const ADDITIONAL_INCLUDES: Record<BuildableLanguage, string[]> = {
  "wasm/assemblyscript": ["package.json", "node_modules"],
  "wasm/rust": ["Cargo.toml", "Cargo.lock", "target"],
};

const BASE_IMAGES: Record<BuildableLanguage, string> = {
  "wasm/assemblyscript": "namesty/base-assemblyscript",
  "wasm/rust": "namesty/base-rust",
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

export class DockerVMBuildStrategy extends BuildStrategy<void> {
  private _volumePaths: { project: string; linkedPackages: string };
  constructor(args: BuildStrategyArgs) {
    super(args);

    if (!isDockerInstalled()) {
      throw new Error(intlMsg.lib_docker_noInstall());
    }

    this._volumePaths = {
      project: this.project.getCachePath(VOLUME_DIR_CACHE_SUBPATH),
      linkedPackages: this.project.getCachePath(
        PolywrapProject.cacheLayout.buildLinkedPackagesDir
      ),
    };
  }

  public async build(): Promise<void> {
    await ensureDockerDaemonRunning();

    await this._buildSources();

    await this._copyBuildOutput();
  }

  private async _buildSources(): Promise<void> {
    const run = async () => {
      if (fse.existsSync(this._volumePaths.project)) {
        fse.removeSync(this._volumePaths.project);
      }

      const manifestDir = this.project.getManifestDir();
      const buildManifest = await this.project.getBuildManifest();
      const buildManifestConfig = buildManifest.config as BuildManifestConfig;

      // Copy manifests
      buildManifestConfig.polywrap_manifests.forEach((manifestPath) => {
        fse.copySync(
          path.join(manifestDir, manifestPath),
          path.join(this._volumePaths.project, manifestPath)
        );
      });

      const language = (await this.project.getManifestLanguage()) as BuildableLanguage;

      // Copy additional includes

      ADDITIONAL_INCLUDES[language].forEach((include) => {
        if (fse.existsSync(path.join(manifestDir, include))) {
          fse.copySync(
            path.join(manifestDir, include),
            path.join(this._volumePaths.project, include),
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
            path.join(this._volumePaths.project, includePath),
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
            this._volumePaths.project,
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
          this._volumePaths.project,
          "polywrap-build.sh"
        );
        fse.writeFileSync(buildScriptPath, scriptContent);

        await runCommand(
          `docker run --rm -v ${path.resolve(
            this._volumePaths.project
          )}:/project -v ${path.resolve(
            this._volumePaths.linkedPackages
          )}:/linked-packages ${
            BASE_IMAGES[language]
          }:latest /bin/bash -c "${scriptContent}"`
        );
      }
    };

    if (this.project.quiet) {
      return run();
    } else {
      return await withSpinner(
        intlMsg.lib_helpers_docker_buildVMText(),
        intlMsg.lib_helpers_docker_buildVMError(),
        intlMsg.lib_helpers_docker_buildVMWarning(),
        run
      );
    }
  }

  private async _copyBuildOutput() {
    const run = () => {
      fse.copySync(
        path.join(this._volumePaths.project, "build"),
        this.outputDir
      );
    };

    if (this.project.quiet) {
      return run();
    } else {
      const args = {
        path: displayPath(this.outputDir),
      };

      return (await withSpinner(
        intlMsg.lib_helpers_copyText(args),
        intlMsg.lib_helpers_copyError(args),
        intlMsg.lib_helpers_copyWarning(args),
        async () => {
          run();
        }
      )) as void;
    }
  }
}
