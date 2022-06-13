import {
  buildApi,
} from "@web3api/test-env-js";
import { createWeb3ApiClient, Web3ApiClientConfig } from "../..";
import { Client, Plugin, PluginModule, PluginModules } from "@web3api/core-js";
import { GetPathToTestApis } from "@web3api/test-cases";

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

    class Query extends PluginModule<{}, Env, ClientEnv> {
      sanitizeEnv(env: ClientEnv): Env {
        return { arg1: parseInt(env.arg1) };
      }

      queryEnv(): Env {
        return this.env;
      }
    }

    class Mutation extends PluginModule<{}, ClientEnv, Env> {
      sanitizeEnv(env: Env): ClientEnv {
        return { arg1: env.arg1.toString() };
      }

      mutationEnv(): ClientEnv {
        return this.env;
      }
    }

    class MockEnvPlugin implements Plugin {
      getModules(): PluginModules {
        return {
          query: new Query({}),
          mutation: new Mutation({}),
        };
      }
    }

    return {
      factory: () => new MockEnvPlugin(),
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

    test("query: getEnv - when set", async () => {
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
        str: "query string",
        requiredInt: 1,
      });
    });

    test("query: getEnv - when not set", async () => {
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

    test("query: getEnv - when set incorrectly", async () => {
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

    test("mutation: getEnv - when set", async () => {
      const mutationEnv = await client.query({
        uri: apiUri,
        query: `
      mutation {
        getEnv(
          arg: "string",
        )
      }
    `,
      });
      expect(mutationEnv.errors).toBeFalsy();
      expect(mutationEnv.data?.getEnv).toEqual({
        str: "mutation string",
        requiredInt: 0,
      });
    });

    test("mutation: getEnv - when not set", async () => {
      const mutationEnv = await client.query({
        uri: apiUri,
        query: `
      mutation {
        getEnv(
          arg: "not set"
        )
      }
    `,
        config: {
          envs: [],
        },
      });
      expect(mutationEnv.data?.getEnv).toBeUndefined();
      expect(mutationEnv.errors).toBeTruthy();
      expect(mutationEnv.errors?.length).toBe(1);
      expect(mutationEnv.errors?.[0].message).toContain(
        "Missing required property: 'requiredInt: Int'"
      );
    });

    test("mutation: getEnv - when set incorrectly", async () => {
      const mutationEnv = await client.query({
        uri: apiUri,
        query: `
      mutation {
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
                str: 1,
                requiredInt: 9,
              },
            },
          ],
        },
      });

      expect(mutationEnv.data?.getEnv).toBeUndefined();
      expect(mutationEnv.errors).toBeTruthy();
      expect(mutationEnv.errors?.length).toBe(1);
      expect(mutationEnv.errors?.[0].message).toContain(
        "Property must be of type 'string'. Found 'int'."
      );
    });
  });

  describe("complex env types", () => {
    let client: Client;
    
    const apiPath = `${GetPathToTestApis()}/wasm-as/complex-env-types`
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

    test("queryEnv", async () => {
      const queryEnv = await client.query({
        uri: apiUri,
        query: `
          query {
            queryEnv(
              arg: "string"
            )
          }
        `,
      });
      expect(queryEnv.errors).toBeFalsy();
      expect(queryEnv.data?.queryEnv).toEqual({
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
        queryStr: "query string",
        array: [32, 23],
      });
    });

    test("mutationEnv", async () => {
      const mutationEnv = await client.query({
        uri: apiUri,
        query: `
          mutation {
            mutationEnv(
              arg: "string"
            )
          }
        `,
      });
      expect(mutationEnv.errors).toBeFalsy();
      expect(mutationEnv.data?.mutationEnv).toEqual({
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
        en: 0,
        optEnum: null,
        optObject: null,
        mutStr: "mutation string",
        array: [32, 23],
      });
    });

    test("query time env types", async () => {
      const queryEnv = await client.query({
        uri: apiUri,
        query: `
          query {
            queryEnv(
              arg: "string"
            )
          }
        `,
      });
      expect(queryEnv.errors).toBeFalsy();
      expect(queryEnv.data?.queryEnv).toEqual({
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
        queryStr: "query string",
        array: [32, 23],
      });

      const queryUpdatedEnv = await client.query({
        uri: apiUri,
        query: `
          query {
            queryEnv(
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
      expect(queryUpdatedEnv.errors).toBeFalsy();
      expect(queryUpdatedEnv.data?.queryEnv).toEqual({
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
        queryStr: "query string",
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

    test("query", async () => {
      const queryEnv = await client.query({
        uri: apiUri,
        query: `
          query {
            environment(
              arg: "string"
            )
          }
        `,
      });
      expect(queryEnv.errors).toBeFalsy();
      expect(queryEnv.data?.environment).toEqual({
        str: "string",
        optStr: null,
        defStr: "default string",
      });
    });

    test("mutation", async () => {
      const mutationEnv = await client.query({
        uri: apiUri,
        query: `
        mutation {
          mutEnvironment(
            arg: "string"
          )
        }
      `,
      });
      expect(mutationEnv.errors).toBeFalsy();
      expect(mutationEnv.data?.mutEnvironment).toEqual({
        str: "string",
        optStr: null,
        defMutStr: "default mutation string",
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

    const queryEnv = await client.query({
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

    expect(queryEnv.errors).toBeFalsy();
    expect(queryEnv.data?.method1).toEqual(0);
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

    const queryEnv = await client.query({
      uri: implementationUri,
      query: `
        query {
          queryEnv
        }
        mutation {
          mutationEnv
        }
      `,
    });

    expect(queryEnv.errors).toBeFalsy();
    expect(queryEnv.data).toBeTruthy();
    expect(queryEnv.data?.queryEnv).toMatchObject({ arg1: 10 });
    expect(queryEnv.data?.mutationEnv).toMatchObject({ arg1: "11" });
  });
});
