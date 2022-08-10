import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { GetManifestOptions, Client, GetFileOptions, Wrapper, Uri } from ".";

export interface IWrapPackage {
  uri: Uri;
  /**
   * Get a manifest from the Wrapper package.
   * Not implemented for plugin wrappers.
   *
   * @param options Configuration options for manifest retrieval
   * @param client The client instance requesting the manifest.
   */
  getManifest(
    options: GetManifestOptions,
    client: Client
  ): Promise<WrapManifest>;

  /**
   * Get the Wrapper's schema
   *
   * @param client The client instance the schema.
   */
  getSchema(client: Client): Promise<string>;
  /**
   * Get a file from the Wrapper package.
   * Not implemented for plugin wrappers.
   *
   * @param options Configuration options for file retrieval
   * @param client The client instance requesting the file.
   */
  getFile(
    options: GetFileOptions,
    client: Client
  ): Promise<Uint8Array | string>;

  createWrapper(client: Client): Promise<Wrapper>;
}

export const initWrapper = async (
  packageOrWrapper: IWrapPackage | Wrapper,
  client: Client
): Promise<Wrapper> => {
  const wrapPackage = packageOrWrapper as Partial<IWrapPackage>;

  if (wrapPackage.createWrapper) {
    return await wrapPackage.createWrapper(client);
  } else {
    return packageOrWrapper as Wrapper;
  }
};
