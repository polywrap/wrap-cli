import {
  coreInterfaceUris,
} from "@polywrap/core-js";
import {
  Uri,
  Web3ApiClient,
} from "../..";

jest.setTimeout(200000);

describe("sanity", () => {

  test("default client config", () => {
    const client = new Web3ApiClient();

    expect(client.getRedirects()).toStrictEqual([]);
    expect(client.getPlugins().map((x) => x.uri)).toStrictEqual([
      new Uri("wrap://ens/ipfs.web3api.eth"),
      new Uri("wrap://ens/ens.web3api.eth"),
      new Uri("wrap://ens/ethereum.web3api.eth"),
      new Uri("wrap://ens/http.web3api.eth"),
      new Uri("wrap://ens/js-logger.web3api.eth"),
      new Uri("wrap://ens/uts46.web3api.eth"),
      new Uri("wrap://ens/sha3.web3api.eth"),
      new Uri("wrap://ens/graph-node.web3api.eth"),
      new Uri("wrap://ens/fs.web3api.eth"),
    ]);
    expect(client.getInterfaces()).toStrictEqual([
      {
        interface: coreInterfaceUris.uriResolver,
        implementations: [
          new Uri("wrap://ens/ipfs.web3api.eth"),
          new Uri("wrap://ens/ens.web3api.eth"),
          new Uri("wrap://ens/fs.web3api.eth"),
        ],
      },
      {
        interface: coreInterfaceUris.logger,
        implementations: [new Uri("wrap://ens/js-logger.web3api.eth")],
      },
    ]);
  });

  test("client noDefaults flag works as expected", async () => {
    let client = new Web3ApiClient();
    expect(client.getPlugins().length !== 0).toBeTruthy();

    client = new Web3ApiClient({}, {});
    expect(client.getPlugins().length !== 0).toBeTruthy();

    client = new Web3ApiClient({}, { noDefaults: false });
    expect(client.getPlugins().length !== 0).toBeTruthy();

    client = new Web3ApiClient({}, { noDefaults: true });
    expect(client.getPlugins().length === 0).toBeTruthy();
  });

  test("redirect registration", () => {
    const implementation1Uri = "wrap://ens/some-implementation1.eth";
    const implementation2Uri = "wrap://ens/some-implementation2.eth";

    const client = new Web3ApiClient({
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
        from: new Uri(implementation1Uri),
        to: new Uri(implementation2Uri),
      },
    ]);
  });

  test("loadWeb3Api - pass string or Uri", async () => {
    const implementationUri = "wrap://ens/some-implementation.eth";
    const schemaStr = "test-schema";

    const client = new Web3ApiClient({
      plugins: [
        {
          uri: implementationUri,
          plugin: {
            factory: () => ({} as Plugin),
            manifest: {
              schema: schemaStr,
              implements: [],
            },
          },
        },
      ],
    });

    const schemaWhenString = await client.getSchema(implementationUri);
    const schemaWhenUri = await client.getSchema(new Uri(implementationUri));

    expect(schemaWhenString).toEqual(schemaStr);
    expect(schemaWhenUri).toEqual(schemaStr);
  });
});
