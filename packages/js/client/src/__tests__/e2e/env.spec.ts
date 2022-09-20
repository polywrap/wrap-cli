import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import { buildUriResolver } from "@polywrap/uri-resolvers-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { PolywrapClient } from "../../PolywrapClient";

jest.setTimeout(200000);

describe("env", () => {
  const mockEnvPlugin = () => {
    interface Env extends Record<string, unknown> {
      arg1: number;
    }

    class MockEnvPlugin extends PluginModule<{}, Env> {
      mockEnv(): Env {
        return this.env;
      }
    }

    return new PluginPackage({} as WrapManifest, new MockEnvPlugin({}));
  };

  describe("env client types", () => {
    test("plugin env types", async () => {
      const implementationUri = "wrap://ens/some-implementation.eth";
      const envPlugin = mockEnvPlugin();
      const client = new PolywrapClient({
        resolver: buildUriResolver([
          {
            uri: implementationUri,
            package: envPlugin,
          },
        ]),
        envs: [
          {
            uri: implementationUri,
            env: {
              arg1: "10",
            },
          },
        ],
      });

      const mockEnv = await client.invoke({
        uri: implementationUri,
        method: "mockEnv",
      });

      expect(mockEnv.error).toBeFalsy();
      expect(mockEnv.data).toBeTruthy();
      expect(mockEnv.data).toMatchObject({ arg1: "10" });
    });
  });
});
