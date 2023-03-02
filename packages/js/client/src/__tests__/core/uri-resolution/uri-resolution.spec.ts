import { GetPathToTestWrappers } from "@polywrap/test-cases";
import {
  Uri,
  IUriResolutionStep,
  UriPackageOrWrapper,
  UriResolutionContext,
  buildCleanUriHistory,
} from "@polywrap/core-js";
import {
  getUriResolutionPath,
  UriResolutionResult,
} from "@polywrap/uri-resolvers-js";
import fs from "fs";
import { Result } from "@polywrap/result";
import {
  PolywrapClient,
  ExtendableUriResolver,
  ClientConfigBuilder,
} from "../../../";

jest.setTimeout(200000);
const wrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/as`;
const wrapperUri = new Uri(`wrap://file/${wrapperPath}`);

const simpleRedirectResolverWrapperPath = `${GetPathToTestWrappers()}/resolver/01-redirect/implementations/as`;
const simpleRedirectResolverWrapperUri = new Uri(
  `wrap://file/${simpleRedirectResolverWrapperPath}`
);

const fsRedirectResolverWrapperPath = `${GetPathToTestWrappers()}/resolver/02-fs/implementations/rs`;
const fsRedirectResolverWrapperUri = new Uri(
  `wrap://file/${fsRedirectResolverWrapperPath}`
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
    `${GetPathToTestWrappers()}`,
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

  it("can resolve uri with custom resolver", async () => {
    const ensUri = new Uri(`ens/test`);
    const redirectUri = new Uri(`ens/redirect.eth`);

    const config = new ClientConfigBuilder()
      .addDefaults()
      .addResolver({
        tryResolveUri: async (uri: Uri) => {
          if (uri.uri === ensUri.uri) {
            return UriResolutionResult.ok(redirectUri);
          }

          return UriResolutionResult.ok(uri);
        },
      })
      .build();

    const client = new PolywrapClient(config);

    const result = await client.tryResolveUri({ uri: ensUri });

    expect(result).toEqual(UriResolutionResult.ok(redirectUri));
  });

  it("can resolve uri with custom resolver at invoke-time", async () => {
    const fromUri = new Uri(`ens/from.eth`);
    const redirectUri = new Uri(`ens/to.eth`);

    const config = new ClientConfigBuilder()
      .addDefaults()
      .addResolver({
        tryResolveUri: async (uri: Uri) => {
          if (uri.uri === fromUri.uri) {
            return UriResolutionResult.ok(redirectUri);
          }

          return UriResolutionResult.ok(uri);
        },
      })
      .build();

    const client = new PolywrapClient(config);

    const result = await client.tryResolveUri({
      uri: fromUri,
    });

    expect(result).toEqual(UriResolutionResult.ok(redirectUri));
  });

  it("custom wrapper resolver does not cause infinite recursion when resolved at runtime", async () => {
    const config = new ClientConfigBuilder()
      .addDefaults()
      .addInterfaceImplementation(
        ExtendableUriResolver.extInterfaceUri.uri,
        "ens/undefined-resolver.eth"
      )
      .build();

    const client = new PolywrapClient(config);

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
