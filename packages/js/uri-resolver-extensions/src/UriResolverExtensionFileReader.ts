import {
  CoreClient,
  combinePaths,
  InvokeOptions,
  InvokeResult,
  Uri,
  UriResolverInterface,
  Wrapper,
} from "@polywrap/core-js";
import { IFileReader } from "@polywrap/wasm-js";
import { Result, ResultErr } from "@polywrap/result";

export class UriResolverExtensionFileReader implements IFileReader {
  constructor(
    private readonly _resolverExtensionUri: Uri,
    private readonly _wrapperUri: Uri,
    private readonly _client: CoreClient
  ) {}

  async readFile(filePath: string): Promise<Result<Uint8Array, Error>> {
    const path = combinePaths(this._wrapperUri.path, filePath);
    const result = await UriResolverInterface.module.getFile(
      {
        invoke: <TData = unknown, TUri extends Uri | string = string>(
          options: InvokeOptions<TUri>
        ): Promise<InvokeResult<TData>> =>
          this._client.invoke<TData, TUri>(options),
        invokeWrapper: <TData = unknown, TUri extends Uri | string = string>(
          options: InvokeOptions<TUri> & { wrapper: Wrapper }
        ): Promise<InvokeResult<TData>> =>
          this._client.invokeWrapper<TData, TUri>(options),
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
