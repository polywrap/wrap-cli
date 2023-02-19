import { PluginPackage } from "@polywrap/plugin-js";
import { RecursiveResolver } from "@polywrap/uri-resolvers-js";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { PolywrapClient } from "../../../PolywrapClient";
import { mockPluginRegistration } from "../../helpers";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { Uri } from "@polywrap/core-js";

jest.setTimeout(200000);

export const envTestCases = (implementation: string) => {
  describe("env", () => {
    test(implementation, async () => {
      const externalWrapperPath = `${GetPathToTestWrappers()}/env-type/00-external/implementations/${implementation}`;
      const { uri: externalWrapperUri } = Uri.from(`file/${externalWrapperPath}`);

      const wrapperPath = `${GetPathToTestWrappers()}/env-type/01-main/implementations/${implementation}`;
      const { uri: wrapperUri } = Uri.from(`file/${wrapperPath}`);

      const envs = {
        [wrapperUri]: {
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
        [externalWrapperUri]: {
          externalArray: [1, 2, 3],
          externalString: "iamexternal",
        },
      };

      const builder = new ClientConfigBuilder();
      builder
        .addDefaults()
        .addEnvs(envs)
        .addRedirect("ens/external-env.polywrap.eth", externalWrapperUri);
      const client = new PolywrapClient(builder.build());
      const methodRequireEnvResult = await client.invoke({
        uri: wrapperUri,
        method: "methodRequireEnv",
        args: {
          arg: "string",
        },
      });
      if (!methodRequireEnvResult.ok) fail(methodRequireEnvResult.error);
      expect(methodRequireEnvResult.value).toEqual({
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

      const subinvokeEnvMethodResult = await client.invoke({
        uri: wrapperUri,
        method: "subinvokeEnvMethod",
        args: {
          arg: "string",
        },
      });
      if (!subinvokeEnvMethodResult.ok) fail(subinvokeEnvMethodResult.error);
      expect(subinvokeEnvMethodResult.value).toEqual({
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
          externalString: "iamexternal",
        },
      });

      const methodRequireEnvModuleTimeResult = await client.invoke({
        uri: wrapperUri,
        method: "methodRequireEnv",
        args: {
          arg: "string",
        },
      });
      if (!methodRequireEnvModuleTimeResult.ok)
        fail(methodRequireEnvModuleTimeResult.error);
      expect(methodRequireEnvModuleTimeResult.value).toEqual({
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

      const mockUpdatedEnvResult = await client.invoke({
        uri: wrapperUri,
        method: "methodRequireEnv",
        args: {
          arg: "string",
        },
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
      });
      if (!mockUpdatedEnvResult.ok) fail(mockUpdatedEnvResult.error);
      expect(mockUpdatedEnvResult.value).toEqual({
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
    test("plugin env types", async () => {
      const implementationUri = "wrap://ens/some-implementation.eth";
      const envPackage = mockPluginRegistration(implementationUri).package;
      const client = new PolywrapClient(
        {
          resolver: RecursiveResolver.from({
            uri: Uri.from(implementationUri),
            package: envPackage,
          }),
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

    test("inline plugin env types", async () => {
      const implementationUri = "wrap://ens/some-implementation.eth";
      type MockPackage = { a: number } & Record<string, unknown>;
      const client = new PolywrapClient(
        {
          resolver: RecursiveResolver.from([
            {
              uri: Uri.from(implementationUri),
              package: PluginPackage.from<MockPackage>((module) => ({
                mockEnv: (): MockPackage => {
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
};
