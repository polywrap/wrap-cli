import {
  IUriResolutionContext,
  Result,
  Uri,
  UriPackageOrWrapper,
  UriResolutionContext,
} from "@polywrap/core-js";
import { expectHistory } from "./helpers/expectHistory";
import { ClientConfigBuilder, defaultPackages, PolywrapClient } from "@polywrap/client-js";
import { RecursiveResolver, StaticResolver, WrapperCache } from "@polywrap/uri-resolvers-js";
import { EcoCacheResolver } from "../../build";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { httpResolverPlugin } from "@polywrap/http-resolver-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { defaultIpfsProviders } from "@polywrap/client-config-builder-js";

jest.setTimeout(200000);

const getClientWithEcoCacheResolver = (): PolywrapClient => {
  const resolver = RecursiveResolver.from(
    EcoCacheResolver.from(
      [
        StaticResolver.from([
          {
            uri: defaultPackages.ipfs,
            package: ipfsPlugin({}),
          },
          {
            uri: defaultPackages.ipfsResolver,
            package: ipfsResolverPlugin({}),
          },
          {
            uri: defaultPackages.http,
            package: httpPlugin({})
          },
          {
            uri: defaultPackages.httpResolver,
            package: httpResolverPlugin({})
          }
        ]),
        new ExtendableUriResolver(),
      ],
      new WrapperCache()
    )
  );

  const config = new ClientConfigBuilder(undefined, resolver)
    .addEnv(
      defaultPackages.ipfs,
      {
        provider: defaultIpfsProviders[0],
        fallbackProviders: defaultIpfsProviders.slice(1),
      })
    .addInterfaceImplementations(
      ExtendableUriResolver.extInterfaceUri,
      [
        defaultPackages.ipfsResolver,
        defaultPackages.httpResolver,
      ]
    )
    .buildCoreConfig();

  return new PolywrapClient(config, { noDefaults: true });
};

describe("EcoCacheResolver", () => {

  it("repeated calls with same uri trigger only one network request", async () => {
    const uri = new Uri("wrap://ipfs/QmdEMfomFW1XqoxcsCEnhujn9ebQezUXw8pmwLtecyR6F6");

    const client = getClientWithEcoCacheResolver();

    const invocations: Promise<Result<UriPackageOrWrapper, unknown>>[] = [];
    const resolutionContexts: IUriResolutionContext[] = []

    for (let i = 0; i < 10; i++) {
      const resolutionContext = new UriResolutionContext();
      const result = client.tryResolveUri({ uri, resolutionContext });
      invocations.push(result);
      resolutionContexts.push(resolutionContext);
    }

    const resolutionResults = await Promise.all(invocations);

    let foundFirst = false;

    for (let i = 0; i < invocations.length; i++) {
      const result = resolutionResults[i];
      const resolutionContext = resolutionContexts[i];

      if (!result.ok) throw result.error;

      if (!foundFirst) {
        await expectHistory(
          resolutionContext.getHistory(),
          "resolve-ipfs-without-cache"
        );
        expect(result.value.type).toEqual("wrapper");
        foundFirst = true;
        continue;
      }

      await expectHistory(
        resolutionContext.getHistory(),
        "resolve-ipfs-with-cache"
      );

      expect(result.value.type).toEqual("wrapper");
    }
  });
});
