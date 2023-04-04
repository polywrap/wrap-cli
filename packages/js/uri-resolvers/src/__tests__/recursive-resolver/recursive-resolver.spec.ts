import {
  CoreClient,
  IUriResolutionContext,
  IUriResolver,
  Result,
  Uri,
  UriPackageOrWrapper,
  UriResolutionContext,
} from "@polywrap/core-js";
import { expectHistory } from "../helpers/expectHistory";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { RecursiveResolver, UriResolutionResult } from "../../helpers";

jest.setTimeout(20000);

class SimpleRedirectResolver implements IUriResolver<Error> {
  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, Error>> {
    let result: Result<UriPackageOrWrapper, Error>;

    switch (uri.uri) {
      case "wrap://test/1":
        result = UriResolutionResult.ok(
          Uri.from("test/2"),
        );
        break;
      case "wrap://test/2":
        result = UriResolutionResult.ok(
          Uri.from("test/3"),
        );
        break;
      case "wrap://test/3":
        result = UriResolutionResult.ok(
          Uri.from("test/4"),
        );
        break;
      default:
        result = UriResolutionResult.ok(uri);
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      description: "SimpleRedirectResolver",
    });

    return result;
  }
}

describe("RecursiveResolver", () => {
  it("can recursively resolve a URI", async () => {
    const uri = new Uri("test/1");

    const client = new PolywrapCoreClient({
      resolver: RecursiveResolver.from(
        new SimpleRedirectResolver()
      )
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "recursive-resolver",
      "can-recursively-resolve-uri",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a URI, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/4");
  });

  it("does not resolve a uri when not a match", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      resolver: RecursiveResolver.from(
        new SimpleRedirectResolver()
      )
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "recursive-resolver",
      "not-a-match",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/not-a-match");
  });
});
