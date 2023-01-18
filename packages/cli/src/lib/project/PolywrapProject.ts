/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/naming-convention */

import { Project, ProjectConfig } from ".";
import {
  isPolywrapManifestLanguage,
  loadBuildManifest,
  loadPolywrapManifest,
  PolywrapManifestLanguage,
  polywrapManifestLanguages,
  polywrapManifestLanguageToBindLanguage,
} from "./manifests";
import { resetDir } from "../system";
import { createUUID } from "../helpers";

import {
  BuildManifest,
  PolywrapManifest,
} from "@polywrap/polywrap-manifest-types-js";
import { normalizePath } from "@polywrap/os-js";
import { BindOptions, BindOutput, bindSchema } from "@polywrap/schema-bind";
import { WrapAbi } from "@polywrap/schema-parse";
import regexParser from "regex-parser";
import path from "path";
import fs from "fs";
import fsExtra from "fs-extra";

export interface PolywrapProjectConfig extends ProjectConfig {
  polywrapManifestPath: string;
  buildManifestPath?: string;
}

export interface BuildManifestConfig {
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

export class PolywrapProject extends Project<PolywrapManifest> {
  public static cacheLayout = {
    root: "wasm/",
    buildStrategyUsed: "build/strategy-used",
    buildDir: "build/",
    buildUuidFile: "build/uuid",
    buildProjectDir: "build/project",
    buildLinkedPackagesDir: "build/linked-packages/",
  };
  private _polywrapManifest: PolywrapManifest | undefined;
  private _buildManifest: BuildManifest | undefined;

  constructor(protected _config: PolywrapProjectConfig) {
    super(_config, {
      rootDir: _config.rootDir,
      subDir: PolywrapProject.cacheLayout.root,
    });
  }

  public getCachePath(subpath: string): string {
    return this._cache.getCachePath(subpath);
  }

  /// Project Base Methods

  public reset(): void {
    this._polywrapManifest = undefined;
    this._buildManifest = undefined;
    this._cache.removeCacheDir(
      PolywrapProject.cacheLayout.buildLinkedPackagesDir
    );
  }

  public async validate(): Promise<void> {
    return Promise.resolve();
  }

  /// Manifest (polywrap.yaml)

  public async getName(): Promise<string> {
    return (await this.getManifest()).project.name;
  }

  public async getManifest(): Promise<PolywrapManifest> {
    if (!this._polywrapManifest) {
      this._polywrapManifest = await loadPolywrapManifest(
        this.getManifestPath(),
        this.logger
      );
    }

    return Promise.resolve(this._polywrapManifest);
  }

  public getManifestDir(): string {
    return path.dirname(this.getManifestPath());
  }

  public getManifestPath(): string {
    return this._config.polywrapManifestPath;
  }

  public async getManifestLanguage(): Promise<PolywrapManifestLanguage> {
    const language = (await this.getManifest()).project.type;

    Project.validateManifestLanguage(
      language,
      polywrapManifestLanguages,
      isPolywrapManifestLanguage
    );

    return language as PolywrapManifestLanguage;
  }

  /// Schema

  public async getSchemaNamedPath(): Promise<string> {
    const manifest = await this.getManifest();
    const dir = this.getManifestDir();
    return path.join(dir, manifest.source.schema);
  }

  public async getImportAbis(): Promise<
    PolywrapManifest["source"]["import_abis"]
  > {
    const manifest = await this.getManifest();
    return manifest.source.import_abis || [];
  }

  public async generateSchemaBindings(
    abi: WrapAbi,
    generationSubPath?: string
  ): Promise<BindOutput> {
    const manifest = await this.getManifest();
    const codegenDirectory = this._getGenerationDirectory(generationSubPath);

    // Clean the code generation
    resetDir(codegenDirectory);

    const bindLanguage = polywrapManifestLanguageToBindLanguage(
      await this.getManifestLanguage()
    );

    const options: BindOptions = {
      projectName: manifest.project.name,
      abi,
      outputDirAbs: codegenDirectory,
      bindLanguage,
    };

    return bindSchema(options);
  }

  /// Polywrap Build Manifest (polywrap.build.yaml)

