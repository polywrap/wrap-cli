import fs from "fs";
import path from "path";
import { Uri } from "@polywrap/core-js";

import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { PolywrapClient } from "../..";
import { WrapError, WrapErrorCode } from "@polywrap/core-js";
import { incompatiblePlugin, mockPluginRegistration } from "../helpers";
import { msgpackDecode, msgpackEncode } from "@polywrap/msgpack-js";
import {
  ClientConfigBuilder,
  DefaultBundle,
} from "@polywrap/client-config-builder-js";

jest.setTimeout(660000);

const asSubinvokeWrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/as`;
const asSubinvokeWrapperUri = new Uri(`fs/${asSubinvokeWrapperPath}`);

const asInvokeWrapperPath = `${GetPathToTestWrappers()}/subinvoke/01-invoke/implementations/as`;
const asInvokeWrapperUri = new Uri(`fs/${asInvokeWrapperPath}`);

const asConsumerWrapperPath = `${GetPathToTestWrappers()}/subinvoke/02-consumer/implementations/as`;
const asConsumerWrapperUri = new Uri(`fs/${asConsumerWrapperPath}`);

const rsSubinvokeWrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/rs`;
const rsSubinvokeWrapperUri = new Uri(`fs/${rsSubinvokeWrapperPath}`);

const rsInvokeWrapperPath = `${GetPathToTestWrappers()}/subinvoke/01-invoke/implementations/rs`;
const rsInvokeWrapperUri = new Uri(`fs/${rsInvokeWrapperPath}`);

const rsConsumerWrapperPath = `${GetPathToTestWrappers()}/subinvoke/02-consumer/implementations/rs`;
const rsConsumerWrapperUri = new Uri(`fs/${rsConsumerWrapperPath}`);

