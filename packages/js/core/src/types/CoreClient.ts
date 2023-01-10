import { Invoker, Uri, InterfaceImplementations, Env, WrapError } from ".";
import { IUriResolutionContext, IUriResolver } from "../uri-resolution";
import { UriResolverHandler } from "./UriResolver";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

export interface CoreClientConfig {
  readonly interfaces?: Readonly<InterfaceImplementations[]>;
  readonly envs?: Readonly<Env[]>;
  readonly resolver: Readonly<IUriResolver<unknown>>;
}

export interface GetManifestOptions {
  noValidate?: boolean;
}

export interface GetFileOptions {
  path: string;
  encoding?: "utf-8" | string;
}

export interface GetImplementationsOptions {
  applyResolution?: boolean;
  resolutionContext?: IUriResolutionContext;
}

export interface ValidateOptions {
  abi?: boolean;
  recursive?: boolean;
}

export interface CoreClient extends Invoker, UriResolverHandler<unknown> {
  getConfig(): CoreClientConfig;

  getInterfaces(): readonly InterfaceImplementations[] | undefined;

  getEnvs(): readonly Env[] | undefined;

  getEnvByUri(uri: Uri): Env | undefined;

  getResolver(): IUriResolver<unknown>;

  getManifest(uri: Uri): Promise<Result<WrapManifest, WrapError>>;

  getFile(
    uri: Uri,
    options: GetFileOptions
  ): Promise<Result<string | Uint8Array, WrapError>>;

  getImplementations(
    uri: Uri,
    options: GetImplementationsOptions
  ): Promise<Result<Uri[], WrapError>>;
}
