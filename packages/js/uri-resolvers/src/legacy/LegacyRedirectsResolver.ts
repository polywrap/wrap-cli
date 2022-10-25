import { RedirectResolver } from "..";
import { UriResolverAggregator } from "..";

import { Uri, CoreClient } from "@polywrap/core-js";

export class LegacyRedirectsResolver extends UriResolverAggregator {
  constructor() {
    super(
      async (uri: Uri, client: CoreClient) =>
        client
          .getRedirects()
          ?.map(
            (redirect) => new RedirectResolver(redirect.from, redirect.to)
          ) ?? [],
      "LegacyRedirectsResolver"
    );
  }
}
