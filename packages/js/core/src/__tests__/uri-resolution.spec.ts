// import {
//   Client,
//   InvokeOptions,
//   InvokeResult,
//   PluginModule,
//   QueryOptions,
//   QueryResult,
//   Uri,
//   UriRedirect,
//   GetImplementationsOptions,
//   InterfaceImplementations,
//   PluginRegistration,
//   SubscribeOptions,
//   Subscription,
// } from "..";

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

// it("can resolve URI redirects", async () => {
//   const unknownUri = new Uri("test/test-uri");
//   const fromUri = new Uri("test/1");
//   const toUri = new Uri("test/2");

//   const resolver = new RedirectsResolver([{ from: fromUri, to: toUri }], {
//     fullResolution: true,
//   });

//   const { result, history } = await resolver.tryResolveUri(
//     unknownUri,
//     client({}, [], []),
//     new Map<string, Wrapper>()
//   );

//   console.log("result", result);
//   console.log("history", history);

//   expect(result.ok).toBeTruthy();

//   if (!result.ok) {
//     throw "Result should not be an error";
//   }

//   expect(result.value.uri).toBeTruthy();
//   expect(result.value.uri).toEqual(unknownUri);

//   const {
//     result: redirectResult,
//     history: redirectHistory,
//   } = await resolver.tryResolveUri(
//     fromUri,
//     client({}, [], []),
//     new Map<string, Wrapper>()
//   );

//   console.log("redirectResponse", redirectResult);
//   console.log("redirectHistory", redirectHistory);

//   expect(redirectResult.ok).toBeTruthy();

//   if (!redirectResult.ok) {
//     throw "Result should not be an error";
//   }
//   expect(redirectResult.value.wrapper).toBeFalsy();
//   expect(redirectResult.value.uri).toBeTruthy();
//   expect(redirectResult.value.uri).toEqual(toUri);
// });
// });
