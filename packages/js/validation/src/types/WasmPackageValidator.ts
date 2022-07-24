import {
  PackageReader,
  ValidationFailReason,
  ValidationResult,
  WasmPackageConstraints,
  WRAP_INFO,
  WRAP_WASM,
} from "..";

import {
  WrapManifest,
  deserializeWrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import * as path from "path";

export class WasmPackageValidator {
  constructor(private constraints: WasmPackageConstraints) {}

  async validate(reader: PackageReader): Promise<ValidationResult> {
    const infoResult = await this.validateInfo(reader, WRAP_INFO);
    if (!infoResult.valid) {
      return infoResult;
    }

    const manifest = infoResult.manifest as WrapManifest;

    const moduleResult = await this.validateModule(reader, manifest);
    if (!moduleResult.valid) {
      return moduleResult;
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
          result: this.fail(ValidationFailReason.PackageTooLarge),
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
  ): Promise<ValidationResult & { manifest?: WrapManifest }> {
    if (!(await reader.exists(name))) {
      return this.fail(ValidationFailReason.WrapManifestNotFound);
    }

    const structureResult = await this.validateStructure(reader);
    if (!structureResult.valid) {
      return structureResult;
    }

    try {
      const info = await reader.readFile(name);
      return {
        valid: true,
        manifest: deserializeWrapManifest(info),
      };
    } catch (e) {
      if (e.message.includes('instance requires property "abi"')) {
        return this.fail(ValidationFailReason.AbiNotFound);
      } else if (
        e.message.includes("instance.abi") &&
        e.message.includes("Validation errors encountered")
      ) {
        return this.fail(ValidationFailReason.InvalidAbi);
      }
      return this.fail(ValidationFailReason.InvalidWrapManifest);
    }
  }

  private async validateModule(
    reader: PackageReader,
    manifest: WrapManifest
  ): Promise<ValidationResult> {
    if (manifest.type === "interface") {
      return this.success();
    }

    const module = await reader.getStats(WRAP_WASM);
    if (module.size > this.constraints.maxModuleSize) {
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
