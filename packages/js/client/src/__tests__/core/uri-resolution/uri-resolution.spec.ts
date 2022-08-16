import { Uri } from "../../../../";
import { buildWrapper } from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import {
  coreInterfaceUris,
  IUriResolutionResult,
  IUriResolutionStep,
  PluginModule,
  UriResolutionHistoryType,
  UriResolutionResult,
} from "@polywrap/core-js";
import { getClient } from "../../utils/getClient";
import fs from "fs";

jest.setTimeout(200000);

const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;
const wrapperUri = new Uri(`wrap://file/${wrapperPath}/build`);

const simpleFsResolverWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-fs-resolver`;
const simpleFsResolverWrapperUri = new Uri(
  `wrap://file/${simpleFsResolverWrapperPath}/build`
);

const simpleRedirectResolverWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-redirect-resolver`;
const simpleRedirectResolverWrapperUri = new Uri(
  `wrap://file/${simpleRedirectResolverWrapperPath}/build`
);

export type CleanResolutionStep = (string | CleanResolutionStep)[];

const buildCleanUriHistory = (
  history: IUriResolutionStep<unknown>[],
  depth?: number
): CleanResolutionStep => {
  let cleanHistory: CleanResolutionStep = [];

  if (depth != null) {
    depth--;
  }

  if (!history) {
    return cleanHistory;
  }
  for (let step of history) {
    cleanHistory.push(`${step.sourceUri.uri} => ${step.resolverName}`);

    if (
      !step.result.history ||
      step.result.history.length === 0 ||
      (depth != null && depth < 0)
    ) {
      continue;
    }

    const subHistory = buildCleanUriHistory(step.result.history, depth);
    if (subHistory.length > 0) {
      cleanHistory.push(subHistory);
    }
  }

  return cleanHistory;
};

const expectResultWithHistory = async (
  receivedResult: IUriResolutionResult<unknown>,
  expectedResult: IUriResolutionResult<unknown>,
  historyFileName?: string
): Promise<void> => {
  if (!historyFileName) {
    expect(receivedResult.history).toBeUndefined();
  } else {
    await expectHistory(receivedResult.history, historyFileName);
  }

  expect(receivedResult.response).toEqual(expectedResult.response);
};

const expectHistory = async (
  receivedHistory: IUriResolutionStep<unknown>[] | undefined,
  historyFileName: string
): Promise<void> => {
  if (!receivedHistory) {
    fail("History is not defined");
  }

  let expectedCleanHistory = await fs.promises.readFile(
    `${__dirname}/histories/${historyFileName}.json`,
    "utf-8"
  );

  const receivedCleanHistory = replaceAll(JSON.stringify(buildCleanUriHistory(receivedHistory), null, 2), `${GetPathToTestWrappers()}/wasm-as`, "$root-wrapper-dir");

  expect(
    receivedCleanHistory
  ).toEqual(JSON.stringify(JSON.parse(expectedCleanHistory), null, 2));
};

const expectWrapperWithHistory = async (
  receivedResult: IUriResolutionResult<unknown>,
  expectedUri: Uri,
  historyFileName?: string
): Promise<void> => {
  const { response: result, history } = receivedResult;

  if (!historyFileName) {
    expect(history).toBeUndefined();
    return;
  } else {
    await expectHistory(history, historyFileName);
  }

  if (!result.ok) {
    fail("Uri resolution failed " + result.error);
  }

  const uriPackageOrWrapper = result.value;

  if (uriPackageOrWrapper.type !== "wrapper") {
    fail("Uri resolution did not return a uri or package");
  }

  expect(uriPackageOrWrapper.wrapper.uri).toEqual(expectedUri);
};

function replaceAll(str: string, strToReplace: string, replaceStr: string) {
  return str.replace(new RegExp(strToReplace, 'g'), replaceStr);
}

