import { PolywrapClient } from "../..";
import { Uri } from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { PluginPackage, PluginModule } from "@polywrap/plugin-js";
import { UriResolver } from "@polywrap/uri-resolvers-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
jest.setTimeout(200000);

describe("plugin-wrapper", () => {
  const mockMapPlugin = () => {
    interface Config extends Record<string, unknown> {
      map: Map<string, number>;
    }

    class MockMapPlugin extends PluginModule<Config> {
      async getMap(_: unknown) {
        return this.config.map;
      }

      updateMap(args: { map: Map<string, number> }): Map<string, number> {
        for (const key of args.map.keys()) {
          this.config.map.set(
            key,
            (this.config.map.get(key) || 0) + (args.map.get(key) || 0)
          );
        }
        return this.config.map;
      }
    }

    return new PluginPackage(
      new MockMapPlugin({
        map: new Map().set("a", 1).set("b", 2),
      }),
      {} as WrapManifest
    );
  };

  it("plugin map types", async () => {
    const implementationUri = Uri.from("wrap://ens/some-implementation.eth");
    const mockPlugin = mockMapPlugin();
    const client = new PolywrapClient(
      {
        resolver: UriResolver.from([
          {
            uri: implementationUri,
            package: mockPlugin,
          },
        ]),
      },
      { noDefaults: true }
    );

    const getResult = await client.invoke({
      uri: implementationUri,
      method: "getMap",
    });

    if (!getResult.ok) fail(getResult.error);
    expect(getResult.value).toBeTruthy();
    expect(getResult.value).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 2)
    );

    const updateResult = await client.invoke({
      uri: implementationUri,
      method: "updateMap",
      args: {
        map: new Map<string, number>().set("b", 1).set("c", 5),
      },
    });

    if (!updateResult.ok) fail(updateResult.error);
    expect(updateResult.value).toBeTruthy();
    expect(updateResult.value).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 3).set("c", 5)
    );
  });

  test("get manifest should fetch wrap manifest from plugin", async () => {
    const client = new PolywrapClient(
      {
        resolver: UriResolver.from([
          { uri: Uri.from("ens/ipfs.polywrap.eth"), package: ipfsPlugin({}) },
        ]),
      },
      { noDefaults: true }
    );
    const manifest = await client.getManifest("ens/ipfs.polywrap.eth");
    if (!manifest.ok) fail(manifest.error);
    expect(manifest.value.type).toEqual("plugin");
    expect(manifest.value.name).toEqual("Ipfs");
  });
});
