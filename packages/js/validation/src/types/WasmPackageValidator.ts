import { GRAPHQL_SCHEMA, META_MANIFEST, WRAP_INFO, WRAP_WASM } from "..";
import {
  WasmPackageConstraints,
  PackageReader,
  ValidationResult,
  ValidationFailReason,
} from ".";

import { parseSchema } from "@polywrap/schema-parse";
import { WrapManifest, deserializeWrapManifest } from "@polywrap/core-js";
import { deserializeMetaManifest } from "polywrap/src/lib";
import * as path from "path";

export class WasmPackageValidator {
  constructor(private constraints: WasmPackageConstraints) {}

  async validate(reader: PackageReader): Promise<ValidationResult> {
    const infoResult = await this.validateInfo(reader, WRAP_INFO);
    if (!infoResult.valid) {
      return infoResult;
    }

    const schemaResult = await this.validateSchema(reader, GRAPHQL_SCHEMA);
    if (!schemaResult.valid) {
      return schemaResult;
    }

    const moduleResult = await this.validateModule(reader, WRAP_WASM);
    if (!moduleResult.valid) {
      return moduleResult;
    }

    const metaResult = await this.validateMetaManifest(reader, META_MANIFEST);
    if (!metaResult.valid) {
      return metaResult;
    }
    return this.success();
  }

  private async validateStructure(
    reader: PackageReader,
    path: string
  ): Promise<ValidationResult> {
    const { result: pathResult } = await this.validatePath(reader, path, 0, 0);

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

  private async validateInfo(
    reader: PackageReader,
    name: string
  ): Promise<ValidationResult> {
    const info = await reader.readFile(name);
    const manifest: WrapManifest | undefined = deserializeWrapManifest(info);

    if (!manifest) {
      return this.fail(ValidationFailReason.WrapManifestNotFound);
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

  private async validateMetaManifest(
    reader: PackageReader,
    path: string
  ): Promise<ValidationResult> {
    if (await reader.exists(path)) {
      const metaManifestFile = await reader.readFileAsString(path);
      try {
        deserializeMetaManifest(metaManifestFile);
        // If folder manifest exists, check it
        if (await reader.exists("./meta")) {
          return await this.validateStructure(reader, "./meta");
        }
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
