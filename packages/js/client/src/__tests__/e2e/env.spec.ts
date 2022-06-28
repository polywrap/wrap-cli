import { buildWrapper } from "@polywrap/test-env-js";
import { Client, PluginModule } from "@polywrap/core-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { getClient } from "../utils/getClient";

jest.setTimeout(200000);

const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-env-types`;
const wrapperUri = `fs/${wrapperPath}/build`;

describe("env", () => {
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
      const queryEnv = await client.invoke({
        uri: wrapperUri,
        method: "getEnv",
        args: {
          arg: "string",
        },
      });
      expect(queryEnv.error).toBeFalsy();
      expect(queryEnv.data).toEqual({
        str: "module string",
        requiredInt: 1,
      });
    });

    test("module: getEnv - when not set", async () => {
      const queryEnv = await client.invoke({
        uri: wrapperUri,
        method: "getEnv",
        args: {
          arg: "not set",
        },
        config: {
          envs: [],
        },
      });
      expect(queryEnv.data).toBeUndefined();
      expect(queryEnv.error).toBeTruthy();
      expect(queryEnv.error?.message).toContain(
        "Missing required property: 'requiredInt: Int'"
      );
    });

    test("module: getEnv - when set incorrectly", async () => {
      const queryEnv = await client.invoke({
        uri: wrapperUri,
        method: "getEnv",
        args: {
          arg: "not set",
        },
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

      expect(queryEnv.data).toBeUndefined();
      expect(queryEnv.error).toBeTruthy();
      expect(queryEnv.error?.message).toContain(
        "Property must be of type 'int'. Found 'string'."
      );
    });
  });

  describe("complex env types", () => {
    let client: Client;

    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/env-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    beforeAll(async () => {
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
        ],
      });
    });

    test("mockEnv", async () => {
      const moduleEnv = await client.invoke({
        uri: wrapperUri,
        method: "moduleEnv",
        args: {
          arg: "string",
        },
      });
      expect(moduleEnv.error).toBeFalsy();
      expect(moduleEnv.data).toEqual({
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
      const moduleEnv = await client.invoke({
        uri: wrapperUri,
        method: "moduleEnv",
        args: {
          arg: "string",
        },
      });
      expect(moduleEnv.error).toBeFalsy();
      expect(moduleEnv.data).toEqual({
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

      const mockUpdatedEnv = await client.invoke({
        uri: wrapperUri,
        method: "moduleEnv",
        args: {
          arg: "string",
        },
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
      expect(mockUpdatedEnv.error).toBeFalsy();
      expect(mockUpdatedEnv.data).toEqual({
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

    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/env-client-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    beforeAll(async () => {
      await buildWrapper(wrapperPath);

      client = await getClient({
        envs: [
          {
            uri: wrapperUri,
            env: {
              str: "string",
            },
          },
        ],
      });
    });

    test("module", async () => {
      const mockEnd = await client.invoke({
        uri: wrapperUri,
        method: "environment",
        args: {
          arg: "string",
        },
      });
      expect(mockEnd.error).toBeFalsy();
      expect(mockEnd.data).toEqual({
        str: "string",
        optStr: null,
        defStr: "default string",
      });
    });
  });

  test("set env when not required", async () => {
    const wrapperPath = `${GetPathToTestWrappers()}/wasm-as/enum-types`;
    const wrapperUri = `fs/${wrapperPath}/build`;

    await buildWrapper(wrapperPath);

    const client = await getClient({
      envs: [
        {
          uri: wrapperUri,
          env: {
            str: "string",
          },
        },
      ],
    });

    const mockEnv = await client.invoke({
      uri: wrapperUri,
      method: "method1",
      args: {
        en: 0,
      },
      config: {
        envs: [
          {
            uri: wrapperUri,
            env: {
              str: "string",
            },
          },
        ],
      },
    });

    expect(mockEnv.error).toBeFalsy();
    expect(mockEnv.data).toEqual(0);
  });

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

    const mockEnv = await client.invoke({
      uri: implementationUri,
      method: "mockEnv"
    });

    expect(mockEnv.error).toBeFalsy();
    expect(mockEnv.data).toBeTruthy();
    expect(mockEnv.data).toMatchObject({ arg1: "10" });
  });
});
