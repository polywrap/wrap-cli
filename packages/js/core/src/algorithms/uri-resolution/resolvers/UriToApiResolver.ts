import { UriResolutionResult } from ".";
import { UriResolutionStack } from "..";
import { Client, Uri } from "../../../types";

export interface UriToApiResolver {
  name: string;
  resolveUri(
    uri: Uri, 
    client: Client, 
    resolutionStack: UriResolutionStack
  ): Promise<UriResolutionResult>;
};