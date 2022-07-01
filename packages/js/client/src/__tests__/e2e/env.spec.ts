import { createPolywrapClient, PolywrapClientConfig } from "../..";
import { PluginModule } from "@polywrap/core-js";

jest.setTimeout(200000);

describe("env", () => {
  const getClient = async (config?: Partial<PolywrapClientConfig>) => {
    return createPolywrapClient(
      {},
      config
    );
  };

  const mockEnvPlugin = () => {
    interface Env extends Record<string, unknown> {
      arg1: number;
    }

    interface ClientEnv extends Record<string, unknown> {
      arg1: string;
    }

    class MockEnvPlugin extends PluginModule<{}, ClientEnv, Env> {
      sanitizeEnv(env: Env): ClientEnv {
        return { arg1: env.arg1.toString() };
      }

      mockEnv(): ClientEnv {
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

  describe.skip("env client types", () => {
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
