import { RedirectResolver } from "..";
import { UriResolverAggregator } from "..";
import { Client, Uri } from "../../..";

export class LegacyRedirectsResolver extends UriResolverAggregator {
  constructor() {
    super(
      async (uri: Uri, client: Client) =>
        client
          .getRedirects({})
          .map((redirect) => new RedirectResolver(redirect.from, redirect.to)),
      { fullResolution: true }
    );
  }

  get name(): string {
    return LegacyRedirectsResolver.name;
  }
}
