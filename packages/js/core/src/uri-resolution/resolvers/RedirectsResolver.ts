import { UriResolverAggregator } from "./aggregator";
import { RedirectResolver } from "./RedirectResolver";
import { Uri, UriRedirect } from "../..";

export class RedirectsResolver<
  TUri extends string | Uri = string
> extends UriResolverAggregator {
  constructor(
    redirects: readonly UriRedirect<TUri>[],
    options: {
      fullResolution: boolean;
    }
  ) {
    super(
      async () => ({
        resolvers: redirects.map(
          (redirect) => new RedirectResolver(redirect.from, redirect.to)
        ),
      }),
      options
    );
  }

  get name(): string {
    return RedirectsResolver.name;
  }
}
