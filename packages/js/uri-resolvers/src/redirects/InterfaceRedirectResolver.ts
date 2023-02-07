import { ResolverWithHistory, UriResolutionResult } from "../helpers";

import {
  CoreClient,
  Result,
  Uri,
  UriPackageOrWrapper,
} from "@polywrap/core-js";

export class InterfaceRedirectResolver extends ResolverWithHistory {
  private redirects: Map<string, Uri> = new Map();
  private initialized: boolean;

  protected getStepDescription = (uri: Uri): string =>
    `InterfaceRedirect (${uri.uri} - ${this.redirects.get(uri.uri)})`;

  protected async _tryResolveUri(
    uri: Uri,
    client: CoreClient
  ): Promise<Result<UriPackageOrWrapper>> {
    if (!this.initialized) {
      this.setInterfaceRedirects(client);
      this.initialized = true;
    }
    const implementation = this.redirects.get(uri.uri);
    if (implementation) {
      return UriResolutionResult.ok(implementation);
    }
    return UriResolutionResult.ok(uri);
  }

  private setInterfaceRedirects(client: CoreClient): void {
    client.getInterfaces()?.forEach((val) => {
      if (val.implementations.length) {
        this.redirects.set(val.interface.uri, val.implementations[0]);
      }
    });
  }
}
