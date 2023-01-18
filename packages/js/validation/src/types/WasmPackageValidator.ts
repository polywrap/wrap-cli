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
  constructor(private _constraints: WasmPackageConstraints) {}

  async validate(reader: PackageReader): Promise<ValidationResult> {
    const infoResult = await this._validateInfo(reader, WRAP_INFO);
    if (!infoResult.valid) {
      return infoResult;
    }

    const manifest = infoResult.manifest as WrapManifest;

    const moduleResult = await this._validateModule(reader, manifest);
    if (!moduleResult.valid) {
      return moduleResult;
    }

    return this._success();
  }

  private async _validateStructure(
    reader: PackageReader
  ): Promise<ValidationResult> {
    const { result: pathResult } = await this._validatePath(reader, "./", 0, 0);

    if (!pathResult.valid) {
      return pathResult;
    }

    return this._success();
  }

  private async _validatePath(
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
      if (currentSize > this._constraints.maxSize) {
        return {
          result: this._fail(ValidationFailReason.PackageTooLarge),
          currentSize,
          currentFileCnt,
        };
      }

      currentFileCnt++;
      if (currentFileCnt > this._constraints.maxNumberOfFiles) {
        return {
          result: this._fail(ValidationFailReason.TooManyFiles),
          currentSize,
          currentFileCnt,
        };
      }

      if (stats.isFile) {
        if (stats.size > this._constraints.maxFileSize) {
          return {
            result: this._fail(ValidationFailReason.FileTooLarge),
            currentSize,
            currentFileCnt,
          };
        }
      } else {
        const {
          result,
          currentSize: newSize,
          currentFileCnt: newFileCnt,
        } = await this._validatePath(
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
      result: this._success(),
      currentSize,
      currentFileCnt,
    };
  }

  private async _validateInfo(
    reader: PackageReader,
    name: string
  ): Promise<ValidationResult & { manifest?: WrapManifest }> {
    if (!(await reader.exists(name))) {
      return this._fail(ValidationFailReason.WrapManifestNotFound);
    }

    const structureResult = await this._validateStructure(reader);
    if (!structureResult.valid) {
      return structureResult;
    }

    try {
      const info = await reader.readFile(name);
      return {
        valid: true,
        manifest: await deserializeWrapManifest(info),
      };
    } catch (e) {
      if (e.message.includes('instance requires property "abi"')) {
        return this._fail(ValidationFailReason.AbiNotFound);
      } else if (
        e.message.includes("instance.abi") &&
        e.message.includes("Validation errors encountered")
      ) {
        return this._fail(ValidationFailReason.InvalidAbi);
      }
      return this._fail(ValidationFailReason.InvalidWrapManifest);
    }
  }

  private async _validateModule(
    reader: PackageReader,
    manifest: WrapManifest
  ): Promise<ValidationResult> {
    if (manifest.type === "interface") {
      return this._success();
    }

    const module = await reader.getStats(WRAP_WASM);
    if (module.size > this._constraints.maxModuleSize) {
      return this._fail(ValidationFailReason.ModuleTooLarge);
    }

    return this._success();
  }

  private _success(): ValidationResult {
    return {
      valid: true,
    };
  }

  private _fail(
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
