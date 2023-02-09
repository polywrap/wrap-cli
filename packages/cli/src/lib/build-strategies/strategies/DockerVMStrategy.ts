import {
  displayPath,
  ensureDockerDaemonRunning,
  isDockerInstalled,
  runCommand,
} from "../../system";
import { BuildStrategyArgs, BuildStrategy } from "../BuildStrategy";
import { intlMsg } from "../../intl";
import {
  BuildManifestConfig,
  PolywrapManifestLanguage,
  PolywrapProject,
} from "../../project";
import { logActivity } from "../../logging";

import fse from "fs-extra";
import path from "path";
import Mustache from "mustache";

type BuildableLanguage = Exclude<PolywrapManifestLanguage, "interface">;
const DEFAULTS_DIR = path.join(
  __dirname,
  "..",
  "..",
  "defaults",
  "build-strategies"
);

export interface VMConfig {
  defaultIncludes: string[];
  baseImage: string;
  version: string;
}

const CONFIGS: Record<BuildableLanguage, VMConfig> = {
  "wasm/rust": {
    defaultIncludes: ["Cargo.toml", "Cargo.lock"],
    baseImage: "polywrap/vm-base-rs",
    version: "0.2.0",
  },
  "wasm/assemblyscript": {
    defaultIncludes: ["package.json", "package-lock.json", "yarn.lock"],
    baseImage: "polywrap/vm-base-as",
    version: "0.1.0",
  },
};

export class DockerVMBuildStrategy extends BuildStrategy<void> {
  private _volumePaths: {
    project: string;
    linkedPackages: string;
  };
  constructor(args: BuildStrategyArgs) {
    super(args);

    if (!isDockerInstalled(this.project.logger)) {
      throw new Error(intlMsg.lib_docker_noInstall());
    }

    this._volumePaths = {
      project: this.project.getCachePath(
        PolywrapProject.cacheLayout.buildProjectDir
      ),
      linkedPackages: this.project.getCachePath(
        PolywrapProject.cacheLayout.buildLinkedPackagesDir
      ),
    };
  }

  getStrategyName(): string {
    return "vm";
  }

  public async buildSources(): Promise<void> {
    await ensureDockerDaemonRunning(this.project.logger);

    await this._buildSources();

    await this._copyBuildOutput();
  }

  private async _buildSources(): Promise<void> {
    const run = async () => {
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

      if (buildManifestConfig.polywrap_linked_packages) {
        if (fse.existsSync(this._volumePaths.linkedPackages)) {
          fse.removeSync(this._volumePaths.linkedPackages);
        }

        await this.project.cacheBuildManifestLinkedPackages();
      }

      // Copy additional includes

      CONFIGS[language].defaultIncludes.forEach((include) => {
        if (fse.existsSync(path.join(manifestDir, include))) {
          if (fse.existsSync(path.join(this._volumePaths.project, include))) {
            fse.removeSync(path.join(this._volumePaths.project, include));
          }

          fse.copySync(
            path.join(manifestDir, include),
            path.join(this._volumePaths.project, include)
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
        // HACK: moduleDir is path to Cargo.toml in Rust
        if (language === "wasm/rust") {
          fse.copySync(
            path.join(manifestDir, "src"),
            path.join(this._volumePaths.project, "src")
          );
        } else {
          fse.copySync(
            path.join(manifestDir, buildManifestConfig.polywrap_module.dir),
            path.join(
              this._volumePaths.project,
              buildManifestConfig.polywrap_module.dir
            )
          );
        }

        const scriptTemplate = fse.readFileSync(
          path.join(
            DEFAULTS_DIR,
            language,
            this.getStrategyName(),
            "vm-script.mustache"
          ),
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
        if (fse.existsSync(buildScriptPath)) {
          fse.removeSync(buildScriptPath);
        }
        fse.writeFileSync(buildScriptPath, scriptContent, {
          mode: "777",
          flag: "wx",
        });

        // For rust, we want to also mount the cargo registry's cache directory
        const localCargoCache = `${process.env.HOME}/.cargo/registry`;
        let cacheVolume = "";
        if (language === "wasm/rust" && fse.existsSync(localCargoCache)) {
          cacheVolume = `-v ${localCargoCache}:/usr/local/cargo/registry`;
        }

        let buildError: Error | undefined = undefined;

        try {
          await runCommand(
            "docker",
            [
              "run",
              "--rm",
              "-v",
              `${path.resolve(this._volumePaths.project)}:/project`,
              "-v",
              `${path.resolve(
                this._volumePaths.linkedPackages
              )}:/linked-packages`,
              cacheVolume,
              `${CONFIGS[language].baseImage}:${process.arch}-${CONFIGS[language].version}`,
              "/bin/bash",
              "--verbose",
              "/project/polywrap-build.sh",
            ],
            this.project.logger,
            undefined,
            undefined,
            true
          );

          const buildDir = path.join(this._volumePaths.project, "build");
          if (!fse.existsSync(buildDir)) {
            buildError = new Error("Build directory missing.");
          }

          await runCommand(
            "docker",
            [
              "run",
              "--rm",
              "-v",
              `${path.resolve(this._volumePaths.project)}:/project`,
              "-v",
              `${path.resolve(
                this._volumePaths.linkedPackages
              )}:/linked-packages`,
              `${CONFIGS[language].baseImage}:${process.arch}-${CONFIGS[language].version}`,
              "/bin/bash",
              "-c",
              '"chmod -R 777 /project && chmod -R 777 /linked-packages"',
            ],
            this.project.logger
          );
        } catch (e) {
          buildError = e;
        }

        if (buildError) {
          throw buildError;
        }
      }
    };

    return run();
  }

  private async _copyBuildOutput() {
    const run = () => {
      fse.copySync(
        path.join(this._volumePaths.project, "build"),
        this.outputDir
      );
    };

    const args = {
      path: displayPath(this.outputDir),
    };

    return await logActivity<void>(
      this.project.logger,
      intlMsg.lib_helpers_copyText(args),
      intlMsg.lib_helpers_copyError(args),
      intlMsg.lib_helpers_copyWarning(args),
      async () => {
        run();
      }
    );
  }
}
