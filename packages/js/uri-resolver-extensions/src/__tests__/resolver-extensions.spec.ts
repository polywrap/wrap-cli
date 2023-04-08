import { ExtendableUriResolver } from "../ExtendableUriResolver";
import { expectHistory } from "./helpers/expectHistory";

import { Uri, UriMap, UriResolutionContext, IWrapPackage } from "@polywrap/core-js";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { PluginPackage } from "@polywrap/plugin-js";
import { WasmPackage } from "@polywrap/wasm-js";
import { RecursiveResolver, StaticResolver } from "@polywrap/uri-resolvers-js";
import { Commands } from "@polywrap/cli-js";
import path from "path";
import fs from "fs";

jest.setTimeout(20000);

const customPluginResolverUri = Uri.from("wrap://package/test-resolver");
const customPluginResolver = PluginPackage.from(() => ({
  tryResolveUri: async (
    args: any,
    client: PolywrapCoreClient
  ): Promise<{
    uri?: string | null;
    manifest?: Uint8Array | null;
  } | null> => {
    if (args.authority !== "test") {
      return null;
    }

    switch (args.path) {
      case "from":
        return {
          uri: Uri.from("test/to").uri,
        };
      case "package":
        return {
          manifest: new Uint8Array([]),
        };
      case "error":
        throw new Error("Test error");
      default:
        return null;
    }
  },
}));

describe("Resolver extensions", () => {

  let testResolverPackage: IWrapPackage;

  beforeAll(async () => {
    const wrapDir = path.join(__dirname, "/wrappers/test-resolver");

    // Build the test-resolver wrapper
    const res = await Commands.build({}, {
      cwd: wrapDir
    });

    if (res.exitCode !== 0) {
      fail(`STDOUT: ${res.stdout}\nSTDERR: ${res.stderr}`);
    }

    const wrapBuildDir = path.join(wrapDir, "build");

    // Load the wrapper from disk
    testResolverPackage = WasmPackage.from(
      fs.readFileSync(path.join(wrapBuildDir, "wrap.info")),
      fs.readFileSync(path.join(wrapBuildDir, "wrap.wasm"))
    );
  });

  it("can resolve URI with plugin extension", async () => {
    const sourceUri = Uri.from(`test/from`);
    const redirectedUri = Uri.from("test/to");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: customPluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "can-resolve-uri"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a URI, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("can resolve a package with plugin extension", async () => {
    const sourceUri = Uri.from(`test/package`);
    const redirectedUri = Uri.from("test/package");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: customPluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "can-resolve-package"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "package") {
      fail("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("shows the plugin resolver extension error", async () => {
    const sourceUri = Uri.from(`test/error`);

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: customPluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "shows-plugin-extension-error"
    );

    if (result.ok) {
      fail("Expected an error, received: " + result.value.type);
    }

    expect((result.error as Error)?.message).toEqual(
      `Test error
code: 51 WRAPPER INVOKE ABORTED
uri: wrap://package/test-resolver
method: tryResolveUri
args: {
  "authority": "test",
  "path": "error"
} `
    );
  });

  it("does not resolve a URI when not a match with plugin extension", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: customPluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "not-a-match"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/not-a-match");
  });

  it("can resolve URI with wasm extension", async () => {
    const sourceUri = Uri.from(`test/from`);
    const redirectedUri = Uri.from("test/to");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "can-resolve-uri"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a URI, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("can resolve a package with wasm extension", async () => {
    const sourceUri = Uri.from(`test/package`);
    const redirectedUri = Uri.from("test/package");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "can-resolve-package"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "package") {
      fail("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("shows the wasm resolver extension error", async () => {
    const sourceUri = Uri.from(`test/error`);

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "shows-wasm-extension-error"
    );

    if (result.ok) {
      fail("Expected an error, received: " + result.value.type);
    }

    expect((result.error as Error)?.message).toEqual(
      `__wrap_abort: Test error
code: 51 WRAPPER INVOKE ABORTED
uri: wrap://package/test-resolver
method: tryResolveUri
args: {
  "authority": "test",
  "path": "error"
} 
source: { file: "src/lib.rs", row: 23, col: 20 }`
    );
  });

  it("does not resolve a URI when not a match with wasm extension", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "not-a-match"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/not-a-match");
  });

  it("does not cause infinite recursion when resolved at runtime when an extension is not found", async () => {
    const undefinedResolverUri = Uri.from("test/undefined-resolver");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [undefinedResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([new ExtendableUriResolver()]),
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({
      uri: Uri.from("test/not-a-match"),
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "not-found-extension"
    );

    if (result.ok) {
      fail("Resoulution should have failed");
    }

    expect(result.error).toEqual(
      "While resolving wrap://test/not-a-match with URI resolver extension wrap://test/undefined-resolver, the extension could not be fully resolved. Last tried URI is wrap://test/undefined-resolver"
    );
  });
});
