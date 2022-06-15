import {
  buildApi,
} from "@polywrap/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { Client, PluginModule } from "@polywrap/core-js";
import { GetPathToTestApis } from "@polywrap/test-cases";

jest.setTimeout(200000);

describe("env", () => {
  const getClient = async (config?: Partial<Web3ApiClientConfig>) => {
    return createWeb3ApiClient(
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

    const apiPath = `${GetPathToTestApis()}/wasm-as/simple-env-types`
    const apiUri = `fs/${apiPath}/build`

    beforeAll(async () => {
      await buildApi(apiPath);

      client = await getClient({
        envs: [
          {
            uri: apiUri,
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
        uri: apiUri,
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
        uri: apiUri,
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
        uri: apiUri,
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
              uri: apiUri,
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
    
    const apiPath = `${GetPathToTestApis()}/wasm-as/env-types`
    const apiUri = `fs/${apiPath}/build`

    beforeAll(async () => {
      await buildApi(apiPath);

      client = await getClient({
        envs: [
          {
            uri: apiUri,
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
        ],
      });
    });

    test("mockEnv", async () => {
      const moduleEnv = await client.query({
        uri: apiUri,
        query: `
          query {
            moduleEnv(
              arg: "string"
            )
          }
        `,
      });
      expect(moduleEnv.errors).toBeFalsy();
      expect(moduleEnv.data?.moduleEnv).toEqual({
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

    test("module time env types", async () => {
      const moduleEnv = await client.query({
        uri: apiUri,
        query: `
          query {
            moduleEnv(
              arg: "string"
            )
          }
        `,
      });
      expect(moduleEnv.errors).toBeFalsy();
      expect(moduleEnv.data?.moduleEnv).toEqual({
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
        uri: apiUri,
        query: `
          query {
            moduleEnv(
              arg: "string"
            )
          }
        `,
        config: {
          envs: [
            {
              uri: apiUri,
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
      expect(mockUpdatedEnv.data?.moduleEnv).toEqual({
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

  describe("env client types", () => {
    let client: Client;

    const apiPath = `${GetPathToTestApis()}/wasm-as/env-client-types`
    const apiUri = `fs/${apiPath}/build`

    beforeAll(async () => {
      await buildApi(apiPath);

      client = await getClient({
        envs: [
          {
            uri: apiUri,
            env: {
              str: "string",
            },
          },
        ],
      });
    });

    test("module", async () => {
      const mockEnd = await client.query({
        uri: apiUri,
        query: `
          query {
            environment(
              arg: "string"
            )
          }
        `,
      });
      expect(mockEnd.errors).toBeFalsy();
      expect(mockEnd.data?.environment).toEqual({
        str: "string",
        optStr: null,
        defStr: "default string",
      });
    });
  });

  test("set env when not required", async () => {
    const apiPath = `${GetPathToTestApis()}/wasm-as/enum-types`
    const apiUri = `fs/${apiPath}/build`
    
    await buildApi(apiPath);

    const client = await getClient({
      envs: [
        {
          uri: apiUri,
          env: {
            str: "string",
          },
        },
      ],
    });

    const mockEnv = await client.query({
      uri: apiUri,
      query: `
        query {
          method1(en: 0) 
        }
      `,
      config: {
        envs: [
          {
            uri: apiUri,
            env: {
              str: "string",
            },
          },
        ],
      },
    });

    expect(mockEnv.errors).toBeFalsy();
    expect(mockEnv.data?.method1).toEqual(0);
  });

  test("plugin env types", async () => {
    const implementationUri = "w3://ens/some-implementation.eth";
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
});
