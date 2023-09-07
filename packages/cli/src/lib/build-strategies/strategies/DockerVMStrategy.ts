import {
  displayPath,
  ensureDockerDaemonRunning,
  isDockerInstalled,
  runCommand,
} from "../../system";
import { BuildStrategyConfig, BuildStrategy } from "../BuildStrategy";
import { intlMsg } from "../../intl";
import {
  BuildManifestConfig,
  BuildableLanguage,
  PolywrapProject,
} from "../../project";
import { logActivity } from "../../logging";

import fse from "fs-extra";
import path from "path";
import Mustache from "mustache";

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
    version: "0.2.1",
  },
  "wasm/assemblyscript": {
    defaultIncludes: ["package.json", "package-lock.json", "yarn.lock"],
    baseImage: "polywrap/vm-base-as",
    version: "0.2.0",
  },
  "wasm/golang": {
    defaultIncludes: ["go.mod", "go.sum"],
    baseImage: "polywrap/vm-base-go",
    version: "0.1.6",
  },
  "wasm/javascript": {
    defaultIncludes: [],
    baseImage: "polywrap/vm-base-js",
    version: "0.1.6",
  },
};

export class DockerVMBuildStrategy extends BuildStrategy<void> {
  private _volumePaths: {
    project: string;
    linkedPackages: string;
  };
  constructor(config: BuildStrategyConfig) {
    super(config);

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

      const language = (await this.project.getBuildLanguage()) as BuildableLanguage;

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
        // TODO: find more general solution: sources array or glob
        // JS needs to copy a single file; others may need several or dirs
        if (language === "wasm/javascript") {
          const moduleFilePath =
            buildManifestConfig.polywrap_module.moduleFilePath;
          const outputPath = path.join(
            this._volumePaths.project,
            moduleFilePath
          );
          const outputDir = path.dirname(outputPath);
          fse.mkdirSync(outputDir, { recursive: true });
          fse.copyFileSync(moduleFilePath, outputPath);
        } else {
          const sourcesSubDirectory =
            this.overrides?.sourcesSubDirectory ||
            buildManifestConfig.polywrap_module.dir;

          fse.copySync(
            path.join(manifestDir, sourcesSubDirectory),
            path.join(this._volumePaths.project, sourcesSubDirectory)
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
        const localCargoCache = `${process.env.HOME}/.cargo`;
        const cacheVolumes: string[] = [];
        if (language === "wasm/rust" && fse.existsSync(localCargoCache)) {
          cacheVolumes.push(`-v ${localCargoCache}:/usr/local/cargo`);
          // Ignore the bin folder, without this an exception is thrown upon exe exec
          cacheVolumes.push(`-v /usr/local/cargo/bin/`);
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
              ...cacheVolumes,
              `${CONFIGS[language].baseImage}:${CONFIGS[language].version}`,
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
              `${CONFIGS[language].baseImage}:${CONFIGS[language].version}`,
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