  public async getBuildManifestPath(): Promise<string | undefined> {
    const polywrapManifest = await this.getManifest();

    // If a custom build manifest path is configured
    if (this._config.buildManifestPath) {
      return this._config.buildManifestPath;
    }
    // If the polywrap.yaml manifest specifies a custom build manifest
    else if (polywrapManifest.extensions?.build) {
      this._config.buildManifestPath = path.join(
        this.getManifestDir(),
        polywrapManifest.extensions.build
      );
      return this._config.buildManifestPath;
    }

    return undefined;
  }

  public async getBuildManifest(): Promise<BuildManifest> {
    if (!this._buildManifest) {
      const buildManifestPath = await this.getBuildManifestPath();
      const language = await this.getManifestLanguage();

      this._buildManifest = await loadBuildManifest(
        language,
        buildManifestPath ??
          path.join(
            __dirname,
            "..",
            "defaults",
            "build-strategies",
            language,
            "default.build.yaml"
          ),
        this.logger
      );

      const root = this.getManifestDir();
      const cacheDir = this._cache.getCachePath(
        PolywrapProject.cacheLayout.buildLinkedPackagesDir
      );

      // Add default config variables
      const module = await this._getModule();
      const defaultConfig: Record<string, unknown> = {
        polywrap_manifests: (await this.getManifestPaths()).map(
          (path: string) => {
            return normalizePath(path);
          }
        ),
        polywrap_linked_packages: this._buildManifest.linked_packages?.map(
          (linkedPackage: { name: string }) => ({
            dir: path.relative(root, path.join(cacheDir, linkedPackage.name)),
            name: linkedPackage.name,
          })
        ),
      };
      if (module) {
        defaultConfig["polywrap_module"] = {
          name: "module",
          dir: normalizePath(module),
        };
      }

      if (!this._buildManifest.config) {
        this._buildManifest.config = defaultConfig;
      } else {
        this._buildManifest.config = {
          ...this._buildManifest.config,
          ...defaultConfig,
        };
      }
    }

    return this._buildManifest;
  }

  public async getBuildUuid(): Promise<string> {
    // Load the cached build UUID
    let uuid = this._cache.readCacheFile(
      PolywrapProject.cacheLayout.buildUuidFile
    );

    // If none was present, generate one
    if (!uuid) {
      uuid = createUUID();
      this._cache.writeCacheFile(
        PolywrapProject.cacheLayout.buildUuidFile,
        uuid,
        "utf-8"
      );
    }

    return uuid;
  }

  public async cacheBuildManifestLinkedPackages(): Promise<void> {
    const buildManifest = await this.getBuildManifest();

    if (buildManifest.linked_packages) {
      const rootDir = this.getManifestDir();
      const cacheSubPath = this._cache.getCachePath(
        PolywrapProject.cacheLayout.buildLinkedPackagesDir
      );

      buildManifest.linked_packages.map(
        (linkedPackage: { path: string; name: string; filter?: string }) => {
          const sourceDir = path.isAbsolute(linkedPackage.path)
            ? linkedPackage.path
            : path.join(rootDir, linkedPackage.path);
          const destinationDir = path.join(cacheSubPath, linkedPackage.name);

          // Update the cache
          this._cache.removeCacheDir(destinationDir);
          fsExtra.copySync(sourceDir, destinationDir, {
            overwrite: true,
            dereference: true,
            recursive: true,
            filter: (src: string) => {
              if (fs.lstatSync(src).isSymbolicLink()) {
                return false;
              }

              if (linkedPackage.filter) {
                const regexFilter = regexParser(linkedPackage.filter);
                const result = regexFilter.test(src);
                if (result) {
                  return false;
                }
              }

              return true;
            },
          });
        }
      );
    }
  }

  public async getManifestPaths(absolute = false): Promise<string[]> {
    const root = this.getManifestDir();
    const paths = [
      absolute
        ? this.getManifestPath()
        : path.relative(root, this.getManifestPath()),
    ];

    const buildManifestPath = await this.getBuildManifestPath();

    if (buildManifestPath) {
      paths.push(
        absolute ? buildManifestPath : path.relative(root, buildManifestPath)
      );
    }

    return paths;
  }

  /// Private Helpers

  private async _getModule(): Promise<string | undefined> {
    const manifest = await this.getManifest();

    if (manifest.source.module) {
      return path.dirname(manifest.source.module).replace("./", "");
    }

    return undefined;
  }

  private _getGenerationDirectory(generationSubPath = "src/wrap"): string {
    return path.join(this.getManifestDir(), generationSubPath);
  }
}
