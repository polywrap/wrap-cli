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
import { PluginPackage } from "@polywrap/plugin-js";
import { UriResolutionResult } from "../../helpers";
import { PackageToWrapperResolver } from "../../packages";

jest.setTimeout(20000);

class SimplePackageResolver implements IUriResolver<Error> {
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
      default:
        throw new Error(`Unexpected URI: ${uri.uri}`);
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      description: "SimplePackageResolver",
    });

    return result;
  }
}

describe("PackageToWrapperResolver", () => {
  it("resolves a package to a wrapper", async () => {
    const uri = new Uri("test/package");

    const client = new PolywrapCoreClient({
      resolver: PackageToWrapperResolver.from(new SimplePackageResolver()),
    });

    let resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "package-to-wrapper-resolver",
      "package-to-wrapper"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "wrapper") {
      fail("Expected a wrapper, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/package");
  });

  it("resolves a wrapper to a wrapper", async () => {
    const uri = new Uri("test/wrapper");

    const client = new PolywrapCoreClient({
      resolver: PackageToWrapperResolver.from(new SimplePackageResolver()),
    });

    let resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "package-to-wrapper-resolver",
      "wrapper-to-wrapper"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "wrapper") {
      fail("Expected a wrapper, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/wrapper");
  });

  it("resolves a URI to a URI", async () => {
    const uri = new Uri("test/from");

    const client = new PolywrapCoreClient({
      resolver: PackageToWrapperResolver.from(new SimplePackageResolver()),
    });

    let resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "package-to-wrapper-resolver",
      "uri-to-uri"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a URI, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/to");
  });
});
