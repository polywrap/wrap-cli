import { Uri } from "@polywrap/core-js";
import { PluginModule, PluginPackage } from "@polywrap/plugin-js";
import { RecursiveResolver } from "@polywrap/uri-resolvers-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { PolywrapClient } from "../../PolywrapClient";

jest.setTimeout(200000);

interface MockEnv extends Record<string, unknown> {
  arg1: number;
}

describe("env", () => {
  const mockEnvPlugin = () => {
    class MockEnvPlugin extends PluginModule<{}, MockEnv> {
      mockEnv(): MockEnv {
        return this.env;
      }
    }

    return new PluginPackage(new MockEnvPlugin({}), {} as WrapManifest);
  };

  describe("env client types", () => {
    test("plugin env types", async () => {
      const implementationUri = Uri.from("wrap://ens/some-implementation.eth");
      const envPlugin = mockEnvPlugin();
      const client = new PolywrapClient(
        {
          resolver: RecursiveResolver.from([
            {
              uri: implementationUri,
              package: envPlugin,
            },
            { from: Uri.from("ens/hello.eth"), to: implementationUri },
          ]),
          envs: [
            {
              uri: Uri.from("ens/hello.eth"),
              env: {
                arg1: "10",
              },
            },
          ],
        },
        { noDefaults: true }
      );

      const mockEnv = await client.invoke({
        uri: Uri.from("ens/hello.eth"),
        method: "mockEnv",
      });

      if (!mockEnv.ok) fail(mockEnv.error);
      expect(mockEnv.value).toBeTruthy();
      expect(mockEnv.value).toMatchObject({ arg1: "10" });
    });

    test("inline plugin env types", async () => {
      const implementationUri = Uri.from("wrap://ens/some-implementation.eth");
      const client = new PolywrapClient(
        {
          resolver: RecursiveResolver.from([
            {
              uri: implementationUri,
              package: PluginPackage.from<MockEnv>((module) => ({
                mockEnv: (): MockEnv => {
                  return module.env;
                },
              })),
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
        },
        { noDefaults: true }
      );

      const mockEnv = await client.invoke({
        uri: implementationUri,
        method: "mockEnv",
      });

      if (!mockEnv.ok) fail(mockEnv.error);
      expect(mockEnv.value).toBeTruthy();
      expect(mockEnv.value).toMatchObject({ arg1: "10" });
    });
  });
});
