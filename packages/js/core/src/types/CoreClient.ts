import { Invoker, Uri, InterfaceImplementations, Env, WrapError } from ".";
import { IUriResolutionContext, IUriResolver } from "../uri-resolution";
import { UriResolverHandler } from "./UriResolver";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

// $start: CoreClient.ts

/** Core Client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors */
export interface CoreClientConfig {
  /** set environmental variables for a wrapper */
  readonly interfaces?: Readonly<InterfaceImplementations[]>;

  /** register interface implementations */
  readonly envs?: Readonly<Env[]>;

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

/** CoreClient invokes wrappers and interacts with wrap packages. */
export interface CoreClient extends Invoker, UriResolverHandler<unknown> {
  /**
   * Returns the configuration used to instantiate the client
   *
   * @returns an immutable core client config
   */
  getConfig(): CoreClientConfig;

  /**
   * returns all interfaces from the configuration used to instantiate the client
   *
   * @returns an array of interfaces and their registered implementations
   */
  getInterfaces(): readonly InterfaceImplementations[] | undefined;

  /**
   * returns all env registrations from the configuration used to instantiate the client
   *
   * @returns an array of env objects containing wrapper environmental variables
   */
  getEnvs(): readonly Env[] | undefined;

  /**
   * returns an env (a set of environmental variables) from the configuration used to instantiate the client
   *
   * @param uri - the URI used to register the env
   * @returns an env, or undefined if an env is not found at the given URI
   */
  getEnvByUri(uri: Uri): Env | undefined;

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
  getManifest(uri: Uri): Promise<Result<WrapManifest, WrapError>>;

  /**
   * returns a file contained in a wrap package
   *
   * @param uri - a wrap URI
   * @param options - { path: string; encoding?: "utf-8" | string }
   * @returns a Promise of a Result containing a file if the request was successful
   */
  getFile(
    uri: Uri,
    options: GetFileOptions
  ): Promise<Result<string | Uint8Array, WrapError>>;

  /**
   * returns the interface implementations associated with an interface URI
   *  from the configuration used to instantiate the client
   *
   * @param uri - a wrap URI
   * @param options - { applyResolution?: boolean; resolutionContext?: IUriResolutionContext }
   * @returns a Result containing URI array if the request was successful
   */
  getImplementations(
    uri: Uri,
    options: GetImplementationsOptions
  ): Promise<Result<Uri[], WrapError>>;
}

// $end
