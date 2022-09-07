import { UriResolverAggregator } from "../aggregator";

import { Uri, UriRedirect } from "@polywrap/core-js";

export class RedirectsResolver<
  TUri extends string | Uri = string
> extends UriResolverAggregator {
  constructor(redirects: UriRedirect<TUri>[], resolverName?: string) {
    super(redirects, resolverName ?? "RedirectsResolver");
  }
}
