import { VALID_WRAP_MANIFEST_NAMES } from "..";
import {
  WasmPackageConstraints,
  PackageReader,
  ValidationResult,
  ValidationFailReason,
} from ".";

import { parseSchema } from "@polywrap/schema-parse";
import path from "path";
import { WrapManifest, deserializeWrapManifest } from "@polywrap/core-js";

export class WasmPackageValidator {
  constructor(private constraints: WasmPackageConstraints) {}

  async validate(reader: PackageReader): Promise<ValidationResult> {
    let result = await this.validateManifests(reader);
    if (!result.valid) {
      return result;
    }

    result = await this.validateStructure(reader);
    if (!result.valid) {
      return result;
    }

    return this.success();
  }

  private async validateStructure(
    reader: PackageReader
  ): Promise<ValidationResult> {
    const { result: pathResult } = await this.validatePath(reader, "./", 0, 0);

    if (!pathResult.valid) {
      return pathResult;
    }

    return this.success();
  }

  private async validatePath(
    reader: PackageReader,
    basePath: string,
    currentSize: number,
    currentFileCnt: number
  ): Promise<{
    result: ValidationResult;
    currentSize: number;
    currentFileCnt: number;
  }> {
    const items = await reader.readDir(basePath);
    for (const itemPath of items) {
      const stats = await reader.getStats(path.join(basePath, itemPath));

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
          reader,
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
    reader: PackageReader
  ): Promise<ValidationResult> {
    const WRAP_INFO = "wrap.info";
    if (!(await reader.exists(WRAP_INFO))) {
      return this.fail(ValidationFailReason.WrapManifestNotFound);
    }

    const info = await reader.readFile(WRAP_INFO);
    const manifest: WrapManifest | undefined = deserializeWrapManifest(info);
    // Go through manifest names, if more than one wrap manifest exists, fail
    // If no wrap manifest exists or is invalid, also fail
    for (const manifestName of VALID_WRAP_MANIFEST_NAMES) {
      if (!(await reader.exists(manifestName))) {
        continue;
      }

      // if (manifest) {
      //   return this.fail(ValidationFailReason.MultipleWrapManifests);
      // }
      // try {
      // } catch (err) {
      //   return this.fail(ValidationFailReason.InvalidWrapManifest, err);
      // }
    }

    if (!manifest) {
      return this.fail(ValidationFailReason.WrapManifestNotFound);
    }

    const schemaResult = await this.validateSchema(reader, "schema.graphql");
    if (!schemaResult.valid) {
      return schemaResult;
    }

    const moduleResult = await this.validateModule(reader, "wrap.wasm");
    if (!moduleResult.valid) {
      return moduleResult;
    }

    let manifestValidationResult = await this.validateBuildManifest(
      reader,
      manifest
    );
    if (!manifestValidationResult.valid) {
      return manifestValidationResult;
    }

    manifestValidationResult = await this.validateMetaManifest(
      reader,
      manifest
    );
    if (!manifestValidationResult.valid) {
      return manifestValidationResult;
    }

    return this.success();
  }

  private async validateSchema(
    reader: PackageReader,
    schemaFilePath: string
  ): Promise<ValidationResult> {
    if (!(await reader.exists(schemaFilePath))) {
      return this.fail(ValidationFailReason.SchemaNotFound);
    }
    try {
      parseSchema(await reader.readFileAsString(schemaFilePath));
    } catch (err) {
      return this.fail(ValidationFailReason.InvalidSchema, err);
    }

    return this.success();
  }

  private async validateModule(
    reader: PackageReader,
    moduleFilePath: string | undefined
  ): Promise<ValidationResult> {
    if (!moduleFilePath) {
      return this.success();
    }

    const moduleSize = (await reader.getStats(moduleFilePath)).size;

    if (moduleSize > this.constraints.maxModuleSize) {
      return this.fail(ValidationFailReason.ModuleTooLarge);
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
