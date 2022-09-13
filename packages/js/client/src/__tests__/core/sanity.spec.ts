import { coreInterfaceUris } from "@polywrap/core-js";
import { buildUriResolver } from "@polywrap/uri-resolvers-js";
import { Uri, PolywrapClient } from "../..";
import { defaultWrappers } from "@polywrap/client-config-builder-js";

jest.setTimeout(200000);

describe("sanity", () => {
  test("default client config", () => {
    const client = new PolywrapClient();

    expect(client.getRedirects()).toStrictEqual([
      {
        from: new Uri("wrap://ens/sha3.polywrap.eth"),
        to: new Uri(defaultWrappers.sha3),
      },
      {
        from: new Uri("wrap://ens/uts46.polywrap.eth"),
        to: new Uri(defaultWrappers.uts46),
      },
      {
        from: new Uri("wrap://ens/graph-node.polywrap.eth"),
        to: new Uri(defaultWrappers.graphNode),
      },
    ]);

    const expectedPlugins = [
      new Uri("wrap://ens/ipfs.polywrap.eth"),
      new Uri("wrap://ens/ens-resolver.polywrap.eth"),
      new Uri("wrap://ens/ethereum.polywrap.eth"),
      new Uri("wrap://ens/http.polywrap.eth"),
      new Uri("wrap://ens/js-logger.polywrap.eth"),
      new Uri("wrap://ens/fs.polywrap.eth"),
      new Uri("wrap://ens/fs-resolver.polywrap.eth"),
      new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
    ];
    const actualPlugins = client.getPlugins().map(x => x.uri);
    expect(expectedPlugins).toStrictEqual(actualPlugins);

    expect(client.getInterfaces()).toStrictEqual([
      {
        interface: coreInterfaceUris.uriResolver,
        implementations: [
          new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
          new Uri("wrap://ens/ens-resolver.polywrap.eth"),
          new Uri("wrap://ens/fs-resolver.polywrap.eth"),
        ],
      },
      {
        interface: coreInterfaceUris.logger,
        implementations: [new Uri("wrap://ens/js-logger.polywrap.eth")],
      },
    ]);
  });

  test("client noDefaults flag works as expected", async () => {
    let client = new PolywrapClient();
    expect(client.getPlugins().length !== 0).toBeTruthy();
    expect(client.getUriResolver()).toBeTruthy();

    client = new PolywrapClient({}, {});
    expect(client.getPlugins().length !== 0).toBeTruthy();
    expect(client.getUriResolver()).toBeTruthy();

    client = new PolywrapClient({}, { noDefaults: false });
    expect(client.getPlugins().length !== 0).toBeTruthy();
    expect(client.getUriResolver()).toBeTruthy();

    client = new PolywrapClient(
      { resolver: buildUriResolver([]) },
      { noDefaults: true }
    );

    expect(client.getPlugins().length === 0).toBeTruthy();
    expect(client.getUriResolver()).toBeTruthy();

    let message = "";
    try {
      client = new PolywrapClient({}, { noDefaults: true });
    } catch (e) {
      message = e.message;
    }

    expect(message).toBe("No URI resolver provided");
  });

  test("redirect registration", () => {
    const implementation1Uri = "wrap://ens/some-implementation1.eth";
    const implementation2Uri = "wrap://ens/some-implementation2.eth";

    const client = new PolywrapClient({
      redirects: [
        {
          from: implementation1Uri,
          to: implementation2Uri,
        },
      ],
    });

    const redirects = client.getRedirects();

    expect(redirects).toEqual([
      {
        from: new Uri("wrap://ens/sha3.polywrap.eth"),
        to: new Uri(defaultWrappers.sha3),
      },
      {
        from: new Uri("wrap://ens/uts46.polywrap.eth"),
        to: new Uri(defaultWrappers.uts46),
      },
      {
        from: new Uri("wrap://ens/graph-node.polywrap.eth"),
        to: new Uri(defaultWrappers.graphNode),
      },
      {
        from: new Uri(implementation1Uri),
        to: new Uri(implementation2Uri),
      },
    ]);
  });
});
