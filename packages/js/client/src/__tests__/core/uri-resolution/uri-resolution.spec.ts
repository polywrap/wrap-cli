import { buildWrapper } from "@polywrap/test-env-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import {
  Uri,
  IUriResolutionStep,
  UriPackageOrWrapper,
  UriResolutionContext,
  buildCleanUriHistory,
} from "@polywrap/core-js";
import {
  UriResolver,
  getUriResolutionPath,
  UriResolutionResult,
} from "@polywrap/uri-resolvers-js";
import fs from "fs";
import { Result } from "@polywrap/result";
import { mockPluginRegistration } from "../../helpers/mockPluginRegistration";
import { PolywrapClient, ExtendableUriResolver } from "../../../";

jest.setTimeout(300000);

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

const expectResultWithHistory = async (
  receivedResult: Result<UriPackageOrWrapper, unknown>,
  expectedResult: Result<UriPackageOrWrapper, unknown>,
  uriHistory: IUriResolutionStep<unknown>[],
  historyFileName: string
): Promise<void> => {
  if (historyFileName && uriHistory) {
    await expectHistory(uriHistory, historyFileName);
  }

  expect(receivedResult).toEqual(expectedResult);
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

  const receivedCleanHistory = replaceAll(
    JSON.stringify(buildCleanUriHistory(receivedHistory), null, 2),
    `${GetPathToTestWrappers()}/wasm-as`,
    "$root-wrapper-dir"
  );

  expect(receivedCleanHistory).toEqual(
    JSON.stringify(JSON.parse(expectedCleanHistory), null, 2)
  );
};

const expectWrapperWithHistory = async (
  receivedResult: Result<UriPackageOrWrapper, unknown>,
  expectedUri: Uri,
  uriHistory: IUriResolutionStep<unknown>[],
  historyFileName: string
): Promise<void> => {
  if (historyFileName && uriHistory) {
    await expectHistory(uriHistory, historyFileName);
  }

  if (!receivedResult.ok) {
    fail("Uri resolution failed " + receivedResult.error);
  }

  const uriPackageOrWrapper = receivedResult.value;

  if (uriPackageOrWrapper.type !== "wrapper") {
    if (uriPackageOrWrapper.type === "package") {
      fail(
        `Uri resolution did not return a wrapper, it returned a package (${uriPackageOrWrapper.uri.uri})`
      );
    } else {
      fail(
        `Uri resolution did not return a wrapper, it returned a uri (${uriPackageOrWrapper.uri.uri})`
      );
    }
  }

  expect(uriPackageOrWrapper.uri.uri).toEqual(expectedUri.uri);
};

function replaceAll(str: string, strToReplace: string, replaceStr: string) {
  return str.replace(new RegExp(strToReplace, "g"), replaceStr);
}

