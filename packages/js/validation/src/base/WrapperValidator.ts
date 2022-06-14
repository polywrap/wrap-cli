import {
  WrapperConstraints,
  WrapperReadOperations,
  ValidationResult,
  ValidationFailReason,
  VALID_WRAP_MANIFEST_NAMES,
  VALID_MODULE_EXTENSIONS,
  SCHEMA_FILE_NAME,
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
  constructor(private constraints: WrapperConstraints) {}

  async validate(ops: WrapperReadOperations): Promise<ValidationResult> {
    let result = await this.validateManifests(ops);
    if (!result.valid) {
      return result;
    }

    if (!(await ops.exists(SCHEMA_FILE_NAME))) {
      return this.fail(ValidationFailReason.SchemaNotFound);
    }
    try {
      parseSchema(await ops.readFileAsString(SCHEMA_FILE_NAME));
    } catch (err) {
      return this.fail(ValidationFailReason.InvalidSchema, err);
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
      } catch (err) {
        return this.fail(ValidationFailReason.InvalidWrapManifest, err);
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
    const manifestPath = web3ApiManifest.build;

    if (manifestPath) {
      // Manifests get built as a `.json` file so we need to change the extension
      const fileName = path.parse(manifestPath).name;
      const fullManifestName = `${fileName}.json`;

      const buildManifestFile = await ops.readFileAsString(fullManifestName);
      try {
        deserializeBuildManifest(buildManifestFile);
      } catch (err) {
        return this.fail(ValidationFailReason.InvalidBuildManifest, err);
      }
    }

    return this.success();
  }

  private async validateMetaManifest(
    ops: WrapperReadOperations,
    web3ApiManifest: Web3ApiManifest
  ): Promise<ValidationResult> {
    const manifestPath = web3ApiManifest.meta;

    if (manifestPath) {
      // Manifests get built as a `.json` file so we need to change the extension
      const fileName = path.parse(manifestPath).name;
      const fullManifestName = `${fileName}.json`;

      const metaManifestFile = await ops.readFileAsString(fullManifestName);

      try {
        deserializeMetaManifest(metaManifestFile);
      } catch (err) {
        return this.fail(ValidationFailReason.InvalidMetaManifest, err);
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
    reason: ValidationFailReason,
    error: Error | undefined = undefined
  ): ValidationResult {
    return {
      valid: false,
      failReason: reason,
      failError: error,
    };
  }
}
