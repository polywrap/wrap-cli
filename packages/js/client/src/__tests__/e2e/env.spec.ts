import {
  buildWrapper,
} from "@polywrap/test-env-js";
import { createPolywrapClient, PolywrapClientConfig } from "../..";
import { Client, PluginModule } from "@polywrap/core-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";

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

  describe("simple env types", () => {
    let client: Client;

    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-env-types`
    const wrapperUri = `fs/${wrapperPath}/build`

    beforeAll(async () => {
      await buildWrapper(wrapperPath);

      client = await getClient({
        envs: [
          {
            uri: wrapperUri,
            env: {
              str: "module string",
              requiredInt: 1,
            },
          },
        ],
      });
    });

    test("module: getEnv - when set", async () => {
      const queryEnv = await client.query({
        uri: wrapperUri,
        query: `
      query {
        getEnv(
          arg: "string",
        )
      }
    `,
      });
      expect(queryEnv.errors).toBeFalsy();
      expect(queryEnv.data?.getEnv).toEqual({
        str: "module string",
        requiredInt: 1,
      });
    });

    test("module: getEnv - when not set", async () => {
      const queryEnv = await client.query({
        uri: wrapperUri,
        query: `
      query {
        getEnv(
          arg: "not set"
        )
      }
    `,
        config: {
          envs: [],
        },
      });
      expect(queryEnv.data?.getEnv).toBeUndefined();
      expect(queryEnv.errors).toBeTruthy();
      expect(queryEnv.errors?.length).toBe(1);
      expect(queryEnv.errors?.[0].message).toContain(
        "Missing required property: 'requiredInt: Int'"
      );
    });

    test("module: getEnv - when set incorrectly", async () => {
      const queryEnv = await client.query({
        uri: wrapperUri,
        query: `
      query {
        getEnv(
          arg: "not set"
        )
      }
    `,
        config: {
          envs: [
            {
              uri: wrapperUri,
              env: {
                str: "string",
                requiredInt: "99",
              },
            },
          ],
        },
      });

      expect(queryEnv.data?.getEnv).toBeUndefined();
      expect(queryEnv.errors).toBeTruthy();
      expect(queryEnv.errors?.length).toBe(1);
      expect(queryEnv.errors?.[0].message).toContain(
        "Property must be of type 'int'. Found 'string'."
      );
    });
  })

  describe("complex env types", () => {
    let client: Client;
    
    const baseWrapperEnvPaths = `${GetPathToTestWrappers()}/wasm-as/env-types`
    const wrapperPath = `${baseWrapperEnvPaths}/main`
    const externalWrapperPath = `${baseWrapperEnvPaths}/external`
    const wrapperUri = `fs/${wrapperPath}/build`
    const externalWrapperUri = `fs/${externalWrapperPath}/build`

    beforeAll(async () => {
      await buildWrapper(externalWrapperPath);
      await buildWrapper(wrapperPath);

      client = await getClient({
        envs: [
          {
            uri: wrapperUri,
            env: {
              object: {
                prop: "object string",
              },
              str: "string",
              optFilledStr: "optional string",
              number: 10,
              bool: true,
              en: "FIRST",
              array: [32, 23],
            },
          },
          {
            uri: externalWrapperUri,
            env: {
              externalArray: [1, 2, 3],
              externalString: "iamexternal"
            },
          },
        ],
        redirects: [
          {
            from: "ens/externalenv.polywrap.eth",
            to: externalWrapperUri
          }
        ]
      });
    });

    test("mockEnv", async () => {
      const methodRequireEnv = await client.query({
        uri: wrapperUri,
        query: `
          query {
            methodRequireEnv(
              arg: "string"
            )
          }
        `,
      });
      expect(methodRequireEnv.errors).toBeFalsy();
      expect(methodRequireEnv.data?.methodRequireEnv).toEqual({
        str: "string",
        optFilledStr: "optional string",
        optStr: null,
        number: 10,
        optNumber: null,
        bool: true,
        optBool: null,
        object: {
          prop: "object string",
        },
        optObject: null,
        en: 0,
        optEnum: null,
        array: [32, 23],
      });
    });

    test("Subinvoke env", async () => {
      const subinvokeEnvMethod = await client.query({
        uri: wrapperUri,
        query: `
          query {
            subinvokeEnvMethod(
              arg: "string"
            )
          }
        `,
      });
      expect(subinvokeEnvMethod.errors).toBeFalsy();
      expect(subinvokeEnvMethod.data?.subinvokeEnvMethod).toEqual({
        local: {
          str: "string",
          optFilledStr: "optional string",
          optStr: null,
          number: 10,
          optNumber: null,
          bool: true,
          optBool: null,
          object: {
            prop: "object string",
          },
          optObject: null,
          en: 0,
          optEnum: null,
          array: [32, 23],
        },
        external: {
          externalArray: [1, 2, 3],
          externalString: "iamexternal"
        }
      });
    });

    test("module time env types", async () => {
      const methodRequireEnv = await client.query({
        uri: wrapperUri,
        query: `
          query {
            methodRequireEnv(
              arg: "string"
            )
          }
        `,
      });
      expect(methodRequireEnv.errors).toBeFalsy();
      expect(methodRequireEnv.data?.methodRequireEnv).toEqual({
        str: "string",
        optFilledStr: "optional string",
        optStr: null,
        number: 10,
        optNumber: null,
        bool: true,
        optBool: null,
        object: {
          prop: "object string",
        },
        optObject: null,
        en: 0,
        optEnum: null,
        array: [32, 23],
      });

      const mockUpdatedEnv = await client.query({
        uri: wrapperUri,
        query: `
          query {
            methodRequireEnv(
              arg: "string"
            )
          }
        `,
        config: {
          envs: [
            {
              uri: wrapperUri,
              env: {
                object: {
                  prop: "object another string",
                },
                str: "another string",
                optFilledStr: "optional string",
                number: 10,
                bool: true,
                en: "FIRST",
                array: [32, 23],
              },
            },
          ],
        },
      });
      expect(mockUpdatedEnv.errors).toBeFalsy();
      expect(mockUpdatedEnv.data?.methodRequireEnv).toEqual({
        str: "another string",
        optFilledStr: "optional string",
        optStr: null,
        number: 10,
        optNumber: null,
        bool: true,
        optBool: null,
        object: {
          prop: "object another string",
        },
        optObject: null,
        en: 0,
        optEnum: null,
        array: [32, 23],
      });
    });
  });

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
