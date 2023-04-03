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
import { RecursiveResolver, UriResolutionResult } from "../../helpers";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { PluginPackage } from "@polywrap/plugin-js";
import { ResolutionResultCacheResolver } from "../../cache/ResolutionResultCacheResolver";
import { ResolutionResultCache } from "../../cache/ResolutionResultCache";

jest.setTimeout(20000);

class TestResolver implements IUriResolver<Error> {
  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, Error>> {
    let result: Result<UriPackageOrWrapper, Error>;

    switch (uri.uri) {
      case "wrap://test/package":
        result = UriResolutionResult.ok(
          Uri.from("test/package"),
          PluginPackage.from(() => ({}))
        );
        break;
      case "wrap://test/wrapper":
        let wrapperResult = await PluginPackage.from(
          () => ({})
        ).createWrapper();
        if (!wrapperResult.ok) {
          throw wrapperResult.error;
        }

        result = UriResolutionResult.ok(
          Uri.from("test/wrapper"),
          wrapperResult.value
        );
        break;
      case "wrap://test/from":
        result = UriResolutionResult.ok(Uri.from("test/to"));
        break;
      case "wrap://test/A":
        result = UriResolutionResult.ok(Uri.from("test/B"));
        break;
      case "wrap://test/B":
        result = UriResolutionResult.ok(Uri.from("test/wrapper"));
        break;
      default:
        throw new Error(`Unexpected URI: ${uri.uri}`);
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      description: "TestResolver",
    });

    return result;
  }
}

describe("ResolutionResultCacheResolver", () => {
  it("caches a resolved wrapper", async () => {
    const uri = new Uri("test/wrapper");

    const client = new PolywrapCoreClient({
      resolver: ResolutionResultCacheResolver.from(
        new TestResolver(),
        new ResolutionResultCache()
      ),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolution-result-cache-resolver",
      "wrapper-without-cache"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "wrapper") {
      fail("Expected a wrapper, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/wrapper");

    resolutionContext = new UriResolutionContext();
    result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolution-result-cache-resolver",
      "wrapper-with-cache"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "wrapper") {
      fail("Expected a wrapper, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/wrapper");
  });

  it("caches a resolved URI", async () => {
    const uri = new Uri("test/from");

    const client = new PolywrapCoreClient({
      resolver: ResolutionResultCacheResolver.from(
        new TestResolver(),
        new ResolutionResultCache()
      ),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolution-result-cache-resolver",
      "uri-without-cache"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/to");

    resolutionContext = new UriResolutionContext();
    result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolution-result-cache-resolver",
      "uri-with-cache"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/to");
  });

  it("caches a resolved package", async () => {
    const uri = new Uri("test/package");

    const client = new PolywrapCoreClient({
      resolver: ResolutionResultCacheResolver.from(
        new TestResolver(),
        new ResolutionResultCache()
      ),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolution-result-cache-resolver",
      "package-without-cache"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "package") {
      fail("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/package");

    resolutionContext = new UriResolutionContext();
    result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolution-result-cache-resolver",
      "package-with-cache"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "package") {
      fail("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/package");
  });

  it("keeps the same resolution path after caching", async () => {
    const uri = new Uri("test/A");

    const client = new PolywrapCoreClient({
      resolver: RecursiveResolver.from([
        ResolutionResultCacheResolver.from(
          [
            {
              from: Uri.from("test/A"),
              to: Uri.from("test/B"),
            },
            {
              from: Uri.from("test/B"),
              to: Uri.from("test/wrapper"),
            },
            new TestResolver(),
          ],
          new ResolutionResultCache()
        ),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    await client.tryResolveUri({ uri, resolutionContext });

    expect(resolutionContext.getResolutionPath().map((x) => x.uri)).toEqual([
      "wrap://test/A",
      "wrap://test/B",
      "wrap://test/wrapper",
    ]);

    resolutionContext = new UriResolutionContext();
    await client.tryResolveUri({ uri, resolutionContext });

    expect(resolutionContext.getResolutionPath().map((x) => x.uri)).toEqual([
      "wrap://test/A",
      "wrap://test/B",
      "wrap://test/wrapper",
    ]);
  });
});
