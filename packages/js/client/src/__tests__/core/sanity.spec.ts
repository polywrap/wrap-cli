import { Uri, PolywrapClient, ExtendableUriResolver } from "../..";
import fs from "fs";

import { CoreClientConfig, IUriPackage, IUriRedirect } from "@polywrap/core-js";
import { buildWrapper } from "@polywrap/test-env-js";
import { ResultErr } from "@polywrap/result";
import { StaticResolver, UriResolverLike } from "@polywrap/uri-resolvers-js";
import { WasmPackage } from "@polywrap/wasm-js";
import { defaultWrappers } from "@polywrap/client-config-builder-js";

jest.setTimeout(200000);

describe("sanity", () => {
  test("default client config", () => {
    const client = new PolywrapClient();

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
    const fooPath = `${__dirname}/../utils/validate/wrapper-a`;
    const greetingPath = `${__dirname}/../utils/validate/wrapper-b`;
    const modifiedFooPath = `${__dirname}/../utils/validate/wrapper-c`;
    const fooUri = `ens/foo.eth`;
    const greetingUri = `ens/greeting.eth`;
    const modifiedFooUri = `ens/foo-modified.eth`;

    const getPackage = async (name: string) => {
      const manifest = await fs.promises.readFile(
        `${__dirname}/../utils/validate/${name}/build/wrap.info`
      );

      const wasmModule = await fs.promises.readFile(
        `${__dirname}/../utils/validate/${name}/build/wrap.wasm`
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

    await buildWrapper(fooPath, undefined, true);
    let client = new PolywrapClient(config);
    let result = await client.validate(fooUri, {});
    expect(result.ok).toBeFalsy();
    let resultError = (result as { error: Error }).error;
    expect(resultError).toBeTruthy();
    expect(resultError.message).toContain("Error resolving URI");

    let fooPackage: IUriPackage = {
      uri: Uri.from(fooUri),
      package: await getPackage("wrapper-a"),
    };

    let resolvers: UriResolverLike[] = [fooPackage];
    let staticResolver = StaticResolver.from(resolvers);

    config = {
      resolver: staticResolver,
    };

    client = new PolywrapClient(config);
    result = await client.validate(fooUri, {});

    expect(result.ok).toBeTruthy();

    result = await client.validate(greetingUri, {
      recursive: true,
    });
    resultError = (result as { error: Error }).error;
    expect(result.ok).toBeFalsy();
    expect(resultError).toBeTruthy();
    expect(resultError.message).toContain("Unable to find URI");

    await buildWrapper(greetingPath, undefined, true);

    let modifiedFooWrapper: IUriPackage = {
      uri: Uri.from(greetingUri),
      package: await getPackage("wrapper-b"),
    };
    resolvers.push(modifiedFooWrapper);
    staticResolver = StaticResolver.from(resolvers);

    const newConfig1: CoreClientConfig = {
      resolver: staticResolver,
      envs: config.envs,
      interfaces: config.interfaces,
    };
    client = new PolywrapClient(newConfig1);

    result = await client.validate(greetingUri, {
      recursive: true,
    });

    expect(result.ok).toBeTruthy();

    await buildWrapper(modifiedFooPath, undefined, true);
    let redirectUri: IUriRedirect = {
      from: Uri.from(fooUri),
      to: Uri.from(modifiedFooUri),
    };
    resolvers.push(redirectUri);

    staticResolver = StaticResolver.from(resolvers);

    const newConfig2: CoreClientConfig = {
      resolver: staticResolver,
      envs: newConfig1.envs,
      interfaces: newConfig1.interfaces,
    };

    client = new PolywrapClient(newConfig2);

    result = await client.validate(greetingUri, {
      abi: true,
    });

    expect(result.ok).toBeFalsy();
  });
});
