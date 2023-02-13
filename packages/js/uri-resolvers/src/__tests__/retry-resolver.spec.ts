import { Uri, UriResolutionContext } from "@polywrap/core-js";
import { expectHistory } from "./util";
import { RecursiveResolver, RetryResolver, RetryResolverOptions } from "../helpers";
import { ClientConfigBuilder, defaultPackages, PolywrapClient } from "@polywrap/client-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "@polywrap/http-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { defaultEmbeddedPackages, defaultInterfaces, defaultIpfsProviders } from "@polywrap/client-config-builder-js";
import { PackageToWrapperCacheResolver, WrapperCache } from "../cache";
import { StaticResolver } from "../static";

jest.setTimeout(200000);

const getClientWithRetryResolver = (retryOptions: RetryResolverOptions): PolywrapClient => {
  const resolver = RecursiveResolver.from(
    PackageToWrapperCacheResolver.from(
      [
        StaticResolver.from([
          {
            uri: new Uri(defaultInterfaces.ipfsHttpClient),
            package: defaultEmbeddedPackages.ipfsHttpClient(),
          },
          {
            uri: new Uri(defaultPackages.ipfsResolver),
            package: defaultEmbeddedPackages.ipfsResolver(),
          },
          {
            uri: new Uri(defaultInterfaces.http),
            package: httpPlugin({})
          },
          {
            uri: new Uri(defaultPackages.httpResolver),
            package: httpResolverPlugin({})
          }
        ]),
        new RetryResolver(
          new ExtendableUriResolver(),
          retryOptions
        )
      ],
      new WrapperCache()
    )
  );

  const builder = new ClientConfigBuilder()
    .addEnv(
      defaultPackages.ipfsResolver,
      {
        provider: defaultIpfsProviders[0],
        fallbackProviders: defaultIpfsProviders.slice(1),
      })
    .addInterfaceImplementations(
      ExtendableUriResolver.extInterfaceUri.uri,
      [
        defaultPackages.ipfsResolver,
        defaultPackages.httpResolver,
      ]
    )
    .addInterfaceImplementations(
      defaultInterfaces.ipfsHttpClient,
      [defaultInterfaces.ipfsHttpClient]
    );

  const config = (builder as ClientConfigBuilder).build({ resolver })

  return new PolywrapClient(config, { noDefaults: true });
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
});
