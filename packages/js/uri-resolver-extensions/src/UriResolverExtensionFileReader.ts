import {
  WrapClient,
  InvokeOptions,
  InvokeResult,
  Uri,
  Wrapper,
  combinePaths,
  UriResolverInterface,
} from "@polywrap/wrap-js";
import { IFileReader } from "@polywrap/wasm-js";
import { Result, ResultErr } from "@polywrap/result";

// $start: UriResolverExtensionFileReader
/** An IFileReader that reads files by invoking URI Resolver Extension wrappers */
export class UriResolverExtensionFileReader implements IFileReader /* $ */ {
  // $start: UriResolverExtensionFileReader-constructor
  /**
   * Construct a UriResolverExtensionFileReader
   *
   * @param _resolverExtensionUri - URI of the URI Resolver Extension wrapper
   * @param _wrapperUri - URI of the wrap package to read from
   * @param _client - A WrapClient instance
   * */
  constructor(
    private readonly _resolverExtensionUri: Uri,
    private readonly _wrapperUri: Uri,
    private readonly _client: WrapClient
  ) /* $ */ {}

  // $start: UriResolverExtensionFileReader-readFile
  /**
   * Read a file
   *
   * @param filePath - the file's path from the wrap package root
   *
   * @returns a Result containing a buffer if successful, or an error
   * */
  async readFile(filePath: string): Promise<Result<Uint8Array, Error>> /* $ */ {
    const path = combinePaths(this._wrapperUri.path, filePath);
    const result = await UriResolverInterface.module.getFile(
      {
        invoke: <TData = unknown>(
          options: InvokeOptions
        ): Promise<InvokeResult<TData>> => this._client.invoke<TData>(options),
        invokeWrapper: <TData = unknown>(
          options: InvokeOptions & { wrapper: Wrapper }
        ): Promise<InvokeResult<TData>> =>
          this._client.invokeWrapper<TData>(options),
      },
      this._resolverExtensionUri,
      path
    );
    if (!result.ok) return result;
    if (!result.value) {
      return ResultErr(new Error(`File not found at ${path}`));
    }
    return {
      value: result.value,
      ok: true,
    };
  }
}
