import { Uri, PolywrapClient, ExtendableUriResolver } from "../..";
import fs from "fs";

import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { IUriPackage, IUriRedirect } from "@polywrap/core-js";
import { ResultErr } from "@polywrap/result";
import { StaticResolver, UriResolverLike } from "@polywrap/uri-resolvers-js";
import { WasmPackage } from "@polywrap/wasm-js";
import {
  defaultInterfaces,
  defaultPackages,
  defaultWrappers,
} from "@polywrap/client-config-builder-js";
import { CoreClientConfig } from "@polywrap/core-js";

jest.setTimeout(200000);

describe("sanity", () => {
  test("default client config", () => {
    const client = new PolywrapClient();

    expect(client.getInterfaces()).toStrictEqual([
      {
        interface: ExtendableUriResolver.extInterfaceUri,
        implementations: [
          new Uri(defaultPackages.ipfsResolver),
          new Uri(defaultWrappers.ensContenthashResolver),
          new Uri(defaultWrappers.ensIpfsContenthashResolver),
          new Uri(defaultWrappers.fileSystemResolver),
          new Uri(defaultWrappers.httpResolver),
          new Uri(defaultWrappers.ensTextRecordResolver),
        ],
      },
      {
        interface: new Uri(defaultInterfaces.logger),
        implementations: [new Uri(defaultInterfaces.logger)],
      },
      {
        interface: new Uri(defaultInterfaces.concurrent),
        implementations: [new Uri(defaultInterfaces.concurrent)],
      },
      {
        interface: new Uri(defaultInterfaces.ipfsHttpClient),
        implementations: [new Uri(defaultInterfaces.ipfsHttpClient)],
      },
      {
        interface: new Uri(defaultInterfaces.fileSystem),
        implementations: [new Uri(defaultInterfaces.fileSystem)],
      },
      {
        interface: new Uri(defaultInterfaces.http),
        implementations: [new Uri(defaultInterfaces.http)],
      },
      {
        interface: new Uri(defaultInterfaces.ethereumProvider),
        implementations: [new Uri(defaultInterfaces.ethereumProvider)],
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
      return WasmPackage.from(manifest, wasmModule);
    };

    let config: CoreClientConfig = {
      resolver: {
        tryResolveUri: (_a: unknown, _b: unknown, _c: unknown) => {
          return Promise.resolve(ResultErr());
        },
      },
      interfaces: undefined,
      envs: undefined,
    };

    let client = new PolywrapClient(config);
    let result = await client.validate(subinvokeUri, {});
    expect(result.ok).toBeFalsy();
    let resultError = (result as { error: Error }).error;
    expect(resultError).toBeTruthy();
    expect(resultError.message).toContain("Error resolving URI");

    let fooPackage: IUriPackage = {
      uri: subinvokeUri,
      package: await getPackage("00-subinvoke"),
    };

    let resolvers: UriResolverLike[] = [fooPackage];
    let staticResolver = StaticResolver.from(resolvers);

    config = {
      resolver: staticResolver,
    };

    client = new PolywrapClient(config);
    result = await client.validate(subinvokeUri, {});

    expect(result.ok).toBeTruthy();

    result = await client.validate(invokeUri, {
      recursive: true,
    });
    resultError = (result as { error: Error }).error;
    expect(result.ok).toBeFalsy();
    expect(resultError).toBeTruthy();
    expect(resultError.message).toContain("Unable to find URI");

    let modifiedFooWrapper: IUriPackage = {
      uri: invokeUri,
      package: await getPackage("01-invoke"),
    };
    resolvers.push(modifiedFooWrapper);
    staticResolver = StaticResolver.from(resolvers);

    const newConfig1: CoreClientConfig = {
      resolver: staticResolver,
      envs: config.envs,
      interfaces: config.interfaces,
    };
    client = new PolywrapClient(newConfig1);

    result = await client.validate(invokeUri, {
      recursive: true,
    });

    expect(result.ok).toBeTruthy();

    let redirectUri: IUriRedirect = {
      from: subinvokeUri,
      to: consumerUri,
    };
    resolvers.push(redirectUri);

    staticResolver = StaticResolver.from(resolvers);

    const newConfig2: CoreClientConfig = {
      resolver: staticResolver,
      envs: newConfig1.envs,
      interfaces: newConfig1.interfaces,
    };

    client = new PolywrapClient(newConfig2);

    result = await client.validate(invokeUri, {
      abi: true,
    });

    expect(result.ok).toBeFalsy();
  });
});
