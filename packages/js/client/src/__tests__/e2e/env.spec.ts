import { createPolywrapClient, PolywrapClientConfig } from "../..";
import { PluginModule } from "@polywrap/core-js";

jest.setTimeout(200000);

const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-env-types`;
const wrapperUri = `fs/${wrapperPath}/build`;

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

    return {
      factory: () => new MockEnvPlugin({}),
      manifest: {
        schema: ``,
        implements: [],
      },
    };
  };

  describe("env client types", () => {
    test("plugin env types", async () => {
      const implementationUri = "wrap://ens/some-implementation.eth";
      const envPlugin = mockEnvPlugin();
      const client = await getClient({
        plugins: [
          {
            uri: implementationUri,
            plugin: envPlugin,
          },
        ],
        envs: [
          {
            uri: implementationUri,
            env: {
              arg1: "10",
            },
          },
        ],
      });

      const mockEnv = await client.query({
        uri: implementationUri,
        query: `
          query {
            mockEnv
          }
        `,
      });

      expect(mockEnv.errors).toBeFalsy();
      expect(mockEnv.data).toBeTruthy();
      expect(mockEnv.data?.mockEnv).toMatchObject({ arg1: "10" });
    });
  })
});
