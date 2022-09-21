import {
  Client,
  combinePaths,
  InvokeOptions,
  Uri,
  UriResolverInterface,
  Wrapper,
} from "@polywrap/core-js";
import { IFileReader } from "@polywrap/wasm-js";
import { Result } from "@polywrap/result";

export class UriResolverExtensionFileReader implements IFileReader {
  constructor(
    private readonly resolverExtensionUri: Uri,
    private readonly wrapperUri: Uri,
    private readonly client: Client
  ) {}

  async readFile(filePath: string): Promise<Result<Uint8Array, Error>> {
    return await UriResolverInterface.module.getFile(
      {
        invoke: <TData = unknown, TUri extends Uri | string = string>(
          options: InvokeOptions<TUri>
        ): Promise<Result<TData, Error>> =>
          this.client.invoke<TData, TUri>(options),
        invokeWrapper: <TData = unknown, TUri extends Uri | string = string>(
          options: InvokeOptions<TUri> & { wrapper: Wrapper }
        ): Promise<Result<TData, Error>> =>
          this.client.invokeWrapper<TData, TUri>(options),
      },
      this.resolverExtensionUri,
      combinePaths(this.wrapperUri.path, filePath)
    );
  }
}
