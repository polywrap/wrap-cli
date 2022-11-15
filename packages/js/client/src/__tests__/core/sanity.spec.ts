import {
  ExtendableUriResolver,
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  Uri,
  WrapperCache,
  PolywrapClient
} from "../..";

import { coreInterfaceUris, IUriResolver } from "@polywrap/core-js";
import { buildWrapper } from "@polywrap/test-env-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";

jest.setTimeout(200000);

describe("sanity", () => {
  test("default client config", () => {
    const client = new PolywrapClient();

    new Uri("wrap://ens/http-resolver.polywrap.eth"),
      expect(client.getInterfaces()).toStrictEqual([
        {
          interface: coreInterfaceUris.uriResolver,
          implementations: [
            new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
            new Uri("wrap://ens/ens-resolver.polywrap.eth"),
            new Uri("wrap://ens/fs-resolver.polywrap.eth"),
            new Uri("wrap://ens/http-resolver.polywrap.eth"),
            new Uri("wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY"),
          ],
        },
        {
          interface: coreInterfaceUris.logger,
          implementations: [new Uri("wrap://ens/js-logger.polywrap.eth")],
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

    const resolvers: IUriResolver<unknown>[] = [
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
