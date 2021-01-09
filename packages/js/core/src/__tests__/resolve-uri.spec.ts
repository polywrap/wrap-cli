import {
  Api,
  Client,
  InvokeApiOptions,
  InvokeApiResult,
  Manifest,
  PluginModules,
  PluginPackage,
  QueryApiOptions,
  QueryApiResult,
  resolveUri,
  Uri,
  UriRedirect
} from "../";

describe("resolveUri", () => {

  const client = (
    redirects: UriRedirect[],
    apis: Record<string, PluginModules>
  ): Client => ({
    redirects: () => (redirects),
    query: (options: QueryApiOptions<any>): Promise<QueryApiResult> => {
      return Promise.resolve({ data: { foo: "foo" } });
    },
    invoke: (options: InvokeApiOptions): Promise<InvokeApiResult> => {
      return Promise.resolve({
        data: apis[options.uri.uri][options.module][options.method](options.input, { } as any)
      });
    }
  });

  const createPluginApi = (uri: Uri, plugin: PluginPackage): Api => {
    return {
      invoke: () => ({ uri, plugin } as any)
    }
  };

  const createApi = (uri: Uri, manifest: Manifest, apiResolver: Uri): Api => {
    return {
      invoke: () => ({ uri, manifest, apiResolver } as any)
    }
  };

  const ensApi: PluginModules = {
    query: {
      tryResolveUri: (input: { authority: string, path: string }, client: any) => {
        return {
          uri: input.authority === "ens" ? "ipfs/QmHash" : undefined
        }
      }
    }
  }

  const ipfsApi: PluginModules = {
    query: {
      tryResolveUri: (input: { authority: string, path: string }, client: any) => {
        return {
          manifest: `{ "version": "hey" }`
        }
      }
    }
  }

  it("works in the typical case", async () => {
    const redirects: UriRedirect[] = [
      {
        from: new Uri("w3/api-resolver"),
        to: new Uri("ens/ens")
      },
      {
        from: new Uri("w3/api-resolver"),
        to: new Uri("ens/ipfs")
      }
    ];

    const apis: Record<string, PluginModules> = {
      "w3://ens/ens": ensApi,
      "w3://ens/ipfs": ipfsApi
    };

    const result = await resolveUri(
      new Uri("ens/test.eth"),
      client(redirects, apis),
      createPluginApi,
      createApi
    );

    const apiIdentity = result.invoke({} as any, {} as any);

    expect(apiIdentity).toMatchObject({
      uri: new Uri("ens/test.eth"),
      manifest: { version: "hey" },
      apiResolver: new Uri("ens/ipfs")
    });
  });
});

// TODO:
// x multiple api-resolvers
// new plugin that's a URI resolver
// new web3api URI that's a URI resolver
// nested web3api that's a URI resolver available through another URI authority ([ens => crypto], [crypto => new])
// circular redirect loops
// plugin that has a URI which is being redirected
// plugin which has from = uri-resolver, then have another redirect uri-resolver to something else (could easily break...)

// TODO:
// For core API's have the URI be: w3://w3/uri-resolver
