import { GetPathToTestWrappers } from "@polywrap/test-cases";
import {
  Uri,
  IUriResolutionStep,
  UriPackageOrWrapper,
  UriResolutionContext,
  buildCleanUriHistory,
} from "@polywrap/core-js";
import { UriResolutionResult } from "@polywrap/uri-resolvers-js";
import fs from "fs";
import { Result } from "@polywrap/result";
import { PolywrapClient, ClientConfigBuilder } from "../../../";

jest.setTimeout(200000);

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
    const fromUri = new Uri(`test/from.eth`);
    const redirectUri = new Uri(`test/to.eth`);

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
});
