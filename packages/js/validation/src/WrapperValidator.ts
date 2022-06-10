import {
  deserializeWeb3ApiManifest,
  deserializeBuildManifest,
  deserializeDeployManifest,
  deserializeMetaManifest,
  Web3ApiManifest,
} from "@web3api/core-js";
import { parseSchema } from "@web3api/schema-parse";
import path from "path";

export type Stats = {
  isFile: boolean;
  isDir: boolean;
  size: number;
};

export type ValidatorConfig = {
  maxSize: number;
  maxFileSize: number;
  maxModuleSize: number;
  maxNumberOfFiles: number;
  readFileAsString: (path: string) => string;
  readFile: (path: string) => Buffer;
  exists: (path: string) => boolean;
  getStats: (path: string) => Stats;
  readDir: (path: string) => Iterable<string>;
};

export enum ValidationFailReason {
  InvalidWrapManifest,
  MultipleWrapManifests,
  WrapManifestNotFound,
  InvalidBuildManifest,
  InvalidDeployManifest,
  InvalidMetaManifest,
  InvalidModuleExtension,
  FileTooLarge,
  WrapperTooLarge,
  ModuleTooLarge,
  InvalidSchema,
  TooManyFiles,
}

export type ValidationResult = {
  valid: boolean;
  failReason?: ValidationFailReason;
};

const VALID_MODULE_EXTENSIONS = ["wasm"];
const VALID_WRAP_MANIFEST_NAMES = [
  "web3api.json",
  "web3api.yaml",
  "web3api.yml",
];

export class WrapperValidator {
  constructor(private config: ValidatorConfig) {}

  validate(): ValidationResult {
    let result = this.validateManifests();
    if (!result.valid) {
      return result;
    }

    result = this.validateStructure();
    if (!result.valid) {
      return result;
    }

    return this.success();
  }

  private validateStructure(): ValidationResult {
    const { result: pathResult } = this.validatePath("./", 0, 0);

    if (!pathResult.valid) {
      return pathResult;
    }

    return this.success();
  }

  private validatePath(
    basePath: string,
    currentSize: number,
    currentFileCnt: number
  ): {
    result: ValidationResult;
    currentSize: number;
    currentFileCnt: number;
  } {
    for (const itemPath of this.config.readDir(basePath)) {
      const stats = this.config.getStats(path.join(basePath, itemPath));

      currentSize += stats.size;
      if (currentSize > this.config.maxSize) {
        return {
          result: this.fail(ValidationFailReason.WrapperTooLarge),
          currentSize,
          currentFileCnt,
        };
      }

      currentFileCnt++;
      if (currentFileCnt > this.config.maxNumberOfFiles) {
        return {
          result: this.fail(ValidationFailReason.TooManyFiles),
          currentSize,
          currentFileCnt,
        };
      }

      if (stats.isFile) {
        if (stats.size > this.config.maxFileSize) {
          return {
            result: this.fail(ValidationFailReason.FileTooLarge),
            currentSize,
            currentFileCnt,
          };
        }
      } else {
        const {
          result,
          currentSize: newSize,
          currentFileCnt: newFileCnt,
        } = this.validatePath(
          path.join(basePath, itemPath),
          currentSize,
          currentFileCnt
        );
        currentSize = newSize;
        currentFileCnt = newFileCnt;

        if (!result.valid) {
          return {
            result,
            currentSize,
            currentFileCnt,
          };
        }
      }
    }

    return {
      result: this.success(),
      currentSize,
      currentFileCnt,
    };
  }

  private validateManifests(): ValidationResult {
    let manifest: Web3ApiManifest | undefined;
    // Go through manifest names, if more than one wrap manifest exists, fail
    // If no wrap manifest exists or is invalid, also fail
    for (const manifestName of VALID_WRAP_MANIFEST_NAMES) {
      if (!this.config.exists(manifestName)) {
        continue;
      }

      if (manifest) {
        return this.fail(ValidationFailReason.MultipleWrapManifests);
      }
      const manifestFile = this.config.readFileAsString(manifestName);
      try {
        manifest = deserializeWeb3ApiManifest(manifestFile);
      } catch {
        return this.fail(ValidationFailReason.InvalidWrapManifest);
      }
    }

    if (!manifest) {
      return this.fail(ValidationFailReason.WrapManifestNotFound);
    }

    const queryModule = manifest.modules.query;
    const mutationModule = manifest.modules.mutation;

    queryModule && this.validateModule(queryModule);
    mutationModule && this.validateModule(mutationModule);

    let manifestValidationResult = this.validateBuildManifest(manifest);
    if (!manifestValidationResult.valid) {
      return manifestValidationResult;
    }

    manifestValidationResult = this.validateDeployManifest(manifest);
    if (!manifestValidationResult.valid) {
      return manifestValidationResult;
    }

    manifestValidationResult = this.validateMetaManifest(manifest);
    if (!manifestValidationResult.valid) {
      return manifestValidationResult;
    }

    return this.success();
  }

  // Checking schema, extension and size
  private validateModule(moduleType: {
    schema: string;
    module?: string;
  }): ValidationResult {
    // Validate schema
    // TODO: module mentions separate schemas
    try {
      parseSchema(moduleType.schema);
    } catch {
      return this.fail(ValidationFailReason.InvalidSchema);
    }

    if (moduleType && moduleType.module) {
      if (!VALID_MODULE_EXTENSIONS.includes(path.extname(moduleType.module))) {
        return this.fail(ValidationFailReason.InvalidModuleExtension);
      }

      const moduleSize = this.config.getStats(moduleType.module).size;
      if (moduleSize > this.config.maxModuleSize) {
        return this.fail(ValidationFailReason.ModuleTooLarge);
      }
    }

    return this.success();
  }

  private validateBuildManifest(
    web3ApiManifest: Web3ApiManifest
  ): ValidationResult {
    const buildManifestPath = web3ApiManifest.build;

    if (buildManifestPath) {
      const buildManifestFile = this.config.readFileAsString(buildManifestPath);
      try {
        deserializeBuildManifest(buildManifestFile);
      } catch {
        return this.fail(ValidationFailReason.InvalidBuildManifest);
      }
    }

    return this.success();
  }

  private validateDeployManifest(
    web3ApiManifest: Web3ApiManifest
  ): ValidationResult {
    const deployManifestPath = web3ApiManifest.deploy;

    if (deployManifestPath) {
      const deployManifestFile = this.config.readFileAsString(
        deployManifestPath
      );

      try {
        deserializeDeployManifest(deployManifestFile);
      } catch {
        return this.fail(ValidationFailReason.InvalidDeployManifest);
      }
    }

    return this.success();
  }

  private validateMetaManifest(
    web3ApiManifest: Web3ApiManifest
  ): ValidationResult {
    const metaManifestPath = web3ApiManifest.meta;

    if (metaManifestPath) {
      const metaManifestFile = this.config.readFileAsString(metaManifestPath);

      try {
        deserializeMetaManifest(metaManifestFile);
      } catch {
        return this.fail(ValidationFailReason.InvalidMetaManifest);
      }
    }

    return this.success();
  }

  private success(): ValidationResult {
    return {
      valid: true,
    };
  }

  private fail(
    reason: ValidationFailReason
  ): {
    valid: boolean;
    failReason: ValidationFailReason;
  } {
    return {
      valid: false,
      failReason: reason,
    };
  }
}
