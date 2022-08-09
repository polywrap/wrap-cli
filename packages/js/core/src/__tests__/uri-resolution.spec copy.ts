// import {
//   UriResolverInterface,
//   coreInterfaceUris,
//   Client,
//   InvokeOptions,
//   InvokeResult,
//   PluginModule,
//   QueryOptions,
//   QueryResult,
//   Uri,
//   UriRedirect,
//   RedirectsResolver,
//   ExtendableUriResolver,
//   PluginResolver,
//   Wrapper,
//   Env,
//   GetFileOptions,
//   GetImplementationsOptions,
//   InterfaceImplementations,
//   PluginRegistration,
//   SubscribeOptions,
//   Subscription,
//   PluginPackage,
//   GetManifestOptions,
// } from "..";

// import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
// import { msgpackEncode } from "@polywrap/msgpack-js";
// import {
//   buildUriResolver,
//   LegacyPluginsResolver,
//   LegacyRedirectsResolver,
// } from "../uri-resolution/resolvers";
// import { IUriResolutionStep } from "../uri-resolution/core";

// describe("URI resolution", () => {
//   const client = (
//     wrappers: Record<string, PluginModule<{}>>,
//     plugins: PluginRegistration<Uri>[] = [],
//     interfaces: InterfaceImplementations<Uri>[] = [],
//     redirects: UriRedirect<Uri>[] = []
//   ): Client =>
//     (({
//       getEnvByUri: () => undefined,
//       getRedirects: () => redirects,
//       getPlugins: () => plugins,
//       getInterfaces: () => interfaces,
//       query: <
//         TData extends Record<string, unknown> = Record<string, unknown>,
//         TVariables extends Record<string, unknown> = Record<string, unknown>
//       >(
//         _options: QueryOptions<TVariables, string | Uri>
//       ): Promise<QueryResult<TData>> => {
//         return Promise.resolve({
//           data: ({
//             foo: "foo",
//           } as Record<string, unknown>) as TData,
//         });
//       },
//       invoke: <TData = unknown>(
//         options: InvokeOptions<string | Uri>
//       ): Promise<InvokeResult<TData>> => {
//         let uri = options.uri;
//         if (Uri.isUri(uri)) {
//           uri = uri.uri;
//         }
//         return Promise.resolve({
//           // @ts-ignore
//           data: wrappers[uri]?.[options.method](
//             options.args as Record<string, unknown>,
//             {} as Client
//           ) as TData,
//         });
//       },
//       subscribe: <
//         TData extends Record<string, unknown> = Record<string, unknown>
//       >(
//         _options: SubscribeOptions<Record<string, unknown>, string | Uri>
//       ): Subscription<TData> => {
//         return {
//           frequency: 0,
//           isActive: false,
//           stop: () => {},
//           async *[Symbol.asyncIterator](): AsyncGenerator<
//             QueryResult<TData>
//           > {},
//         };
//       },
//       getSchema: (uri: Uri | string): Promise<string> => {
//         return Promise.resolve("");
//       },
//       getFile: () => {
//         return Promise.resolve("");
//       },
//       getImplementations: <TUri extends Uri | string>(
//         uri: TUri,
//         options: GetImplementationsOptions
//       ) => {
//         return [uri];
//       },
//     } as unknown) as Client);

//   const createPluginWrapper = (
//     uri: Uri,
//     plugin: PluginPackage<{}>
//   ): Wrapper => {
//     return {
//       invoke: () =>
//         Promise.resolve({
//           data: {
//             uri,
//             plugin,
//           },
//           encoded: false,
//         }),
//       getSchema: (_client: Client): Promise<string> => Promise.resolve(""),
//       getFile: (options: GetFileOptions, client: Client) => Promise.resolve(""),
//       getManifest: (options: GetManifestOptions, client: Client) =>
//         Promise.resolve({} as WrapManifest),
//     };
//   };

//   const createWrapper = (
//     uri: Uri,
//     manifest: WrapManifest,
//     uriResolver: string
//   ): Wrapper => {
//     return {
//       invoke: () =>
//         Promise.resolve({
//           data: {
//             uri,
//             manifest,
//             uriResolver,
//           },
//           encoded: false,
//         }),
//       getSchema: (_client: Client): Promise<string> => Promise.resolve(""),
//       getFile: (options: GetFileOptions, client: Client) => Promise.resolve(""),
//       getManifest: (options: GetManifestOptions, client) => Promise.reject(""),
//     };
//   };

//   const testManifest: WrapManifest = {
//     version: "0.1.0",
//     type: "wasm",
//     name: "dog-cat",
//     abi: {},
//   };

//   const ensWrapper = {
//     tryResolveUri: (
//       args: { authority: string; path: string },
//       _client: Client
//     ): UriResolverInterface.MaybeUriOrManifest => {
//       return {
//         uri: args.authority === "ens" ? "ipfs/QmHash" : undefined,
//       };
//     },
//   };

