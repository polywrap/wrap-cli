import {
  Uri,
  UriResolutionContext,
} from "@polywrap/core-js";
import { expectHistory } from "../helpers/expectHistory";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { RecursiveResolver, StaticResolver } from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "../../ExtendableUriResolver";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";

jest.setTimeout(20000);

const wrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/as`;
const wrapperUri = new Uri(`wrap://file/${wrapperPath}`);

const fsRedirectResolverWrapperPath = `${GetPathToTestWrappers()}/resolver/02-fs/implementations/rs`;
const fsRedirectResolverWrapperUri = new Uri(
  `wrap://file/${fsRedirectResolverWrapperPath}`
);

export const defaultPackages = {
  ensResolver: "wrap://package/ens-resolver",
  httpResolver: "wrap://package/http-resolver",
  fileSystemResolver: "wrap://package/fs-resolver",
  ipfsResolver: "wrap://package/ipfs-resolver",
};

export const defaultInterfaces = {
  concurrent: "wrap://ens/wraps.eth:concurrent@1.0.0",
  logger: "wrap://ens/wraps.eth:logger@1.0.0",
  http: "wrap://ens/wraps.eth:http@1.1.0",
  fileSystem: "wrap://ens/wraps.eth:file-system@1.0.0",
  ipfsHttpClient: "wrap://ens/wraps.eth:ipfs-http-client@1.0.0",
  ethereumProvider: "wrap://ens/wraps.eth:ethereum-provider@1.0.0",
};

describe("Resolver extensions", () => {
  it("can resolve a resolver extension", async () => {
    const sourceUri = new Uri(`custom-fs/${wrapperPath}`);
    const redirectedUri = wrapperUri;

    const client = new PolywrapCoreClient({
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [
            fsRedirectResolverWrapperUri,
            Uri.from(defaultPackages.fileSystemResolver)
          ]
        }
      ],
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: Uri.from(defaultInterfaces.fileSystem),
            package: fileSystemPlugin({}),
          },
          {
            uri: Uri.from(defaultPackages.fileSystemResolver),
            package: fileSystemResolverPlugin({}),
          },
        ]),
        new ExtendableUriResolver()
      ])
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri: sourceUri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "can-resolve-extension",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "package") {
      fail("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("does not resolve a uri when not a match", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      interfaces: [
        {
          interface: ExtendableUriResolver.extInterfaceUri,
          implementations: [
            fsRedirectResolverWrapperUri,
            Uri.from(defaultPackages.fileSystemResolver)
          ]
        }
      ],
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: Uri.from(defaultInterfaces.fileSystem),
            package: fileSystemPlugin({}),
          },
          {
            uri: Uri.from(defaultPackages.fileSystemResolver),
            package: fileSystemResolverPlugin({}),
          },
        ]),
        new ExtendableUriResolver()
      ])
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
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
