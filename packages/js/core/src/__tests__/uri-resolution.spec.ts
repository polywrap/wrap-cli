import {
  UriResolverInterface,
  coreInterfaceUris,
  Client,
  InvokeOptions,
  InvokeResult,
  PluginModule,
  QueryOptions,
  QueryResult,
  Uri,
  UriRedirect,
  RedirectsResolver,
  ExtendableUriResolver,
  PluginResolver,
  Wrapper,
  Env,
  GetFileOptions,
  GetImplementationsOptions,
  InterfaceImplementations,
  PluginRegistration,
  SubscribeOptions,
  Subscription,
  PluginPackage,
  GetManifestOptions,
} from "..";

import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { msgpackEncode } from "@polywrap/msgpack-js";
import {
  buildUriResolver,
  LegacyPluginsResolver,
  LegacyRedirectsResolver,
} from "../uri-resolution/resolvers";
import { IUriResolutionStep } from "../uri-resolution/core";

describe("URI resolution", () => {
  const client = (
    wrappers: Record<string, PluginModule<{}>>,
    plugins: PluginRegistration<Uri>[] = [],
    interfaces: InterfaceImplementations<Uri>[] = [],
    redirects: UriRedirect<Uri>[] = []
  ): Client =>
    (({
      getEnvByUri: () => undefined,
      getRedirects: () => redirects,
      getPlugins: () => plugins,
      getInterfaces: () => interfaces,
      query: <
        TData extends Record<string, unknown> = Record<string, unknown>,
        TVariables extends Record<string, unknown> = Record<string, unknown>
      >(
        _options: QueryOptions<TVariables, string | Uri>
      ): Promise<QueryResult<TData>> => {
        return Promise.resolve({
          data: ({
            foo: "foo",
          } as Record<string, unknown>) as TData,
        });
      },
      invoke: <TData = unknown>(
        options: InvokeOptions<string | Uri>
      ): Promise<InvokeResult<TData>> => {
        let uri = options.uri;
        if (Uri.isUri(uri)) {
          uri = uri.uri;
        }
        return Promise.resolve({
          // @ts-ignore
          data: wrappers[uri]?.[options.method](
            options.args as Record<string, unknown>,
            {} as Client
          ) as TData,
        });
      },
      subscribe: <
        TData extends Record<string, unknown> = Record<string, unknown>
      >(
        _options: SubscribeOptions<Record<string, unknown>, string | Uri>
      ): Subscription<TData> => {
        return {
          frequency: 0,
          isActive: false,
          stop: () => {},
          async *[Symbol.asyncIterator](): AsyncGenerator<
            QueryResult<TData>
          > {},
        };
      },
      getSchema: (uri: Uri | string): Promise<string> => {
        return Promise.resolve("");
      },
      getFile: () => {
        return Promise.resolve("");
      },
      getImplementations: <TUri extends Uri | string>(
        uri: TUri,
        options: GetImplementationsOptions
      ) => {
        return [uri];
      },
    } as unknown) as Client);

  it("can resolve URI redirects", async () => {
    const unknownUri = new Uri("test/test-uri");
    const fromUri = new Uri("test/1");
    const toUri = new Uri("test/2");

    const resolver = new RedirectsResolver([{ from: fromUri, to: toUri }], {
      fullResolution: true,
    });

    const result = await resolver.tryResolveToWrapper(
      unknownUri,
      client({}, [], []),
      new Map<string, Wrapper>()
    );

    expect(result.wrapper).toBeFalsy();
    expect(result.uri).toEqual(unknownUri);

    const redirectResult = await resolver.tryResolveToWrapper(
      fromUri,
      client({}, [], []),
      new Map<string, Wrapper>()
    );

    expect(redirectResult.wrapper).toBeFalsy();
    expect(redirectResult.uri).toEqual(toUri);
  });
});
