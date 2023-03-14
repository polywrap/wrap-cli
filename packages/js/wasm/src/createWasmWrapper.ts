import { IFileReader, WasmWrapper } from ".";
import { createWasmPackage } from "./createWasmPackage";

import { GetManifestOptions } from "@polywrap/core-js";

// Helper function for creating wasm wrappers
// Not meant for exporting out of this library
export const createWasmWrapper = async (
  manifestBufferOrFileReader: Uint8Array | IFileReader,
  wasmModuleOrFileReaderOrManifestOptions?:
    | Uint8Array
    | IFileReader
    | GetManifestOptions,
  fileReaderOrManifestOptions?: IFileReader | GetManifestOptions,
  manifestOptions?: GetManifestOptions
): Promise<WasmWrapper> => {
  if (
    !wasmModuleOrFileReaderOrManifestOptions ||
    (wasmModuleOrFileReaderOrManifestOptions as GetManifestOptions)
      .noValidate !== undefined
  ) {
    const result = await createWasmPackage(
      manifestBufferOrFileReader
    ).createWrapper(
      wasmModuleOrFileReaderOrManifestOptions as GetManifestOptions
    );

    if (!result.ok) {
      throw result.error;
    }
    return result.value as WasmWrapper;
  } else if (
    !fileReaderOrManifestOptions ||
    (fileReaderOrManifestOptions as GetManifestOptions).noValidate !== undefined
  ) {
    const result = await createWasmPackage(
      manifestBufferOrFileReader,
      wasmModuleOrFileReaderOrManifestOptions as Uint8Array | IFileReader
    ).createWrapper(fileReaderOrManifestOptions as GetManifestOptions);

    if (!result.ok) {
      throw result.error;
    }

    return result.value as WasmWrapper;
  } else {
    const result = await createWasmPackage(
      manifestBufferOrFileReader,
      wasmModuleOrFileReaderOrManifestOptions as Uint8Array,
      fileReaderOrManifestOptions as IFileReader
    ).createWrapper(manifestOptions);

    if (!result.ok) {
      throw result.error;
    }

    return result.value as WasmWrapper;
  }
};
