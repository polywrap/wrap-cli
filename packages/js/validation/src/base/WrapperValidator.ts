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

  async validate(ops: WrapperReadOperations): Promise<ValidationResult> {
    let result = await this.validateManifests(ops);
    if (!result.valid) {
      return result;
    }

    // Validate schema
    if (!(await ops.exists("./schema.graphql"))) {
      return this.fail(ValidationFailReason.SchemaNotFound);
    }
    try {
      parseSchema(await ops.readFileAsString("./schema.graphql"));
    } catch {
      return this.fail(ValidationFailReason.InvalidSchema);
    }

    result = await this.validateStructure(ops);
    if (!result.valid) {
      return result;
    }

    return this.success();
  }

  private async validateStructure(
    ops: WrapperReadOperations
  ): Promise<ValidationResult> {
    const { result: pathResult } = await this.validatePath(ops, "./", 0, 0);

    if (!pathResult.valid) {
      return pathResult;
    }

    return this.success();
  }

  private async validatePath(
    ops: WrapperReadOperations,
    basePath: string,
    currentSize: number,
    currentFileCnt: number
  ): Promise<{
    result: ValidationResult;
    currentSize: number;
    currentFileCnt: number;
  }> {
    const items = await ops.readDir(basePath);
    for (const itemPath of items) {
      const stats = await ops.getStats(path.join(basePath, itemPath));

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
        } = await this.validatePath(
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

  private async validateManifests(
    ops: WrapperReadOperations
  ): Promise<ValidationResult> {
    let manifest: Web3ApiManifest | undefined;
    // Go through manifest names, if more than one wrap manifest exists, fail
    // If no wrap manifest exists or is invalid, also fail
    for (const manifestName of VALID_WRAP_MANIFEST_NAMES) {
      if (!(await ops.exists(manifestName))) {
        continue;
      }

      if (manifest) {
        return this.fail(ValidationFailReason.MultipleWrapManifests);
      }
      const manifestFile = await ops.readFileAsString(manifestName);
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
      const moduleResult = await this.validateModule(ops, queryModule);
      if (!moduleResult.valid) {
        return moduleResult;
      }
    }

    if (mutationModule) {
      const moduleResult = await this.validateModule(ops, mutationModule);
      if (!moduleResult.valid) {
        return moduleResult;
      }
    }

    let manifestValidationResult = await this.validateBuildManifest(
      ops,
      manifest
    );
    if (!manifestValidationResult.valid) {
      return manifestValidationResult;
    }

    manifestValidationResult = await this.validateMetaManifest(ops, manifest);
    if (!manifestValidationResult.valid) {
      return manifestValidationResult;
    }

    return this.success();
  }

  // Checking schema, extension and size
  private async validateModule(
    ops: WrapperReadOperations,
    moduleType: {
      schema: string;
      module?: string;
    }
  ): Promise<ValidationResult> {
    if (moduleType && moduleType.module) {
      if (!VALID_MODULE_EXTENSIONS.includes(path.extname(moduleType.module))) {
        return this.fail(ValidationFailReason.InvalidModuleExtension);
      }

      const moduleSize = (await ops.getStats(moduleType.module)).size;

      if (moduleSize > this.constraints.maxModuleSize) {
        return this.fail(ValidationFailReason.ModuleTooLarge);
      }
    }

    return this.success();
  }

  private async validateBuildManifest(
    ops: WrapperReadOperations,
    web3ApiManifest: Web3ApiManifest
  ): Promise<ValidationResult> {
    const buildManifestPath = web3ApiManifest.build;

    if (buildManifestPath) {
      const buildManifestFile = await ops.readFileAsString(buildManifestPath);
      try {
        deserializeBuildManifest(buildManifestFile);
      } catch {
        return this.fail(ValidationFailReason.InvalidBuildManifest);
      }
    }

    return this.success();
  }

  private async validateMetaManifest(
    ops: WrapperReadOperations,
    web3ApiManifest: Web3ApiManifest
  ): Promise<ValidationResult> {
    const metaManifestPath = web3ApiManifest.meta;

    if (metaManifestPath) {
      const metaManifestFile = await ops.readFileAsString(metaManifestPath);

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
