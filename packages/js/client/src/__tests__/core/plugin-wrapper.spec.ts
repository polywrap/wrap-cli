import { PolywrapClient } from "../..";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { PluginPackage, PluginModule } from "@polywrap/plugin-js";
import { buildUriResolver } from "@polywrap/uri-resolvers-js";

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
      {} as WrapManifest,
      new MockMapPlugin({
        map: new Map().set("a", 1).set("b", 2)
      })
    );
  };

  it("plugin map types", async () => {
    const implementationUri = "wrap://ens/some-implementation.eth";
    const mockPlugin = mockMapPlugin();
    const client = new PolywrapClient({
      resolver: buildUriResolver([
        { 
          uri: implementationUri, 
          package: mockPlugin 
        },
      ]),
    });

    const getResult = await client.invoke({
      uri: implementationUri,
      method: "getMap",
    });

    expect(getResult.error).toBeFalsy();
    expect(getResult.data).toBeTruthy();
    expect(getResult.data).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 2)
    );

    const updateResult = await client.invoke({
      uri: implementationUri,
      method: "updateMap",
      args: {
        map: new Map<string, number>().set("b", 1).set("c", 5),
      },
    });

    expect(updateResult.error).toBeFalsy();
    expect(updateResult.data).toBeTruthy();
    expect(updateResult.data).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 3).set("c", 5)
    );
  });

  test("get manifest should fetch wrap manifest from plugin", async () => {
    const client = new PolywrapClient()
    const manifest = await client.getManifest("ens/ipfs.polywrap.eth")
    expect(manifest.type).toEqual("plugin")
    expect(manifest.name).toEqual("Ipfs")
  })
});
