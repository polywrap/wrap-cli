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