//   const ipfsWrapper = {
//     tryResolveUri: (
//       args: { authority: string; path: string },
//       _client: Client
//     ): UriResolverInterface.MaybeUriOrManifest => {
//       return {
//         manifest:
//           args.authority === "ipfs" ? msgpackEncode(testManifest) : undefined,
//       };
//     },
//   };

//   const pluginWrapper = {
//     tryResolveUri: (
//       args: { authority: string; path: string },
//       _client: Client
//     ): UriResolverInterface.MaybeUriOrManifest => {
//       return {
//         manifest:
//           args.authority === "my" ? msgpackEncode(testManifest) : undefined,
//       };
//     },
//   };

//   const plugins: PluginRegistration<Uri>[] = [
//     {
//       uri: new Uri("ens/ens-resolver"),
//       plugin: {
//         factory: () => (ensWrapper as unknown) as PluginModule<{}>,
//         manifest: {
//           schema: "",
//           implements: [coreInterfaceUris.uriResolver],
//         },
//       },
//     },
//     {
//       uri: new Uri("ens/my-plugin"),
//       plugin: {
//         factory: () => (pluginWrapper as unknown) as PluginModule<{}>,
//         manifest: {
//           schema: "",
//           implements: [coreInterfaceUris.uriResolver],
//         },
//       },
//     },
//     {
//       uri: new Uri("ens/my-plugin"),
//       plugin: {
//         factory: () => (pluginWrapper as unknown) as PluginModule<{}>,
//         manifest: {
//           schema: "",
//           implements: [coreInterfaceUris.uriResolver],
//         },
//       },
//     },
//     {
//       uri: new Uri("ens/my-plugin"),
//       plugin: {
//         factory: () => (pluginWrapper as unknown) as PluginModule<{}>,
//         manifest: {
//           schema: "",
//           implements: [coreInterfaceUris.uriResolver],
//         },
//       },
//     },
//   ];

//   const interfaces: InterfaceImplementations<Uri>[] = [
//     {
//       interface: coreInterfaceUris.uriResolver,
//       implementations: [
//         new Uri("ens/ens-resolver"),
//         new Uri("ens/ipfs-resolver"),
//         new Uri("ens/my-plugin"),
//       ],
//     },
//   ];

//   const resolver = buildUriResolver(
//     [
//       new LegacyRedirectsResolver(),
//       new LegacyPluginsResolver((uri: Uri, plugin: PluginPackage<{}>) =>
//         createPluginWrapper(uri, plugin)
//       ),
//       new ExtendableUriResolver(
//         { fullResolution: false },
//         (
//           uri: Uri,
//           manifest: WrapManifest,
//           uriResolver: string,
//           environment: Env<Uri> | undefined
//         ) => {
//           return createWrapper(uri, manifest, uriResolver);
//         },
//         { noValidate: true }
//       ),
//     ],
//     {
//       fullResolution: true,
//     }
//   );

//   it("URI resolver", () => {
//     // const resolve;
//     // const wrapper = new Uri("wrap://ens/ens");
//     // const file = new Uri("wrap/some-file");
//     // const path = "wrap/some-path";
//     // const module = UriResolverInterface.module;
//     // const uri = new Uri("wrap/some-uri");
//     // expect(module.tryResolveUri(client(wrappers), wrapper, uri)).toBeDefined();
//     // expect(module.getFile(client(wrappers), file, path)).toBeDefined();
//   });

//   it("works in the typical case", async () => {
//     const unknownUri = new Uri("test-uri");
//     const fromUri = new Uri("1");
//     const toUri = new Uri("2");

//     const resolver = new RedirectsResolver([{ from: fromUri, to: toUri }], {
//       fullResolution: true,
//     });

//     const result = await resolver.tryResolveToWrapper(
//       unknownUri,
//       client({}, plugins, interfaces),
//       new Map<string, Wrapper>()
//     );

//     expect(result.wrapper).toBeFalsy();
//     expect(result.uri.uri).toEqual(unknownUri);

//     const redirectResult = await resolver.tryResolveToWrapper(
//       fromUri,
//       client({}, plugins, interfaces),
//       new Map<string, Wrapper>()
//     );

//     expect(redirectResult.wrapper).toBeFalsy();
//     expect(redirectResult.uri.uri).toEqual(toUri);
//   });

//   it("uses a plugin that implements uri-resolver", async () => {
//     const result = await resolver.tryResolveToWrapper(
//       new Uri("my/something-different"),
//       client(wrappers, plugins, interfaces),
//       new Map<string, Wrapper>()
//     );

//     expect(result.wrapper).toBeTruthy();

//     const wrapperIdentity = await result.wrapper!.invoke(
//       {} as InvokeOptions<Uri>,
//       {} as Client
//     );

//     expect(wrapperIdentity.data).toMatchObject({
//       uri: new Uri("my/something-different"),
//       manifest: testManifest,
//       uriResolver: "wrap://ens/my-plugin",
//     });
//   });

