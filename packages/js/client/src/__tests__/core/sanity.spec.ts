import {CoreClientConfig, coreInterfaceUris} from "@polywrap/core-js";
import { ExtendableUriResolver, LegacyRedirectsResolver, PackageToWrapperCacheResolver, RecursiveResolver, Uri, WrapperCache } from "../..";
import {ClientConfig, ClientConfigBuilder, defaultWrappers} from "@polywrap/client-config-builder-js";
import { PolywrapClient } from "../../PolywrapClient";
import { buildWrapper } from "@polywrap/test-env-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";

jest.setTimeout(200000);

describe("sanity", () => {
  test("default client config", () => {
    const client = new PolywrapClient();

    expect(client.getRedirects()).toStrictEqual([
      {
        from: new Uri("wrap://ens/sha3.polywrap.eth"),
        to: new Uri(defaultWrappers.sha3),
      },
      {
        from: new Uri("wrap://ens/uts46.polywrap.eth"),
        to: new Uri(defaultWrappers.uts46),
      },
      {
        from: new Uri("wrap://ens/graph-node.polywrap.eth"),
        to: new Uri(defaultWrappers.graphNode),
      },
    ]);

    new Uri("wrap://ens/http-resolver.polywrap.eth"),
      expect(client.getInterfaces()).toStrictEqual([
        {
          interface: coreInterfaceUris.uriResolver,
          implementations: [
            new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
            new Uri("wrap://ens/ens-resolver.polywrap.eth"),
            new Uri("wrap://ens/fs-resolver.polywrap.eth"),
            new Uri("wrap://ens/http-resolver.polywrap.eth"),
          ],
        },
        {
          interface: coreInterfaceUris.logger,
          implementations: [new Uri("wrap://ens/js-logger.polywrap.eth")],
        },
      ]);
  });

  test("redirect registration", () => {
    const implementation1Uri = "wrap://ens/some-implementation1.eth";
    const implementation2Uri = "wrap://ens/some-implementation2.eth";

    const client = new PolywrapClient({
      redirects: [
        {
          from: implementation1Uri,
          to: implementation2Uri,
        },
      ],
    });

    const redirects = client.getRedirects();

    expect(redirects).toEqual([
      {
        from: new Uri("wrap://ens/sha3.polywrap.eth"),
        to: new Uri(defaultWrappers.sha3),
      },
      {
        from: new Uri("wrap://ens/uts46.polywrap.eth"),
        to: new Uri(defaultWrappers.uts46),
      },
      {
        from: new Uri("wrap://ens/graph-node.polywrap.eth"),
        to: new Uri(defaultWrappers.graphNode),
      },
      {
        from: new Uri(implementation1Uri),
        to: new Uri(implementation2Uri),
      },
    ]);
  });

  test("validate requested uri is available", async () => {
    const fooPath = `${__dirname}/../utils/validate/wrapper-a`;
    const greetingPath = `${__dirname}/../utils/validate/wrapper-b`;
    const modifiedFooPath = `${__dirname}/../utils/validate/wrapper-c`
    const fooUri = `fs/${fooPath}/build`;
    const greetingUri = `fs/${greetingPath}/build`;
    const modifiedFooUri = `fs/${modifiedFooPath}/build`;

    const resolvers = [
      new LegacyRedirectsResolver(),
      new ExtendableUriResolver()
    ]

    let config = {
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(resolvers, new WrapperCache())
      )
    }
    await buildWrapper(fooPath);
    let client = new PolywrapClient(config, { noDefaults: true });
    let result = await client.validate(fooUri, {});

    expect(result.ok).toBeFalsy();
    let resultError = (result as { error: Error }).error;
    expect(resultError).toBeTruthy();
    expect(resultError.message).toContain("Error resolving URI");


    resolvers.unshift({
      uri: "wrap://ens/fs-resolver.polywrap.eth",
      package: fileSystemResolverPlugin({}),
    })
    resolvers.unshift({
      uri: "wrap://ens/fs.polywrap.eth",
      package: fileSystemPlugin({}),
    })

    config = {
      interfaces: [{
        interface: "wrap://ens/uri-resolver.core.polywrap.eth",
        implementations: [
          "wrap://ens/fs-resolver.polywrap.eth"
        ]
      }],
      resolver: RecursiveResolver.from(
        PackageToWrapperCacheResolver.from(resolvers, new WrapperCache())
      )
    };
    
    client = new PolywrapClient(config, { noDefaults: true });
    result = await client.validate(fooUri, {});

    expect(result.ok).toBeTruthy();

    result = await client.validate(greetingUri, {
      recursive: true
    })
    resultError = (result as { error: Error }).error;
    expect(result.ok).toBeFalsy();
    expect(resultError).toBeTruthy();
    expect(resultError.message).toContain("Error resolving URI");

    await buildWrapper(greetingPath);
    config = {
      ...config,
      redirects: [
        {
          from: "ens/foo.eth",
          to: fooUri
        }
      ]
    };
    client = new PolywrapClient(config, { noDefaults: true });

    result = await client.validate(greetingUri, {
      recursive: true
    })

    expect(result.ok).toBeTruthy()

    await buildWrapper(modifiedFooPath);
    config = {
      ...config,
      redirects: [
        {
          from: "ens/foo.eth",
          to: modifiedFooUri
        }
      ]
    };    
    client = new PolywrapClient(config, { noDefaults: true });

    result = await client.validate(greetingUri, {
      abi: true
    })

    expect(result.ok).toBeFalsy();
  });
});
