import { Invoker, Uri, InterfaceImplementations, Env } from ".";
import { IUriResolutionContext, IUriResolver } from "../uri-resolution";
import { UriResolverHandler } from "./UriResolver";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

/** Core Client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors */
export interface CoreClientConfig<TUri extends Uri | string = Uri | string> {
  /** set environmental variables for a wrapper */
  readonly interfaces?: Readonly<InterfaceImplementations<TUri>[]>;

  /** register interface implementations */
  readonly envs?: Readonly<Env<TUri>[]>;

  /** configure URI resolution for redirects, packages, and wrappers */
  readonly resolver: Readonly<IUriResolver<unknown>>;
}

/** Options for CoreClient's getFile method */
export interface GetFileOptions {
  /** file path from wrapper root */
  path: string;

  /** file encoding */
  encoding?: "utf-8" | string;
}

/** Options for CoreClient's getImplementations method */
export interface GetImplementationsOptions {
  /** If true, follow redirects to resolve URIs */
  applyResolution?: boolean;

  /** Use and update an existing resolution context */
  resolutionContext?: IUriResolutionContext;
}

/** Options for CoreClient's validate method */
export interface ValidateOptions {
  /** Validate full ABI */
  abi?: boolean;

  /** Recursively validate import URIs */
  recursive?: boolean;
}

/** CoreClient invokes wrapper functions, and interacts with wrap packages. */
export interface CoreClient extends Invoker, UriResolverHandler<unknown> {
  /**
   * Returns the configuration used to instantiate the client
   *
   * @returns an immutable core client config
   */
  getConfig(): CoreClientConfig<Uri>;

  /**
   * returns all interfaces from the configuration used to instantiate the client
   *
   * @returns an array of interfaces and their registered implementations
   */
  getInterfaces(): readonly InterfaceImplementations<Uri>[] | undefined;

  /**
   * returns all env registrations from the configuration used to instantiate the client
   *
   * @returns an array of env objects containing wrapper environmental variables
   */
  getEnvs(): readonly Env<Uri>[] | undefined;

  /**
   * returns an env (a set of environmental variables) from the configuration used to instantiate the client
   *
   * @param uri - the URI used to register the env
   * @returns an env, or undefined if an env is not found at the given URI
   */
  getEnvByUri<TUri extends Uri | string>(uri: TUri): Env<Uri> | undefined;

  /**
   * returns the URI resolver from the configuration used to instantiate the client
   *
   * @returns an object that implements the IUriResolver interface
   */
  getResolver(): IUriResolver<unknown>;

  /**
   * returns a package's wrap manifest
   *
   * @param uri - a wrap URI
   * @returns a Result containing the WrapManifest if the request was successful
   */
  getManifest<TUri extends Uri | string>(
    uri: TUri
  ): Promise<Result<WrapManifest, Error>>;

  /**
   * returns a file contained in a wrap package
   *
   * @param uri - a wrap URI
   * @param options - { path: string; encoding?: "utf-8" | string }
   * @returns a Promise of a Result containing a file if the request was successful
   */
  getFile<TUri extends Uri | string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<Result<string | Uint8Array, Error>>;

  /**
   * returns the interface implementations associated with an interface URI
   *  from the configuration used to instantiate the client
   *
   * @param uri - a wrap URI
   * @param options - { applyResolution?: boolean; resolutionContext?: IUriResolutionContext }
   * @returns a Result containing URI array if the request was successful
   */
  getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions
  ): Promise<Result<TUri[], Error>>;

  /**
   * Validate a wrapper, given a URI.
   * Optionally, validate the full ABI and/or recursively validate imports.
   *
   * @param uri: the Uri to resolve
   * @param options - { abi?: boolean; recursive?: boolean }
   * @returns A Promise with a Result containing a boolean or Error
   */
  validate<TUri extends Uri | string>(
    uri: TUri,
    options?: ValidateOptions
  ): Promise<Result<true, Error>>;
}
