import { Invoker, Uri, InterfaceImplementations, Env, WrapError } from ".";
import { IUriResolutionContext, IUriResolver } from "../uri-resolution";
import { UriResolverHandler } from "./UriResolver";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

export interface CoreClientConfig<TUri extends Uri | string = Uri | string> {
  readonly interfaces?: Readonly<InterfaceImplementations<TUri>[]>;
  readonly envs?: Readonly<Env<TUri>[]>;
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
  getConfig(): CoreClientConfig<Uri>;

  getInterfaces(): readonly InterfaceImplementations<Uri>[] | undefined;

  getEnvs(): readonly Env<Uri>[] | undefined;

  getEnvByUri<TUri extends Uri | string>(uri: TUri): Env<Uri> | undefined;

  getResolver(): IUriResolver<unknown>;

  getManifest<TUri extends Uri | string>(
    uri: TUri
  ): Promise<Result<WrapManifest, WrapError>>;

  getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<Result<string | Uint8Array, WrapError>>;

  getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions
  ): Promise<Result<TUri[], WrapError>>;

  validate<TUri extends Uri | string>(
    uri: TUri,
    options?: ValidateOptions
  ): Promise<Result<true, WrapError>>;
}
