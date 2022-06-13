import {
  WrapperContraints,
  WrapperReadOperations,
  ValidationResult,
  ValidationFailReason,
  VALID_WRAP_MANIFEST_NAMES,
  VALID_MODULE_EXTENSIONS,
} from ".";

import { parseSchema } from "@web3api/schema-parse";
import {
  deserializeWeb3ApiManifest,
  deserializeBuildManifest,
  deserializeMetaManifest,
  Web3ApiManifest,
} from "@web3api/core-js";
import path from "path";

export class WrapperValidator {
  constructor(private constraints: WrapperContraints) {}

  validate(ops: WrapperReadOperations): ValidationResult {
    let result = this.validateManifests(ops);
    if (!result.valid) {
      return result;
    }

    // Validate schema
    if (!ops.exists("./schema.graphql")) {
      return this.fail(ValidationFailReason.SchemaNotFound);
    }
    try {
      parseSchema(ops.readFileAsString("./schema.graphql"));
    } catch {
      return this.fail(ValidationFailReason.InvalidSchema);
    }

    result = this.validateStructure(ops);
    if (!result.valid) {
      return result;
    }

    return this.success();
  }

  private validateStructure(ops: WrapperReadOperations): ValidationResult {
    const { result: pathResult } = this.validatePath(ops, "./", 0, 0);

    if (!pathResult.valid) {
      return pathResult;
    }

    return this.success();
  }

  private validatePath(
    ops: WrapperReadOperations,
    basePath: string,
    currentSize: number,
    currentFileCnt: number
  ): {
    result: ValidationResult;
    currentSize: number;
    currentFileCnt: number;
  } {
    for (const itemPath of ops.readDir(basePath)) {
      const stats = ops.getStats(path.join(basePath, itemPath));

      currentSize += stats.size;
      if (currentSize > this.constraints.maxSize) {
        return {
          result: this.fail(ValidationFailReason.WrapperTooLarge),
          currentSize,
          currentFileCnt,
        };
      }

      currentFileCnt++;
      if (currentFileCnt > this.constraints.maxNumberOfFiles) {
        return {
          result: this.fail(ValidationFailReason.TooManyFiles),
          currentSize,
          currentFileCnt,
        };
      }

      if (stats.isFile) {
        if (stats.size > this.constraints.maxFileSize) {
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
          ops,
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

  private validateManifests(ops: WrapperReadOperations): ValidationResult {
    let manifest: Web3ApiManifest | undefined;
    // Go through manifest names, if more than one wrap manifest exists, fail
    // If no wrap manifest exists or is invalid, also fail
    for (const manifestName of VALID_WRAP_MANIFEST_NAMES) {
      if (!ops.exists(manifestName)) {
        continue;
      }

      if (manifest) {
        return this.fail(ValidationFailReason.MultipleWrapManifests);
      }
      const manifestFile = ops.readFileAsString(manifestName);
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

    if (queryModule) {
      const moduleResult = this.validateModule(ops, queryModule);
      if (!moduleResult.valid) {
        return moduleResult;
      }
    }

    if (mutationModule) {
      const moduleResult = this.validateModule(ops, mutationModule);
      if (!moduleResult.valid) {
        return moduleResult;
      }
    }

    let manifestValidationResult = this.validateBuildManifest(ops, manifest);
    if (!manifestValidationResult.valid) {
      return manifestValidationResult;
    }

    manifestValidationResult = this.validateMetaManifest(ops, manifest);
    if (!manifestValidationResult.valid) {
      return manifestValidationResult;
    }

    return this.success();
  }

  // Checking schema, extension and size
  private validateModule(
    ops: WrapperReadOperations,
    moduleType: {
      schema: string;
      module?: string;
    }
  ): ValidationResult {
    if (moduleType && moduleType.module) {
      if (!VALID_MODULE_EXTENSIONS.includes(path.extname(moduleType.module))) {
        return this.fail(ValidationFailReason.InvalidModuleExtension);
      }

      const moduleSize = ops.getStats(moduleType.module).size;

      if (moduleSize > this.constraints.maxModuleSize) {
        return this.fail(ValidationFailReason.ModuleTooLarge);
      }
    }

    return this.success();
  }

  private validateBuildManifest(
    ops: WrapperReadOperations,
    web3ApiManifest: Web3ApiManifest
  ): ValidationResult {
    const buildManifestPath = web3ApiManifest.build;

    if (buildManifestPath) {
      const buildManifestFile = ops.readFileAsString(buildManifestPath);
      try {
        deserializeBuildManifest(buildManifestFile);
      } catch {
        return this.fail(ValidationFailReason.InvalidBuildManifest);
      }
    }

    return this.success();
  }

  private validateMetaManifest(
    ops: WrapperReadOperations,
    web3ApiManifest: Web3ApiManifest
  ): ValidationResult {
    const metaManifestPath = web3ApiManifest.meta;

    if (metaManifestPath) {
      const metaManifestFile = ops.readFileAsString(metaManifestPath);

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