//   it("works when direct query a Polywrap that implements the uri-resolver", async () => {
//     const result = await resolver.tryResolveToWrapper(
//       new Uri("ens/ens"),
//       client(wrappers, plugins, interfaces),
//       new Map<string, Wrapper>()
//     );

//     let step: IUriResolutionStep | undefined =
//       result.history && result.history[2];
//     console.log("aaaaaaaadddddd", step?.result);

//     expect(result.wrapper).toBeTruthy();

//     const wrapperIdentity = await result.wrapper!.invoke(
//       {} as InvokeOptions<Uri>,
//       {} as Client
//     );

//     expect(wrapperIdentity.data).toMatchObject({
//       uri: new Uri("ipfs/QmHash"),
//       manifest: testManifest,
//       uriResolver: "wrap://ens/ipfs",
//     });
//   });

//   it("works when direct query a plugin Polywrap that implements the uri-resolver", async () => {
//     const result = await resolver.tryResolveToWrapper(
//       new Uri("my/something-different"),
//       client(wrappers, plugins, interfaces),
//       new Map<string, Wrapper>()
//     );

//     expect(result.wrapper).toBeTruthy();

//     const wrapperIdentity = await result.wrapper!.invoke(
//       {} as InvokeOptions<Uri>,
//       {} as Client
//     );

//     expect(wrapperIdentity.data).toMatchObject({
//       uri: new Uri("my/something-different"),
//       manifest: testManifest,
//       uriResolver: "wrap://ens/my-plugin",
//     });
//   });

//   it("returns an error when circular redirect loops are found", async () => {
//     const circular: UriRedirect<Uri>[] = [
//       {
//         from: new Uri("some/wrapper"),
//         to: new Uri("ens/wrapper"),
//       },
//       {
//         from: new Uri("ens/wrapper"),
//         to: new Uri("some/wrapper"),
//       },
//     ];

//     expect.assertions(1);

//     return resolver
//       .tryResolveToWrapper(
//         new Uri("some/wrapper"),
//         client(wrappers, plugins, interfaces, circular),
//         new Map<string, Wrapper>()
//       )
//       .catch((e: Error) =>
//         expect(e.message).toMatch(/Infinite loop while resolving URI/)
//       );
//   });

//   it("throws when redirect missing the from property", async () => {
//     const missingFromProperty: UriRedirect<Uri>[] = [
//       {
//         from: new Uri("some/wrapper"),
//         to: new Uri("ens/wrapper"),
//       },
//       {
//         from: null as any,
//         to: new Uri("another/wrapper"),
//       },
//     ];

//     expect.assertions(1);

//     return resolver
//       .tryResolveToWrapper(
//         new Uri("some/wrapper"),
//         client(wrappers, plugins, interfaces, missingFromProperty),
//         new Map<string, Wrapper>()
//       )
//       .catch((e: Error) =>
//         expect(e.message).toMatch(
//           "Redirect missing the from property.\nEncountered while resolving wrap://some/wrapper"
//         )
//       );
//   });

//   it("works when a Polywrap registers a Plugin", async () => {
//     const pluginRegistrations: PluginRegistration<Uri>[] = [
//       ...plugins,
//       {
//         uri: new Uri("some/wrapper"),
//         plugin: {
//           factory: () => ({} as PluginModule<{}>),
//           manifest: {
//             schema: "",
//             implements: [coreInterfaceUris.uriResolver],
//           },
//         },
//       },
//     ];

//     const result = await resolver.tryResolveToWrapper(
//       new Uri("some/wrapper"),
//       client(wrappers, pluginRegistrations, interfaces),
//       new Map<string, Wrapper>()
//     );

//     expect(result.wrapper).toBeTruthy();

//     const wrapperIdentity = await result.wrapper!.invoke(
//       {} as InvokeOptions<Uri>,
//       {} as Client
//     );

//     expect(wrapperIdentity.error).toBeUndefined();
//   });

//   it("returns URI when it does not resolve to an Wrapper", async () => {
//     const faultyIpfsWrapper = {
//       tryResolveUri: (
//         args: { authority: string; path: string },
//         _client: Client
//       ) => {
//         return {
//           manifest: null,
//         };
//       },
//     };

//     const uri = new Uri("some/wrapper");

//     const {
//       uri: resolvedUri,
//       wrapper,
//       error,
//     } = await resolver.tryResolveToWrapper(
//       uri,
//       client(
//         {
//           ...wrappers,
//           "wrap://ens/ipfs": (faultyIpfsWrapper as unknown) as PluginModule<{}>,
//         },
//         plugins,
//         interfaces
//       ),
//       new Map<string, Wrapper>()
//     );

//     expect(resolvedUri).toEqual(uri);
//     expect(wrapper).toBeFalsy();
//     expect(error).toBeFalsy();
//   });
// });
