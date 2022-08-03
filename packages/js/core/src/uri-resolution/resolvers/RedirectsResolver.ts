import { UriResolverAggregator } from "./aggregator";
import { RedirectResolver } from "./RedirectResolver";
import { Uri } from "../..";

export class RedirectsResolver extends UriResolverAggregator {
  constructor(
    redirects: readonly { from: Uri; to: Uri }[],
    options: {
      fullResolution: boolean;
    }
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
