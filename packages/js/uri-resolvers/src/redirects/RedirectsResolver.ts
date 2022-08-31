import {
  UriResolverAggregator,
  UriResolverAggregatorOptions,
} from "../aggregator";

import { Uri, UriRedirect } from "@polywrap/core-js";

export class RedirectsResolver<
  TUri extends string | Uri = string
> extends UriResolverAggregator {
  constructor(
    redirects: UriRedirect<TUri>[],
    options: UriResolverAggregatorOptions
  ) {
    super(redirects, options);
  }

  get name(): string {
    return "RedirectsResolver";
  }
}
