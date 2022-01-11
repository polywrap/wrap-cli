import { Client, Contextualized, Uri } from "../../types";
import { UriResolutionResult } from "./UriResolutionResult";

export interface UriToApiResolver {
  name: string;
  resolveUri(
    uri: Uri, 
    client: Client, 
    options: Contextualized
  ): Promise<UriResolutionResult>;
};