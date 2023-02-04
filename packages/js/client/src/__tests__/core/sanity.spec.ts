import {
  Uri,
  PolywrapClient,
  PolywrapCoreClientConfig,
  ExtendableUriResolver
} from "../..";
import fs from "fs";

import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { IUriPackage, IUriRedirect } from "@polywrap/core-js";
import { ResultErr } from "@polywrap/result";
import { StaticResolver, UriResolverLike } from "@polywrap/uri-resolvers-js";
import { WasmPackage } from "@polywrap/wasm-js";
import { defaultWrappers } from "@polywrap/client-config-builder-js";

jest.setTimeout(200000);

describe("sanity", () => {
  test("default client config", () => {
    const client = new PolywrapClient();

    new Uri("wrap://ens/http-resolver.polywrap.eth"),
      expect(client.getInterfaces()).toStrictEqual([
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [
            new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
            new Uri("wrap://ens/ens-resolver.polywrap.eth"),
            new Uri("wrap://ens/fs-resolver.polywrap.eth"),
            new Uri("wrap://ens/http-resolver.polywrap.eth"),
            new Uri("wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY"),
          ],
        },
        {
          interface: new Uri("wrap://ens/wrappers.polywrap.eth:logger@1.0.0"),
          implementations: [new Uri("wrap://plugin/logger")],
        },
        {
          interface: new Uri(defaultWrappers.concurrentInterface),
          implementations: [new Uri("wrap://plugin/concurrent")],
        },
      ]);
  });

  test("validate requested uri is available", async () => {
    const subinvokeUri = Uri.from("ens/imported-subinvoke.eth");
    const invokeUri = Uri.from("ens/imported-invoke.eth");
    const consumerUri = Uri.from("ens/consumer.eth");

    const getPackage = async (name: string) => {
      const manifest = await fs.promises.readFile(
        `${GetPathToTestWrappers()}/subinvoke/${name}/implementations/as/wrap.info`
      );

      const wasmModule = await fs.promises.readFile(
        `${GetPathToTestWrappers()}/subinvoke/${name}/implementations/as/wrap.wasm`
      );
      return WasmPackage.from(manifest, wasmModule)
    }

    let config: unknown = {
      resolver: {
        tryResolveUri: (_a: unknown, _b: unknown, _c: unknown) => {
          return Promise.resolve(ResultErr())
        }
      },
      interfaces: undefined,
      envs: undefined
    }

    let client = new PolywrapClient(config as PolywrapCoreClientConfig, { noDefaults: true });
    let result = await client.validate(subinvokeUri, {});
    expect(result.ok).toBeFalsy();
    let resultError = (result as { error: Error }).error;
    expect(resultError).toBeTruthy();
    expect(resultError.message).toContain("Error resolving URI");

    let fooPackage: IUriPackage = {
      uri: subinvokeUri,
      package: await getPackage("00-subinvoke")
    }

    let resolvers: UriResolverLike[] = [ fooPackage ]
    let staticResolver = StaticResolver.from(resolvers)

    config = {
      resolver: staticResolver
    };
    
    client = new PolywrapClient(config as PolywrapCoreClientConfig, { noDefaults: true });
    result = await client.validate(subinvokeUri, {});

    expect(result.ok).toBeTruthy();

    result = await client.validate(invokeUri, {
      recursive: true
    })
    resultError = (result as { error: Error }).error;
    expect(result.ok).toBeFalsy();
    expect(resultError).toBeTruthy();
    expect(resultError.message).toContain("Unable to find URI");

    let modifiedFooWrapper: IUriPackage = {
      uri: invokeUri,
      package: await getPackage("01-invoke")
    };
    resolvers.push(modifiedFooWrapper);
    staticResolver = StaticResolver.from(resolvers);

    (config as Record<string, unknown>).resolver = staticResolver;
    client = new PolywrapClient(config as PolywrapCoreClientConfig, { noDefaults: true });

    result = await client.validate(invokeUri, {
      recursive: true
    })

    expect(result.ok).toBeTruthy()

    let redirectUri: IUriRedirect = {
      from: subinvokeUri,
      to: consumerUri
    };
    resolvers.push(redirectUri);

    staticResolver = StaticResolver.from(resolvers);

    (config as Record<string, unknown>).resolver = staticResolver;
    client = new PolywrapClient(config as PolywrapCoreClientConfig, { noDefaults: true });

    result = await client.validate(invokeUri, {
      abi: true
    })

    expect(result.ok).toBeFalsy();
  });
});
