import { Client, Uri } from "../../types";
import { UriResolutionResult } from "./UriResolutionResult";

export interface UriToApiResolver {
  name: string;
  resolveUri(
    uri: Uri, 
    client: Client 
  ): Promise<UriResolutionResult>;
};