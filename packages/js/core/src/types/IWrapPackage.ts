import { Client, Wrapper, Uri } from ".";

export interface IWrapPackage {
  uri: Uri;
  createWrapper(client: Client): Promise<Wrapper>;
}