describe("URI resolution", () => {
  beforeAll(async () => {
    await buildWrapper(wrapperPath);
    await buildWrapper(simpleFsResolverWrapperPath);
    await buildWrapper(simpleRedirectResolverWrapperPath);
  });

  it("sanity", async () => {
    const uri = new Uri("ens/uri.eth");

    const client = await getClient();

    const response = await client.tryResolveToWrapper({
      uri,
      history: UriResolutionHistoryType.Full,
    });

    await expectResultWithHistory(
      response,
      UriResolutionResult.ok(uri),
      "sanity"
    );
  });

  it("can resolve redirects", async () => {
    const fromUri = new Uri("ens/from.eth");
    const toUri1 = new Uri("ens/to1.eth");
    const toUri2 = new Uri("ens/to2.eth");

    const client = await getClient({
      redirects: [
        {
          from: fromUri.uri,
          to: toUri1.uri,
        },
        {
          from: toUri1.uri,
          to: toUri2.uri,
        },
      ],
    });

    const response = await client.tryResolveToWrapper({
      uri: fromUri,
      history: UriResolutionHistoryType.Full,
    });

    await expectResultWithHistory(
      response,
      UriResolutionResult.ok(toUri2),
      "can resolve redirects"
    );
  });

  it("can resolve plugin", async () => {
    const pluginUri = new Uri("ens/plugin.eth");

    const client = await getClient({
      plugins: [
        {
          uri: pluginUri.uri,
          plugin: {
            factory: () => {
              return ({} as unknown) as PluginModule<{}>;
            },
            manifest: {
              schema: "",
              implements: [],
            },
          },
        },
      ],
    });

    const response = await client.tryResolveToWrapper({
      uri: pluginUri,
      history: UriResolutionHistoryType.Full,
    });

    await expectWrapperWithHistory(response, pluginUri, "can resolve plugin");
  });

  it("can resolve a URI resolver extension wrapper", async () => {
    const client = await getClient({
      interfaces: [
        {
          interface: coreInterfaceUris.uriResolver.uri,
          implementations: [simpleFsResolverWrapperUri.uri],
        },
      ],
    });

    const sourceUri = new Uri(`simple/${wrapperPath}/build`);
    const redirectedUri = wrapperUri;

    const response = await client.tryResolveToWrapper({
      uri: sourceUri,
      history: UriResolutionHistoryType.Full,
    });

    await expectWrapperWithHistory(
      response,
      redirectedUri,
      "can resolve a URI resolver extension wrapper"
    );
  });

  // it("can resolve cache", async () => {
  //   const client = await getClient();

  //   const response1 = await client.tryResolveToWrapper({
  //     uri: wrapperUri,
  //     history: UriResolutionHistoryType.Full,
  //   });

  //   await expectWrapperWithHistory(
  //     response1,
  //     wrapperUri,
  //     "can resolve cache - 1"
  //   );

  //   const response2 = await client.tryResolveToWrapper({
  //     uri: wrapperUri,
  //     history: UriResolutionHistoryType.Full,
  //   });

  //   await expectWrapperWithHistory(
  //     response2,
  //     wrapperUri,
  //     "can resolve cache - 2"
  //   );
  // });

  // it("can resolve cache - noCacheRead", async () => {
  //   const client = await getClient();

  //   const response1 = await client.tryResolveToWrapper({
  //     uri: wrapperUri,
  //     history: UriResolutionHistoryType.Full,
  //   });

  //   await expectWrapperWithHistory(
  //     response1,
  //     wrapperUri,
  //     "can resolve cache - noCacheRead - 1"
  //   );

  //   const response2 = await client.tryResolveToWrapper({
  //     uri: wrapperUri,
  //     history: UriResolutionHistoryType.Full,
  //     noCacheRead: true,
  //   });

  //   await expectWrapperWithHistory(
  //     response2,
  //     wrapperUri,
  //     "can resolve cache - noCacheRead - 2"
  //   );
  // });

  // it("can resolve cache - noCacheWrite", async () => {
  //   const client = await getClient();

  //   const result = await client.tryResolveToWrapper({
  //     uri: wrapperUri,
  //     history: UriResolutionHistoryType.Full,
  //     noCacheWrite: true,
  //   });

  //   expect(result.wrapper).toBeTruthy();
  //   expect(result.uri).toEqual(wrapperUri);
  //   expect(result.error).toBeFalsy();

  //   expect(result.history).toEqual([
  //     {
  //       uriResolver: "RedirectsResolver",
  //       sourceUri: wrapperUri,
  //       result: {
  //         uri: wrapperUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "CacheResolver",
  //       sourceUri: wrapperUri,
  //       result: {
  //         uri: wrapperUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "PluginResolver",
  //       sourceUri: wrapperUri,
  //       result: {
  //         uri: wrapperUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "ExtendableUriResolver",
  //       sourceUri: wrapperUri,
  //       result: {
  //         uri: wrapperUri,
  //         wrapper: result.wrapper,
  //         implementationUri: new Uri("wrap://ens/fs-resolver.polywrap.eth"),
  //       },
  //     },
  //   ]);

  //   const result2 = await client.tryResolveToWrapper({
  //     uri: wrapperUri,
  //     history: UriResolutionHistoryType.Full,
  //   });

  //   expect(result2.wrapper).toBeTruthy();
  //   expect(result2.uri).toEqual(wrapperUri);
  //   expect(result2.error).toBeFalsy();

  //   expect(result2.history).toEqual([
  //     {
  //       uriResolver: "RedirectsResolver",
  //       sourceUri: wrapperUri,
  //       result: {
  //         uri: wrapperUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "CacheResolver",
  //       sourceUri: wrapperUri,
  //       result: {
  //         uri: wrapperUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "PluginResolver",
  //       sourceUri: wrapperUri,
  //       result: {
  //         uri: wrapperUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "ExtendableUriResolver",
  //       sourceUri: wrapperUri,
  //       result: {
  //         uri: wrapperUri,
  //         wrapper: result.wrapper,
  //         implementationUri: new Uri("wrap://ens/fs-resolver.polywrap.eth"),
  //       },
  //     },
  //   ]);
  // });

  // it("can resolve previously cached URI after redirecting by a URI resolver extension", async () => {
  //   const client = await getClient({
  //     interfaces: [
  //       {
  //         interface: coreInterfaceUris.uriResolver.uri,
  //         implementations: [
  //           simpleFsResolverWrapperUri.uri,
  //           simpleRedirectResolverWrapperUri.uri,
  //         ],
  //       },
  //     ],
  //   });

  //   const sourceUri = new Uri(`simple-redirect/${wrapperPath}/build`);
  //   const redirectedUri = new Uri(`simple/${wrapperPath}/build`);
  //   const finalUri = wrapperUri;

  //   const result = await client.tryResolveToWrapper({
  //     uri: redirectedUri,
  //     history: UriResolutionHistoryType.Full,
  //   });

  //   expect(result.wrapper).toBeTruthy();
  //   expect(result.uri).toEqual(finalUri);
  //   expect(result.error).toBeFalsy();

  //   expect(result.history).toEqual([
  //     {
  //       uriResolver: "RedirectsResolver",
  //       sourceUri: redirectedUri,
  //       result: {
  //         uri: redirectedUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       sourceUri: redirectedUri,
  //       uriResolver: "CacheResolver",
  //       result: {
  //         uri: redirectedUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "PluginResolver",
  //       sourceUri: redirectedUri,
  //       result: {
  //         uri: redirectedUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "ExtendableUriResolver",
  //       sourceUri: redirectedUri,
  //       result: {
  //         uri: finalUri,
  //         wrapper: false,
  //         implementationUri: simpleFsResolverWrapperUri,
  //       },
  //     },
  //     {
  //       uriResolver: "RedirectsResolver",
  //       sourceUri: finalUri,
  //       result: {
  //         uri: finalUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       sourceUri: finalUri,
  //       uriResolver: "CacheResolver",
  //       result: {
  //         uri: finalUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "PluginResolver",
  //       sourceUri: finalUri,
  //       result: {
  //         uri: finalUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "ExtendableUriResolver",
  //       sourceUri: finalUri,
  //       result: {
  //         uri: finalUri,
  //         wrapper: result.wrapper,
  //         implementationUri: new Uri("wrap://ens/fs-resolver.polywrap.eth"),
  //       },
  //     },
  //   ]);

  //   const result2 = await client.tryResolveToWrapper({
  //     uri: sourceUri,
  //     history: UriResolutionHistoryType.Full,
  //   });

  //   expect(result2.wrapper).toBeTruthy();
  //   expect(result2.uri).toEqual(redirectedUri);
  //   expect(result2.error).toBeFalsy();

  //   expect(result2.history).toEqual([
  //     {
  //       uriResolver: "RedirectsResolver",
  //       sourceUri: sourceUri,
  //       result: {
  //         uri: sourceUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       sourceUri: sourceUri,
  //       uriResolver: "CacheResolver",
  //       result: {
  //         uri: sourceUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "PluginResolver",
  //       sourceUri: sourceUri,
  //       result: {
  //         uri: sourceUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       uriResolver: "ExtendableUriResolver",
  //       sourceUri: sourceUri,
  //       result: {
  //         uri: redirectedUri,
  //         wrapper: false,
  //         implementationUri: simpleRedirectResolverWrapperUri,
  //       },
  //     },
  //     {
  //       uriResolver: "RedirectsResolver",
  //       sourceUri: redirectedUri,
  //       result: {
  //         uri: redirectedUri,
  //         wrapper: false,
  //       },
  //     },
  //     {
  //       sourceUri: redirectedUri,
  //       uriResolver: "CacheResolver",
  //       result: {
  //         uri: redirectedUri,
  //         wrapper: result.wrapper,
  //       },
  //     },
  //   ]);
  // });

  it("restarts URI resolution after URI resolver extension redirect", async () => {
    // Testing that the URI resolution process restarts after a URI resolver extension redirect
    const sourceUri = new Uri(`simple-redirect/${wrapperPath}/build`);
    const resolverRedirectUri = new Uri(`simple/${wrapperPath}/build`);
    const finalRedirectedUri = new Uri(`ens/redirect.eth`);
    const client = await getClient({
      redirects: [
        {
          from: resolverRedirectUri.uri,
          to: finalRedirectedUri.uri,
        },
      ],
      interfaces: [
        {
          interface: coreInterfaceUris.uriResolver.uri,
          implementations: [
            simpleFsResolverWrapperUri.uri,
            simpleRedirectResolverWrapperUri.uri,
          ],
        },
      ],
    });
    const response = await client.tryResolveToWrapper({
      uri: sourceUri,
      history: UriResolutionHistoryType.Full,
    });
    await expectResultWithHistory(
      response,
      UriResolutionResult.ok(finalRedirectedUri),
      "restarts URI resolution after URI resolver extension redirect",
    );
  });

  it("can resolve uri with custom resolver", async () => {
    const ensUri = new Uri(`ens/test`);
    const redirectUri = new Uri(`ens/redirect.eth`);

    const client = await getClient({
      resolver: {
        name: "CustomResolver",
        tryResolveToWrapper: async (uri: Uri) => {
          if (uri.uri === ensUri.uri) {
            return UriResolutionResult.ok(redirectUri);
          }

          return UriResolutionResult.ok(uri);
        },
      },
    });

    const response = await client.tryResolveToWrapper({
      uri: ensUri,
      history: UriResolutionHistoryType.Full,
    });

    await expectResultWithHistory(
      response,
      UriResolutionResult.ok(redirectUri)
    );
  });

  it("can resolve uri with custom resolver at invoke-time", async () => {
    const fromUri = new Uri(`ens/from.eth`);
    const redirectUri = new Uri(`ens/to.eth`);

    const client = await getClient();

    const response = await client.tryResolveToWrapper({
      uri: fromUri,
      history: UriResolutionHistoryType.Full,
      config: {
        resolver: {
          name: "CustomResolver",
          tryResolveToWrapper: async (uri: Uri) => {
            if (uri.uri === fromUri.uri) {
              return UriResolutionResult.ok(redirectUri);
            }

            return UriResolutionResult.ok(uri);
          },
        },
      },
    });

    await expectResultWithHistory(
      response,
      UriResolutionResult.ok(redirectUri)
    );
  });

  it("custom wrapper resolver does not cause infinite recursion when resolved at runtime", async () => {
    const client = await getClient({
      interfaces: [
        {
          interface: "ens/uri-resolver.core.polywrap.eth",
          implementations: ["ens/undefined-resolver.eth"],
        },
      ],
    });

    const response = await client.tryResolveToWrapper({
      uri: "ens/test.eth",
      history: UriResolutionHistoryType.Full,
    });

    await expectResultWithHistory(
      response,
      UriResolutionResult.err(
        "While resolving wrap://ens/test.eth with URI resolver extension wrap://ens/undefined-resolver.eth, the extension could not be fully resolved. Last found URI is wrap://ens/undefined-resolver.eth"
      ),
      "custom wrapper resolver does not cause infinite recursion when resolved at runtime"
    );
  });

  // it("unresolvable custom wrapper resolver is found when preloaded", async () => {
  //   const client = await getClient({
  //     interfaces: [
  //       {
  //         interface: "ens/uri-resolver.core.polywrap.eth",
  //         implementations: ["ens/test-resolver.eth"],
  //       },
  //     ],
  //   });

  //   const { success, failedUriResolvers } = await client.loadUriResolvers();
  //   expect(success).toBeFalsy();
  //   expect(failedUriResolvers).toEqual(["wrap://ens/test-resolver.eth"]);

  //   const { error } = await client.tryResolveToWrapper({
  //     uri: "ens/test.eth",
  //     history: UriResolutionHistoryType.Full,
  //   });
  //   expect(error).toBeTruthy();

  //   if (!error) {
  //     throw Error();
  //   }

  //   expect(error.type).toEqual(UriResolutionErrorType.UriResolver);
  //   expect(
  //     (error as UriResolverError<LoadResolverExtensionsError>).error.message
  //   ).toEqual(
  //     "Could not load the following URI Resolver implementations: wrap://ens/test-resolver.eth"
  //   );
  // });

  // it("can preload wrapper resolvers", async () => {
  //   const client = await getClient();

  //   const { success, failedUriResolvers } = await client.loadUriResolvers();

  //   expect(success).toBeTruthy();
  //   expect(failedUriResolvers.length).toEqual(0);

  //   const { wrapper, uri, error } = await client.tryResolveToWrapper({
  //     uri: "ens/test.eth",
  //     history: UriResolutionHistoryType.Full,
  //   });

  //   expect(error).toBeFalsy();
  //   expect(wrapper).toBeFalsy();
  //   expect(uri?.uri).toEqual("wrap://ens/test.eth");
  // });
});