describe("URI resolution", () => {
  beforeAll(async () => {
    await Promise.all([
      buildWrapper(wrapperPath, undefined, true),
      buildWrapper(simpleFsResolverWrapperPath, undefined, true),
      buildWrapper(simpleRedirectResolverWrapperPath, undefined, true)
    ]);
  });

  it("sanity", async () => {
    const uri = new Uri("ens/uri.eth");

    const client = new PolywrapClient();

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectResultWithHistory(
      result,
      UriResolutionResult.ok(uri),
      resolutionContext.getHistory(),
      "sanity"
    );
  });

  it("can resolve redirects", async () => {
    const fromUri = new Uri("ens/from.eth");
    const toUri1 = new Uri("ens/to1.eth");
    const toUri2 = new Uri("ens/to2.eth");

    const client = new PolywrapClient({
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

    const resolutionContext = new UriResolutionContext();
    const response = await client.tryResolveUri({
      uri: fromUri,
      resolutionContext,
    });

    await expectResultWithHistory(
      response,
      UriResolutionResult.ok(toUri2),
      getUriResolutionPath(resolutionContext.getHistory()),
      "can resolve redirects"
    );

    expect(resolutionContext.getResolutionPath().map((x) => x.uri)).toEqual([
      "wrap://ens/from.eth",
      "wrap://ens/to1.eth",
      "wrap://ens/to2.eth",
    ]);
  });

  it("can resolve plugin", async () => {
    const pluginUri = new Uri("ens/plugin.eth");
    const client = new PolywrapClient(
      {
        resolvers: [UriResolver.from(mockPluginRegistration(pluginUri))],
      },
    );

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({
      uri: pluginUri,
      resolutionContext,
    });

    await expectWrapperWithHistory(
      result,
      pluginUri,
      getUriResolutionPath(resolutionContext.getHistory()),
      "can resolve plugin"
    );

    expect(["wrap://ens/plugin.eth"]).toEqual(
      resolutionContext.getResolutionPath().map((x) => x.uri)
    );
  });

  it("can resolve a URI resolver extension wrapper", async () => {
    const client = new PolywrapClient({
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [simpleFsResolverWrapperUri],
        },
      ],
    });

    const sourceUri = new Uri(`simple/${wrapperPath}/build`);
    const redirectedUri = wrapperUri;

    const resolutionContext = new UriResolutionContext();
    const response = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectWrapperWithHistory(
      response,
      redirectedUri,
      getUriResolutionPath(resolutionContext.getHistory()),
      "can resolve a URI resolver extension wrapper"
    );

    expect([sourceUri.uri, redirectedUri.uri]).toEqual(
      resolutionContext.getResolutionPath().map((x) => x.uri)
    );
  });

  it("can resolve cache", async () => {
    const client = new PolywrapClient();

    const resolutionContext1 = new UriResolutionContext();
    const result1 = await client.tryResolveUri({
      uri: wrapperUri,
      resolutionContext: resolutionContext1,
    });

    await expectWrapperWithHistory(
      result1,
      wrapperUri,
      getUriResolutionPath(resolutionContext1.getHistory()),
      "can resolve cache - 1"
    );
    expect([wrapperUri.uri]).toEqual(
      resolutionContext1.getResolutionPath().map((x) => x.uri)
    );

    const resolutionContext2 = new UriResolutionContext();
    const result2 = await client.tryResolveUri({
      uri: wrapperUri,
      resolutionContext: resolutionContext2,
    });

    await expectWrapperWithHistory(
      result2,
      wrapperUri,
      getUriResolutionPath(resolutionContext2.getHistory()),
      "can resolve cache - 2"
    );
    expect([wrapperUri.uri]).toEqual(
      resolutionContext2.getResolutionPath().map((x) => x.uri)
    );
  });

  it("can resolve previously cached URI after redirecting by a URI resolver extension", async () => {
    const client = new PolywrapClient({
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [
            simpleFsResolverWrapperUri,
            simpleRedirectResolverWrapperUri,
          ],
        },
      ],
    });

    const sourceUri = new Uri(`simple-redirect/${wrapperPath}/build`);
    const redirectedUri = new Uri(`simple/${wrapperPath}/build`);
    const finalUri = wrapperUri;

    const resolutionContext1 = new UriResolutionContext();
    const result1 = await client.tryResolveUri({
      uri: redirectedUri,
      resolutionContext: resolutionContext1,
    });

    await expectWrapperWithHistory(
      result1,
      finalUri,
      getUriResolutionPath(resolutionContext1.getHistory()),
      "can resolve previously cached URI after redirecting by a URI resolver extension - 1"
    );
    expect([redirectedUri.uri, finalUri.uri]).toEqual(
      resolutionContext1.getResolutionPath().map((x) => x.uri)
    );

    const resolutionContext2 = new UriResolutionContext();
    const result2 = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext: resolutionContext2,
    });

    await expectWrapperWithHistory(
      result2,
      redirectedUri,
      getUriResolutionPath(resolutionContext2.getHistory()),
      "can resolve previously cached URI after redirecting by a URI resolver extension - 2"
    );
    expect([sourceUri.uri, redirectedUri.uri]).toEqual(
      resolutionContext2.getResolutionPath().map((x) => x.uri)
    );
  });

  it("restarts URI resolution after URI resolver extension redirect", async () => {
    // Testing that the URI resolution process restarts after a URI resolver extension redirect
    const sourceUri = new Uri(`simple-redirect/${wrapperPath}/build`);
    const resolverRedirectUri = new Uri(`simple/${wrapperPath}/build`);
    const finalRedirectedUri = new Uri(`ens/redirect.eth`);
    const client = new PolywrapClient({
      redirects: [
        {
          from: resolverRedirectUri,
          to: finalRedirectedUri,
        },
      ],
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [
            simpleFsResolverWrapperUri,
            simpleRedirectResolverWrapperUri,
          ],
        },
      ],
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });
    await expectResultWithHistory(
      result,
      UriResolutionResult.ok(finalRedirectedUri),
      getUriResolutionPath(resolutionContext.getHistory()),
      "restarts URI resolution after URI resolver extension redirect"
    );
    expect([
      sourceUri.uri,
      resolverRedirectUri.uri,
      finalRedirectedUri.uri,
    ]).toEqual(resolutionContext.getResolutionPath().map((x) => x.uri));
  });

  it("can resolve uri with custom resolver", async () => {
    const ensUri = new Uri(`ens/test`);
    const redirectUri = new Uri(`ens/redirect.eth`);

    const client = new PolywrapClient({
      resolvers: [
        {
          tryResolveUri: async (uri: Uri) => {
            if (uri.uri === ensUri.uri) {
              return UriResolutionResult.ok(redirectUri);
            }

            return UriResolutionResult.ok(uri);
          },
        },
      ],
    });

    const result = await client.tryResolveUri({ uri: ensUri });

    expect(result).toEqual(UriResolutionResult.ok(redirectUri));
  });

  it("can resolve uri with custom resolver at invoke-time", async () => {
    const fromUri = new Uri(`ens/from.eth`);
    const redirectUri = new Uri(`ens/to.eth`);

    const client = new PolywrapClient({
      resolvers: [
        {
          tryResolveUri: async (uri: Uri) => {
            if (uri.uri === fromUri.uri) {
              return UriResolutionResult.ok(redirectUri);
            }

            return UriResolutionResult.ok(uri);
          },
        },
      ],
    });

    const result = await client.tryResolveUri({
      uri: fromUri,
    });

    expect(result).toEqual(UriResolutionResult.ok(redirectUri));
  });

  it("custom wrapper resolver does not cause infinite recursion when resolved at runtime", async () => {
    const client = new PolywrapClient({
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri.uri,
          implementations: ["ens/undefined-resolver.eth"],
        },
      ],
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({
      uri: "ens/test.eth",
      resolutionContext,
    });

    await expectResultWithHistory(
      result,
      UriResolutionResult.err(
        "While resolving wrap://ens/test.eth with URI resolver extension wrap://ens/undefined-resolver.eth, the extension could not be fully resolved. Last tried URI is wrap://ens/undefined-resolver.eth"
      ),
      getUriResolutionPath(resolutionContext.getHistory()),
      "custom wrapper resolver does not cause infinite recursion when resolved at runtime"
    );

    expect(["wrap://ens/test.eth"]).toEqual(
      resolutionContext.getResolutionPath().map((x) => x.uri)
    );
  });
});
