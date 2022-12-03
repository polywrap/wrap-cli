// import { UriResolverError } from "./UriResolverError";

import {
  // Wrapper,
  // CoreClient,
  CoreClientConfig,
  Env,
  // GetFileOptions,
  GetImplementationsOptions,
  InterfaceImplementations,
  // InvokeOptions,
  // InvokerOptions,
  // QueryOptions,
  Uri,
  // createQueryDocument,
  getImplementations,
  // parseQuery,
  // TryResolveUriOptions,
  IUriResolver,
  // IUriResolutionContext,
  // UriPackageOrWrapper,
  // UriResolutionContext,
  // getEnvFromUriHistory,
  // QueryResult,
  // InvokeResult,
} from "@polywrap/core-js";
// import { buildCleanUriHistory } from "@polywrap/uri-resolvers-js";
// import { msgpackEncode, msgpackDecode } from "@polywrap/msgpack-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export class PolywrapClient {
  private _config: CoreClientConfig<Uri>;

  constructor(config: CoreClientConfig<Uri>) {
    this._config = config;
  }

  public getConfig(): CoreClientConfig<Uri> {
    return this._config;
  }

  public getInterfaces(): readonly InterfaceImplementations<Uri>[] | undefined {
    return this._config.interfaces;
  }

  public getEnvs(): readonly Env<Uri>[] | undefined {
    return this._config.envs;
  }

  public getResolver(): IUriResolver<unknown> {
    return this._config.resolver;
  }

  public getEnvByUri<TUri extends Uri | string>(
    uri: TUri
  ): Env<Uri> | undefined {
    const uriUri = Uri.from(uri);

    const envs = this.getEnvs();
    if (!envs) {
      return undefined;
    }

    return envs.find((environment) => Uri.equals(environment.uri, uriUri));
  }

  public async getImplementations<TUri extends Uri | string>(
    uri: TUri,
    options: GetImplementationsOptions = {}
  ): Promise<Result<TUri[], Error>> {
    const isUriTypeString = typeof uri === "string";
    const applyResolution = !!options.applyResolution;

    const getImplResult = await getImplementations(
      Uri.from(uri),
      this.getInterfaces() ?? [],
      applyResolution ? this : undefined,
      applyResolution ? options.resolutionContext : undefined
    );

    if (!getImplResult.ok) {
      return getImplResult;
    }

    const uris = isUriTypeString
      ? (getImplResult.value.map((x: Uri) => x.uri) as TUri[])
      : (getImplResult.value as TUri[]);

    return ResultOk(uris);
  }

  /**
   * returns a package's wrap manifest
   *
   * @param uri - a wrap URI
   * @param options - { noValidate?: boolean }
   * @returns a Result containing the WrapManifest if the request was successful
   */

  // public async getManifest<TUri extends Uri | string>(
  //   uri: TUri
  // ): Promise<Result<unknown, Error>> {
  //   const load = await this.loadWrapper(Uri.from(uri), undefined);
  //   if (!load.ok) {
  //     return load;
  //   }
  //   const wrapper = load.value;
  //   const manifest = wrapper.getManifest();

  //   return ResultOk(manifest);
  // }

  // /**
  //  * returns a file contained in a wrap package
  //  *
  //  * @param uri - a wrap URI
  //  * @param options - { path: string; encoding?: "utf-8" | string }
  //  * @returns a Promise of a Result containing a file if the request was successful
  //  */
  // public async getFile<TUri extends Uri | string>(
  //   uri: TUri,
  //   options: GetFileOptions
  // ): Promise<Result<string | Uint8Array, Error>> {
  //   const load = await this.loadWrapper(Uri.from(uri), undefined);
  //   if (!load.ok) {
  //     return load;
  //   }
  //   const wrapper = load.value;

  //   return await wrapper.getFile(options);
  // }

  // /**
  //  * Invoke a wrapper using GraphQL query syntax
  //  *
  //  * @remarks
  //  * This method behaves similar to the invoke method and allows parallel requests,
  //  * but the syntax is more verbose. If the query is successful, data will be returned
  //  * and the `error` value of the returned object will be undefined. If the query fails,
  //  * the data property will be undefined and the error property will be populated.
  //  *
  //  * @param options - {
  //  *   // The Wrapper's URI
  //  *   uri: TUri;
  //  *
  //  *   // The GraphQL query to parse and execute, leading to one or more Wrapper invocations.
  //  *   query: string | QueryDocument;
  //  *
  //  *   // Variables referenced within the query string via GraphQL's '$variable' syntax.
  //  *   variables?: TVariables;
  //  * }
  //  *
  //  * @returns A Promise containing an object with either the data or an error
  //  */

  // public async query<
  //   TData extends Record<string, unknown> = Record<string, unknown>,
  //   TVariables extends Record<string, unknown> = Record<string, unknown>,
  //   TUri extends Uri | string = string
  // >(options: QueryOptions<TVariables, TUri>): Promise<QueryResult<TData>> {
  //   let result: QueryResult<TData>;

  //   err: try {
  //     const typedOptions: QueryOptions<TVariables, Uri> = {
  //       ...options,
  //       uri: Uri.from(options.uri),
  //     };

  //     const { uri, query, variables } = typedOptions;

  //     // Convert the query string into a query document
  //     const queryDocument =
  //       typeof query === "string" ? createQueryDocument(query) : query;

  //     // Parse the query to understand what's being invoked
  //     const parseResult = parseQuery(uri, queryDocument, variables);
  //     if (!parseResult.ok) {
  //       result = { errors: [parseResult.error as Error] };
  //       break err;
  //     }
  //     const queryInvocations = parseResult.value;

  //     // Execute all invocations in parallel
  //     const parallelInvocations: Promise<{
  //       name: string;
  //       result: InvokeResult<unknown>;
  //     }>[] = [];

  //     for (const invocationName of Object.keys(queryInvocations)) {
  //       parallelInvocations.push(
  //         this.invoke({
  //           ...queryInvocations[invocationName],
  //           uri: queryInvocations[invocationName].uri,
  //         }).then((result) => ({
  //           name: invocationName,
  //           result,
  //         }))
  //       );
  //     }

  //     // Await the invocations
  //     const invocationResults = await Promise.all(parallelInvocations);

  //     // Aggregate all invocation results
  //     const data: Record<string, unknown> = {};
  //     const errors: Error[] = [];

  //     for (const invocation of invocationResults) {
  //       if (invocation.result.ok) {
  //         data[invocation.name] = invocation.result.value;
  //       } else {
  //         errors.push(invocation.result.error as Error);
  //       }
  //     }

  //     result = {
  //       data: data as TData,
  //       errors: errors.length === 0 ? undefined : errors,
  //     };
  //   } catch (error: unknown) {
  //     if (Array.isArray(error)) {
  //       result = { errors: error };
  //     } else {
  //       result = { errors: [error as Error] };
  //     }
  //   }

  //   return result;
  // }

  // /**
  //  * Invoke a wrapper using standard syntax and an instance of the wrapper
  //  *
  //  * @param options - {
  //  *   // The Wrapper's URI
  //  *   uri: TUri;
  //  *
  //  *   // Method to be executed.
  //  *   method: string;
  //  *
  //  *   //Arguments for the method, structured as a map, removing the chance of incorrectly ordering arguments.
  //  *    args?: Record<string, unknown> | Uint8Array;
  //  *
  //  *   // Env variables for the wrapper invocation.
  //  *    env?: Record<string, unknown>;
  //  *
  //  *   resolutionContext?: IUriResolutionContext;
  //  *
  //  *   // if true, return value is a msgpack-encoded byte array
  //  *   encodeResult?: boolean;
  //  * }
  //  *
  //  * @returns A Promise with a Result containing the return value or an error
  //  */
  // public async invokeWrapper<
  //   TData = unknown,
  //   TUri extends Uri | string = string
  // >(
  //   options: InvokerOptions<TUri> & { wrapper: Wrapper }
  // ): Promise<InvokeResult<TData>> {
  //   try {
  //     const typedOptions: InvokeOptions<Uri> = {
  //       ...options,
  //       uri: Uri.from(options.uri),
  //     };

  //     const wrapper = options.wrapper;
  //     const invocableResult = await wrapper.invoke(typedOptions, this);

  //     if (!invocableResult.ok) {
  //       return ResultErr(invocableResult.error);
  //     }

  //     const value = invocableResult.value;

  //     if (options.encodeResult && !invocableResult.encoded) {
  //       const encoded = msgpackEncode(value);
  //       return ResultOk((encoded as unknown) as TData);
  //     } else if (invocableResult.encoded && !options.encodeResult) {
  //       const decoded = msgpackDecode(value as Uint8Array);
  //       return ResultOk(decoded as TData);
  //     } else {
  //       return ResultOk(value as TData);
  //     }
  //   } catch (error) {
  //     return ResultErr(error);
  //   }
  // }

  // /**
  //  * Invoke a wrapper using standard syntax.
  //  * Unlike `invokeWrapper`, this method automatically retrieves and caches the wrapper.
  //  *
  //  * @param options - {
  //  *   // The Wrapper's URI
  //  *   uri: TUri;
  //  *
  //  *   // Method to be executed.
  //  *   method: string;
  //  *
  //  *   //Arguments for the method, structured as a map, removing the chance of incorrectly ordering arguments.
  //  *    args?: Record<string, unknown> | Uint8Array;
  //  *
  //  *   // Env variables for the wrapper invocation.
  //  *    env?: Record<string, unknown>;
  //  *
  //  *   resolutionContext?: IUriResolutionContext;
  //  *
  //  *   // if true, return value is a msgpack-encoded byte array
  //  *   encodeResult?: boolean;
  //  * }
  //  *
  //  * @returns A Promise with a Result containing the return value or an error
  //  */
  // public async invoke<TData = unknown, TUri extends Uri | string = string>(
  //   options: InvokerOptions<TUri>
  // ): Promise<InvokeResult<TData>> {
  //   try {
  //     const typedOptions: InvokeOptions<Uri> = {
  //       ...options,
  //       uri: Uri.from(options.uri),
  //     };

  //     const resolutionContext =
  //       options.resolutionContext ?? new UriResolutionContext();

  //     const loadWrapperResult = await this.loadWrapper(
  //       typedOptions.uri,
  //       resolutionContext
  //     );

  //     if (!loadWrapperResult.ok) {
  //       return loadWrapperResult;
  //     }
  //     const wrapper = loadWrapperResult.value;

  //     const resolutionPath = resolutionContext.getResolutionPath();
  //     const env = getEnvFromUriHistory(
  //       resolutionPath.length > 0 ? resolutionPath : [typedOptions.uri],
  //       this
  //     );

  //     const invokeResult = await this.invokeWrapper<TData, Uri>({
  //       env: env?.env,
  //       ...typedOptions,
  //       wrapper,
  //     });

  //     if (!invokeResult.ok) {
  //       return invokeResult;
  //     }

  //     return invokeResult;
  //   } catch (error) {
  //     return ResultErr(error);
  //   }
  // }

  // /**
  //  * Invoke a wrapper at a regular frequency (within ~16ms)
  //  *
  //  * @param options - {
  //  *   // The Wrapper's URI
  //  *   uri: TUri;
  //  *
  //  *   // Method to be executed.
  //  *   method: string;
  //  *
  //  *   //Arguments for the method, structured as a map, removing the chance of incorrectly ordering arguments.
  //  *    args?: Record<string, unknown> | Uint8Array;
  //  *
  //  *   // Env variables for the wrapper invocation.
  //  *    env?: Record<string, unknown>;
  //  *
  //  *   resolutionContext?: IUriResolutionContext;
  //  *
  //  *   // if true, return value is a msgpack-encoded byte array
  //  *   encodeResult?: boolean;
  //  *
  //  *   // the frequency at which to perform the invocation
  //  *   frequency?: {
  //  *     ms?: number;
  //  *     sec?: number;
  //  *     min?: number;
  //  *     hours?: number;
  //  *   }
  //  * }
  //  *
  //  * @returns A Promise with a Result containing the return value or an error
  //  */

  // /**
  //  * Resolve a URI to a wrap package, a wrapper, or a uri
  //  *
  //  * @param options - { uri: TUri; resolutionContext?: IUriResolutionContext }
  //  * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
  //  */

  // public async tryResolveUri<TUri extends Uri | string>(
  //   options: TryResolveUriOptions<TUri>
  // ): Promise<Result<UriPackageOrWrapper, unknown>> {
  //   const uri = Uri.from(options.uri);

  //   const uriResolver = this.getResolver();

  //   const resolutionContext =
  //     options.resolutionContext ?? new UriResolutionContext();

  //   const response = await uriResolver.tryResolveUri(
  //     uri,
  //     this,
  //     resolutionContext
  //   );

  //   return response;
  // }

  // /**
  //  * Resolve a URI to a wrap package or wrapper.
  //  * If the URI resolves to wrap package, load the wrapper.
  //  *
  //  * @remarks
  //  * Unlike other methods, `loadWrapper` does not accept a string URI.
  //  * You can create a Uri (from the `@polywrap/core-js` package) using `Uri.from("wrap://...")`
  //  *
  //  * @param uri: the Uri to resolve
  //  * @param resolutionContext? a resolution context
  //  * @param options - { noValidate?: boolean }
  //  * @returns A Promise with a Result containing either a wrapper if successful
  //  */
  // public async loadWrapper(
  //   uri: Uri,
  //   resolutionContext?: IUriResolutionContext,
  //   options?: unknown
  // ): Promise<Result<Wrapper, Error>> {
  //   if (!resolutionContext) {
  //     resolutionContext = new UriResolutionContext();
  //   }

  //   const result = await this.tryResolveUri({
  //     uri,
  //     resolutionContext,
  //   });

  //   if (!result.ok) {
  //     if (result.error) {
  //       return ResultErr(new UriResolverError(result.error, resolutionContext));
  //     } else {
  //       return ResultErr(
  //         Error(
  //           `Error resolving URI "${
  //             uri.uri
  //           }"\nResolution Stack: ${JSON.stringify(
  //             buildCleanUriHistory(resolutionContext.getHistory()),
  //             null,
  //             2
  //           )}`
  //         )
  //       );
  //     }
  //   }

  //   const uriPackageOrWrapper = result.value;

  //   if (uriPackageOrWrapper.type === "uri") {
  //     const error = Error(
  //       `Error resolving URI "${uri.uri}"\nURI not found ${
  //         uriPackageOrWrapper.uri.uri
  //       }\nResolution Stack: ${JSON.stringify(
  //         buildCleanUriHistory(resolutionContext.getHistory()),
  //         null,
  //         2
  //       )}`
  //     );
  //     return ResultErr(error);
  //   }

  //   if (uriPackageOrWrapper.type === "package") {
  //     const result = await uriPackageOrWrapper.package.createWrapper(options);

  //     if (!result.ok) {
  //       return result;
  //     }

  //     return ResultOk(result.value);
  //   } else {
  //     return ResultOk(uriPackageOrWrapper.wrapper);
  //   }
  // }
}