describe("Error structure", () => {
  describe("URI resolution", () => {
    let client = new PolywrapClient();
    test("Invoke a wrapper that is not found", async () => {
      const result = await client.invoke<string>({
        uri: asSubinvokeWrapperUri.uri + "-not-found",
        method: "simpleMethod",
        args: {
          arg: "test",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.URI_RESOLVER_ERROR);
      expect(result.error?.reason).toContain("A URI Resolver returned an error.");
      expect(
        result.error?.uri.endsWith(
          "packages/test-cases/cases/wrappers/subinvoke/00-subinvoke/implementations/as-not-found"
        )
      ).toBeTruthy();
      expect(result.error?.resolutionStack).toBeTruthy();
    });

    test("Subinvoke a wrapper that is not found", async () => {
      const result = await client.invoke<number>({
        uri: asConsumerWrapperUri.uri,
        method: "throwError",
        args: {
          a: "Hey",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason).toContain("SubInvocation exception encountered");
      expect(
        result.error?.uri.endsWith(
          "packages/test-cases/cases/wrappers/subinvoke/02-consumer/implementations/as"
        )
      ).toBeTruthy();
      expect(result.error?.method).toEqual("throwError");
      expect(result.error?.args).toEqual('{\n  "a": "Hey"\n}');
      expect(result.error?.source?.file).toEqual(
        "~lib/@polywrap/wasm-as/containers/Result.ts"
      );

      expect(result.error?.innerError instanceof WrapError).toBeTruthy();
      const prev = result.error?.innerError as WrapError;
      expect(prev.name).toEqual("WrapError");
      expect(prev.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(prev.reason).toContain(
        "A URI Resolver returned an error."
      );
      expect(prev.uri).toEqual("wrap://ens/wraps.eth:ens-uri-resolver-ext@1.0.1");
    });

    describe("Wasm wrapper - Assemblyscript", () => {
      let client = new PolywrapClient();
      test("Invoke a wrapper with malformed arguments", async () => {
        const result = await client.invoke<string>({
          uri: asSubinvokeWrapperUri.uri,
          method: "add",
          args: {
            a: "1",
            b: 1,
          },
        });

        expect(result.ok).toBeFalsy();
        if (result.ok) throw Error("should never happen");

        expect(result.error?.name).toEqual("WrapError");
        expect(result.error?.code).toEqual(
          WrapErrorCode.WRAPPER_INVOKE_ABORTED
        );
        expect(result.error?.reason.startsWith("__wrap_abort:")).toBeTruthy();
        expect(
          result.error?.uri.endsWith(
            "packages/test-cases/cases/wrappers/subinvoke/00-subinvoke/implementations/as"
          )
        ).toBeTruthy();
        expect(result.error?.method).toEqual("add");
        expect(result.error?.args).toEqual('{\n  "a": "1",\n  "b": 1\n}');
        expect(result.error?.source?.file).toEqual(
          "~lib/@polywrap/wasm-as/msgpack/ReadDecoder.ts"
        );
      });

      test("Invoke a wrapper method that doesn't exist", async () => {
        const result = await client.invoke<string>({
          uri: asSubinvokeWrapperUri.uri,
          method: "notExistingMethod",
          args: {
            arg: "test",
          },
        });

        expect(result.ok).toBeFalsy();
        if (result.ok) throw Error("should never happen");

        expect(result.error?.name).toEqual("WrapError");
        expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_FAIL);
        expect(
          result.error?.reason.startsWith("Could not find invoke function")
        ).toBeTruthy();
        expect(
          result.error?.uri.endsWith(
            "packages/test-cases/cases/wrappers/subinvoke/00-subinvoke/implementations/as"
          )
        ).toBeTruthy();
        expect(result.error?.method).toEqual("notExistingMethod");
        expect(result.error?.args).toEqual('{\n  "arg": "test"\n}');
        expect(
          result.error
            ?.toString()
            .split(WrapErrorCode.WRAPPER_INVOKE_FAIL.valueOf().toString())
            .length
        ).toEqual(2);
        expect(result.error?.innerError).toBeUndefined();
      });

      test("Subinvoke error two layers deep", async () => {
        const config = new ClientConfigBuilder()
          .addDefaults()
          .addRedirects({
            "ens/imported-invoke.eth": asInvokeWrapperUri.uri,
            "ens/imported-subinvoke.eth": asSubinvokeWrapperUri.uri,
          });
        
        client = new PolywrapClient(config.build());
        const result = await client.invoke<boolean>({
          uri: asConsumerWrapperUri.uri,
          method: "throwError",
          args: {
            a: "Hey",
          },
        });

        expect(result.ok).toBeFalsy();
        if (result.ok) throw Error("should never happen");

        expect(result.error?.name).toEqual("WrapError");
        expect(result.error?.code).toEqual(
          WrapErrorCode.WRAPPER_INVOKE_ABORTED
        );
        expect(
          result.error?.reason.startsWith("SubInvocation exception encountered")
        ).toBeTruthy();
        expect(
          result.error?.uri.endsWith(
            "packages/test-cases/cases/wrappers/subinvoke/02-consumer/implementations/as"
          )
        ).toBeTruthy();
        expect(result.error?.method).toEqual("throwError");
        expect(result.error?.args).toEqual('{\n  "a": "Hey"\n}');
        expect(result.error?.source?.file).toEqual(
          "~lib/@polywrap/wasm-as/containers/Result.ts"
        );

        expect(result.error?.innerError instanceof WrapError).toBeTruthy();
        const prev = result.error?.innerError as WrapError;
        expect(prev.name).toEqual("WrapError");
        expect(prev.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
        expect(
          prev.reason.startsWith("SubInvocation exception encountered")
        ).toBeTruthy();
        expect(prev.uri).toEqual("wrap://ens/imported-invoke.eth");
        expect(prev.method).toEqual("invokeThrowError");
        expect(prev.args).toEqual('{\n  "a": "Hey"\n}' );
        expect(prev.source?.file).toEqual(
          "~lib/@polywrap/wasm-as/containers/Result.ts"
        );

        expect(prev.innerError instanceof WrapError).toBeTruthy();
        const prevOfPrev = prev.innerError as WrapError;
        expect(prevOfPrev.name).toEqual("WrapError");
        expect(prevOfPrev.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
        expect(prevOfPrev.reason).toEqual("__wrap_abort: Hey");
        expect(
          prevOfPrev.uri.endsWith("wrap://ens/imported-subinvoke.eth")
        ).toBeTruthy();
        expect(prevOfPrev.method).toEqual("subinvokeThrowError");
        expect(prev.args).toEqual('{\n  "a": "Hey"\n}');
        expect(prevOfPrev.source?.file).toEqual(
          "src/index.ts"
        );
      });

      describe("Incompatible version invocation", () => {
        beforeAll(async () => {
          const wrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/as`;
          const manifestBuffer = fs.readFileSync(
            path.join(wrapperPath, "wrap.info")
          );
          const wasmModuleBuffer = fs.readFileSync(
            path.join(wrapperPath, "wrap.wasm")
          );

          fs.mkdirSync("tmp");
          const manifest: Record<string, unknown> = (await msgpackDecode(
            manifestBuffer
          )) as Record<string, unknown>;
          manifest.version = "0.0.0.5" as any;
          const modifiedManifestBuffer = msgpackEncode(manifest, false);
          fs.writeFileSync("tmp/wrap.info", modifiedManifestBuffer);
          fs.writeFileSync("tmp/wrap.wasm", wasmModuleBuffer);
        });
        test("Invoke a wrapper with incompatible version", async () => {
          const client = new PolywrapClient();
          const result = await client.invoke<string>({
            uri: "wrap://fs/tmp",
            method: "simpleMethod",
          });

          expect(result.ok).toBeFalsy();
          if (result.ok) throw Error("should never happen");

          expect(result.error?.name).toEqual("WrapError");
          expect(result.error?.code).toEqual(WrapErrorCode.URI_RESOLVER_ERROR);
          expect(result.error?.uri.endsWith("tmp")).toBeTruthy();
          expect(result.error?.resolutionStack).toBeDefined();
          expect(`${result.error?.cause}`).toContain(
            `Unrecognized WrapManifest schema version "0.0.0.5"`
          );
        });

        test.skip("Invoke a plugin with incompatible version", async () => {
          const builder = new ClientConfigBuilder();
          const config = builder
            .addPackage("wrap://ens/plugin.eth", incompatiblePlugin())
            .build();
          const client = new PolywrapClient(config);
          const result = await client.invoke<string>({
            uri: "wrap://ens/plugin.eth",
            method: "getData",
          });

          expect(result.ok).toBeFalsy();
          if (result.ok) throw Error("should never happen");

          expect(result.error?.name).toEqual("WrapError");
          expect(result.error?.code).toEqual(WrapErrorCode.URI_RESOLVER_ERROR);
          expect(result.error?.uri.endsWith("plugin.eth")).toBeTruthy();
          expect(result.error?.resolutionStack).toBeDefined();
          expect(`${result.error?.cause}`).toContain(
            `Unrecognized WrapManifest schema version "0.0.0.5"`
          );
        });

        afterAll(() => {
          fs.rmdirSync("tmp", { recursive: true });
        });
      });
    });

    describe("Wasm wrapper - Rust", () => {
      let client = new PolywrapClient();
      test("Invoke a wrapper with malformed arguments", async () => {
        const result = await client.invoke<string>({
          uri: rsSubinvokeWrapperUri.uri,
          method: "add",
          args: {
            a: "1",
            b: 1,
          },
        });

        expect(result.ok).toBeFalsy();
        if (result.ok) throw Error("should never happen");

        expect(result.error?.name).toEqual("WrapError");
        expect(result.error?.code).toEqual(
          WrapErrorCode.WRAPPER_INVOKE_ABORTED
        );
        expect(result.error?.reason.startsWith("__wrap_abort:")).toBeTruthy();
        expect(
          result.error?.uri.endsWith(
            "packages/test-cases/cases/wrappers/subinvoke/00-subinvoke/implementations/rs"
          )
        ).toBeTruthy();
        expect(result.error?.method).toEqual("add");
        expect(result.error?.args).toEqual('{\n  "a": "1",\n  "b": 1\n}');
        expect(result.error?.source?.file).toEqual(
          "src/wrap/module/wrapped.rs"
        );
      });

      test("Invoke a wrapper method that doesn't exist", async () => {
        const result = await client.invoke<string>({
          uri: rsSubinvokeWrapperUri.uri,
          method: "notExistingMethod",
          args: {
            arg: "test",
          },
        });

        expect(result.ok).toBeFalsy();
        if (result.ok) throw Error("should never happen");

        expect(result.error?.name).toEqual("WrapError");
        expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_FAIL);
        expect(
          result.error?.reason.startsWith("Could not find invoke function")
        ).toBeTruthy();
        expect(
          result.error?.uri.endsWith(
            "packages/test-cases/cases/wrappers/subinvoke/00-subinvoke/implementations/rs"
          )
        ).toBeTruthy();
        expect(result.error?.method).toEqual("notExistingMethod");
        expect(result.error?.args).toEqual('{\n  "arg": "test"\n}');
        expect(
          result.error
            ?.toString()
            .split(WrapErrorCode.WRAPPER_INVOKE_FAIL.valueOf().toString())
            .length
        ).toEqual(2);
        expect(result.error?.innerError).toBeUndefined();
      });

      test("Subinvoke error two layers deep", async () => {
        const config = new ClientConfigBuilder()
          .addDefaults()
          .addRedirects({
            "ens/imported-invoke.eth": rsInvokeWrapperUri.uri,
            "ens/imported-subinvoke.eth": rsSubinvokeWrapperUri.uri,
          });
        
        client = new PolywrapClient(config.build());
        const result = await client.invoke<number>({
          uri: rsConsumerWrapperUri.uri,
          method: "throwError",
          args: {
            a: "Hey",
          },
        });

        expect(result.ok).toBeFalsy();
        if (result.ok) throw Error("should never happen");

        expect(result.error?.name).toEqual("WrapError");
        expect(result.error?.code).toEqual(
          WrapErrorCode.WRAPPER_INVOKE_ABORTED
        );
        expect(
          result.error?.reason.startsWith("SubInvocation exception encountered")
        ).toBeTruthy();
        expect(
          result.error?.uri.endsWith(
            "packages/test-cases/cases/wrappers/subinvoke/02-consumer/implementations/rs"
          )
        ).toBeTruthy();
        expect(result.error?.method).toEqual("throwError");
        expect(result.error?.args).toEqual('{\n  "a": "Hey"\n}');
        expect(result.error?.source?.file).toEqual("src/lib.rs");

        expect(result.error?.innerError instanceof WrapError).toBeTruthy();
        const prev = result.error?.innerError as WrapError;
        expect(prev.name).toEqual("WrapError");
        expect(prev.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
        expect(
          prev.reason.startsWith("SubInvocation exception encountered")
        ).toBeTruthy();
        expect(prev.uri).toEqual("wrap://ens/imported-invoke.eth");
        expect(prev.method).toEqual("invokeThrowError");
        expect(prev.args).toEqual('{\n  "a": "Hey"\n}');
        expect(prev.source?.file).toEqual("src/lib.rs");

        expect(prev.innerError instanceof WrapError).toBeTruthy();
        const prevOfPrev = prev.innerError as WrapError;
        expect(prevOfPrev.name).toEqual("WrapError");
        expect(prevOfPrev.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
        expect(prevOfPrev.reason).toEqual("__wrap_abort: Hey");
        expect(
          prevOfPrev.uri.endsWith("wrap://ens/imported-subinvoke.eth")
        ).toBeTruthy();
        expect(prevOfPrev.method).toEqual("subinvokeThrowError");
        expect(prevOfPrev.args).toEqual('{\n  "a": "Hey"\n}');
        expect(prevOfPrev.source?.file).toEqual(
          "src/lib.rs"
        );
      });
    });

    describe("Plugin wrapper", () => {
      const mockPlugin = mockPluginRegistration("plugin/mock")
      const config = new ClientConfigBuilder()
        .addDefaults().addPackage(mockPlugin.uri.uri, mockPlugin.package)
      const client = new PolywrapClient(config.build());
      test("Invoke a plugin wrapper with malformed args", async () => {
        const result = await client.invoke<Uint8Array>({
          uri: DefaultBundle.plugins.fileSystem.uri.uri,
          method: "readFile",
          args: {
            pathh: "packages/js/client/src/__tests__/core/index.ts",
          },
        });

        expect(result.ok).toBeFalsy();
        if (result.ok) throw Error("should never happen");

        expect(result.error?.name).toEqual("WrapError");
        expect(result.error?.code).toEqual(
          WrapErrorCode.WRAPPER_INVOKE_ABORTED
        );
        expect(result.error?.reason).toEqual(
          'The "path" argument must be of type string or an instance of Buffer or URL. Received undefined'
        );
        expect(result.error?.uri).toEqual(DefaultBundle.plugins.fileSystem.uri.uri);
        expect(result.error?.method).toEqual("readFile");
        expect(result.error?.args).toContain(
          '{\n  "pathh": "packages/js/client/src/__tests__/core/index.ts"\n}'
        );
        expect(result.error?.source?.file).toEqual(
          "node:internal/fs/promises"
        );
      });

      test("Invoke a plugin wrapper with a method that doesn't exist", async () => {
        const result = await client.invoke<Uint8Array>({
          uri: DefaultBundle.plugins.fileSystem.uri.uri,
          method: "readFileNotFound",
          args: {
            path: __dirname + "/index.ts",
          },
        });

        expect(result.ok).toBeFalsy();
        if (result.ok) throw Error("should never happen");

        expect(result.error?.name).toEqual("WrapError");
        expect(result.error?.code).toEqual(
          WrapErrorCode.WRAPPER_METHOD_NOT_FOUND
        );
        expect(
          result.error?.reason.startsWith("Plugin missing method ")
        ).toBeTruthy();
        expect(result.error?.uri).toEqual(DefaultBundle.plugins.fileSystem.uri.uri);
        expect(result.error?.method).toEqual("readFileNotFound");
      });

      test("Invoke a plugin wrapper that throws explicitly", async () => {
        const result = await client.invoke<string>({
          uri: "wrap://plugin/mock",
          method: "methodThatThrows",
        });

        expect(result.ok).toBeFalsy();
        if (result.ok) throw Error("should never happen");

        expect(result.error?.name).toEqual("WrapError");
        expect(result.error?.code).toEqual(
          WrapErrorCode.WRAPPER_INVOKE_ABORTED
        );
        expect(result.error?.reason).toEqual("I'm throwing!");
        expect(result.error?.uri).toEqual("wrap://plugin/mock");
        expect(
          result.error?.source?.file?.endsWith(
            "packages/js/client/src/__tests__/helpers.ts"
          )
        ).toBeTruthy();
        expect(result.error?.source?.row).toEqual(47);
        expect(result.error?.source?.col).toEqual(15);
      });

      test("Invoke a plugin wrapper that throws unexpectedly", async () => {
        const result = await client.invoke<Uint8Array>({
          uri: DefaultBundle.plugins.fileSystem.uri.uri,
          method: "readFile",
          args: {
            path: "./this/path/does/not/exist.ts",
          },
        });

        expect(result.ok).toBeFalsy();
        if (result.ok) throw Error("should never happen");

        expect(result.error?.name).toEqual("WrapError");
        expect(result.error?.code).toEqual(
          WrapErrorCode.WRAPPER_INVOKE_ABORTED
        );
        expect(
          result.error?.reason.startsWith("ENOENT: no such file or directory")
        ).toBeTruthy();
        expect(result.error?.uri).toEqual(DefaultBundle.plugins.fileSystem.uri.uri);
        expect(result.error?.method).toEqual("readFile");
        expect(result.error?.args).toEqual(
          '{\n  "path": "./this/path/does/not/exist.ts"\n}'
        );
      });
    });
  });
});
