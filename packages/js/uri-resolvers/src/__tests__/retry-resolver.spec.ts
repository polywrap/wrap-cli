import { Uri, UriResolutionContext } from "@polywrap/core-js";
import { expectHistory } from "./util";
import { RetryResolver, RetryResolverOptions, UriResolver } from "../helpers";
import { ClientConfigBuilder, PolywrapClient } from "@polywrap/client-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { StaticResolver } from "../static";
import {
  embeds,
  ipfsProviders,
  plugins,
} from "@polywrap/client-config-builder-js/build/bundles/default";

jest.setTimeout(200000);

const getClientWithRetryResolver = (retryOptions: RetryResolverOptions): PolywrapClient => {
  const ipfsResolverUri = Uri.from("wrap://package/ipfs-resolver");
  const resolver = UriResolver.from([
        StaticResolver.from([
          {
            uri: embeds.ipfsHttpClient.uri,
            package: embeds.ipfsHttpClient.package,
          },
          {
            uri: ipfsResolverUri,
            package: embeds.ipfsResolver.package,
          },
          {
            uri: plugins.http.implements[0],
            package: plugins.http.plugin,
          },
        ]),
        new RetryResolver(
          new ExtendableUriResolver(),
          retryOptions
        )
    ]
  );

  const config = new ClientConfigBuilder()
    .addEnv(
      ipfsResolverUri.uri,
      {
        provider: ipfsProviders[0],
        fallbackProviders: ipfsProviders.slice(1),
      })
    .addInterfaceImplementations(
      ExtendableUriResolver.defaultExtInterfaceUris[0].uri,
      [ipfsResolverUri.uri]
    )
    .addInterfaceImplementations(
      embeds.ipfsHttpClient.source.uri,
      [embeds.ipfsHttpClient.uri.uri]
    )
    .build({ resolver });


  return new PolywrapClient(config);
};

describe("RetryResolver", () => {

  it("resolves wrapper without using retries", async () => {
    const uri = new Uri("wrap://ipfs/QmdEMfomFW1XqoxcsCEnhujn9ebQezUXw8pmwLtecyR6F6");

    const client = getClientWithRetryResolver({ ipfs: { retries: 2, interval: 100 }});

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    if (!result.ok) throw result.error;

    await expectHistory(
      resolutionContext.getHistory(),
      "no-retries-resolves"
    );

    expect(result.value.type).toEqual("wrapper");
  });

  it("two retries - does not resolve", async () => {
    const uri = new Uri("wrap://ipfs/QmdEMfomFW1XqoxcsCEnhujn9ebQezUXw8pmwLtecyR6F7");

    const client = getClientWithRetryResolver({ ipfs: { retries: 2, interval: 100 }});

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    if (!result.ok) throw result.error;

    await expectHistory(
      resolutionContext.getHistory(),
      "two-retries-no-resolution"
    );
  });

  // it("one retry then resolves", async () => {
  //   const uri = new Uri("wrap://ipfs/QmdEMfomFW1XqoxcsCEnhujn9ebQezUXw8pmwLtecyR6F7");
  //
  //   const client = getClientWithRetryResolver({ ipfs: { retries: 2, interval: 10000 }});
  //
  //   const resolutionContext = new UriResolutionContext();
  //   const result = await client.tryResolveUri({ uri, resolutionContext });
  //
  //   if (!result.ok) throw result.error;
  //
  //   await expectHistory(
  //     resolutionContext.getHistory(),
  //     "two-retries-no-resolution"
  //   );
  // });
});
