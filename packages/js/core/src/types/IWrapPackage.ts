import { Wrapper } from ".";

import {
  DeserializeManifestOptions,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

// $start: IWrapPackage.ts

/** Options for IWrapPackage's getManifest method */
export interface GetManifestOptions {
  /** If true, manifest validation step will be skipped */
  noValidate?: boolean;
}

/** A wrap package, capable of producing instances of a wrapper and its manifest */
export interface IWrapPackage {
  /**
   * Produce an instance of the wrap manifest
   *
   * @param options - GetManifestOptions; customize manifest retrieval
   * @returns A Promise with a Result containing the wrap manifest or an error
   */
  getManifest(
    options?: GetManifestOptions
  ): Promise<Result<WrapManifest, Error>>;

  /**
   * Produce an instance of the wrapper
   *
   * @param options - DeserializeManifestOptions; customize manifest deserialization
   * @returns A Promise with a Result containing the wrapper or an error
   */
  createWrapper(
    options?: DeserializeManifestOptions
  ): Promise<Result<Wrapper, Error>>;
}

// $end
