import {
  UriResolverAggregator,
  UriResolverAggregatorOptions,
} from "../aggregator";
import { RedirectResolver } from "./RedirectResolver";

import { Uri, UriRedirect } from "@polywrap/core-js";

export class RedirectsResolver<
  TUri extends string | Uri = string
> extends UriResolverAggregator {
  constructor(
    redirects: readonly UriRedirect<TUri>[],
    options: UriResolverAggregatorOptions
  ) {
    super(
      async () =>
        redirects.map(
          (redirect) => new RedirectResolver(redirect.from, redirect.to)
        ),
      options
    );
  }

  get name(): string {
    return RedirectsResolver.name;
  }
}
