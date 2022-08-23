import { RedirectResolver } from "..";
import { UriResolverAggregator } from "..";

import { Uri, Client } from "@polywrap/core-js";

export class LegacyRedirectsResolver extends UriResolverAggregator {
  constructor() {
    super(async (uri: Uri, client: Client) =>
      client
        .getRedirects({})
        .map((redirect) => new RedirectResolver(redirect.from, redirect.to))
    );
  }

  get name(): string {
    return LegacyRedirectsResolver.name;
  }
}
