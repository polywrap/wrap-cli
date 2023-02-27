import {
  Uri,
  UriResolutionContext,
} from "@polywrap/core-js";
import { expectHistory } from "../helpers/expectHistory";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { RedirectResolver } from "../../redirects";
import { PackageResolver } from "../../packages";
import { PluginPackage } from "@polywrap/plugin-js";

jest.setTimeout(20000);

describe("PackageResolver", () => {
  it("can resolve a package", async () => {
    const uri = new Uri("test/package");

    const client = new PolywrapCoreClient({
      resolver: new PackageResolver(
        Uri.from("test/package"),
        PluginPackage.from(() => ({}))
      )
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "package-resolver",
      "can-resolve-a-package",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "package") {
      fail("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/package");
  });

  it("does not resolver a package when not a match", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      resolver: new PackageResolver(
        Uri.from("test/package"),
        PluginPackage.from(() => ({}))
      )
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "package-resolver",
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
