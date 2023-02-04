import fs from "fs";
import path from "path";
import { WasmWrapper } from "@polywrap/wasm-js";
import { Uri, Wrapper } from "@polywrap/core-js";

import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { PolywrapClient } from "../..";
import { WrapError, WrapErrorCode } from "@polywrap/core-js";
import { mockPluginRegistration } from "../helpers";
import { defaultPackages } from "@polywrap/client-config-builder-js";
import { deserializeWrapManifest, serializeWrapManifest } from "@polywrap/wrap-manifest-types-js";
import { msgpackDecode, msgpackEncode } from "@polywrap/msgpack-js";

jest.setTimeout(660000);

const asSubinvokeWrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/as`;
const asSubinvokeWrapperUri = new Uri(`fs/${asSubinvokeWrapperPath}`);

const asInvokeWrapperPath = `${GetPathToTestWrappers()}/subinvoke/01-invoke/implementations/as`;
const asInvokeWrapperUri = new Uri(`fs/${asInvokeWrapperPath}`);

const asConsumerWrapperPath = `${GetPathToTestWrappers()}/subinvoke/02-consumer/implementations/as`;
const asConsumerWrapperUri = new Uri(`fs/${asConsumerWrapperPath}`);

const rsSubinvokeWrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/rs`;
const rsSubinvokeWrapperUri = new Uri(`fs/${rsSubinvokeWrapperPath}`);


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
      expect(result.error?.code).toEqual(WrapErrorCode.URI_NOT_FOUND);
      expect(result.error?.reason.startsWith("Unable to find URI ")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/subinvoke/00-subinvoke/implementations/as-not-found")).toBeTruthy();
      expect(result.error?.resolutionStack).toBeTruthy();
    });

    test("Subinvoke a wrapper that is not found", async () => {
      const result = await client.invoke<number>({
        uri: asConsumerWrapperUri.uri,
        method: "throwError",
        args: {
          a: "Hey"
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason.startsWith("SubInvocation exception encountered")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/subinvoke/02-consumer/implementations/as")).toBeTruthy();
      expect(result.error?.method).toEqual("throwError");
      expect(result.error?.args).toEqual("{\n  \"a\": \"Hey\"\n}");
      expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

      expect(result.error?.innerError instanceof WrapError).toBeTruthy();
      const prev = result.error?.innerError as WrapError;
      expect(prev.name).toEqual("WrapError");
      expect(prev.code).toEqual(WrapErrorCode.URI_NOT_FOUND);
      expect(prev.reason).toEqual("Unable to find URI wrap://ens/imported-invoke.eth.");
      expect(prev.uri).toEqual("wrap://ens/imported-invoke.eth");
      expect(prev.resolutionStack).toBeTruthy();
    });
  });

  describe("Wasm wrapper", () => {
    let client = new PolywrapClient();
    test("Invoke a wrapper with malformed arguments - as", async () => {
      const result = await client.invoke<string>({
        uri: asSubinvokeWrapperUri.uri,
        method: "add",
        args: {
          a: "1",
          b: 1
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason.startsWith("__wrap_abort:")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/subinvoke/00-subinvoke/implementations/as")).toBeTruthy();
      expect(result.error?.method).toEqual("add");
      expect(result.error?.args).toEqual("{\n  \"a\": \"1\",\n  \"b\": 1\n}");
      expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/msgpack/ReadDecoder.ts", row: 547, col: 9 });
    });

    test("Invoke a wrapper with malformed arguments - rs", async () => {
      const result = await client.invoke<string>({
        uri: rsSubinvokeWrapperUri.uri,
        method: "add",
        args: {
          a: "1",
          b: 1
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason.startsWith("__wrap_abort:")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/subinvoke/00-subinvoke/implementations/rs")).toBeTruthy();
      expect(result.error?.method).toEqual("add");
      expect(result.error?.args).toEqual("{\n  \"a\": \"1\",\n  \"b\": 1\n}");
      expect(result.error?.source).toEqual({ file: "src/wrap/module/wrapped.rs", row: 27, col: 13 });
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
      expect(result.error?.reason.startsWith("Could not find invoke function")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/subinvoke/00-subinvoke/implementations/as")).toBeTruthy();
      expect(result.error?.method).toEqual("notExistingMethod");
      expect(result.error?.args).toEqual("{\n  \"arg\": \"test\"\n}");
      expect(result.error?.toString().split(
        WrapErrorCode.WRAPPER_INVOKE_FAIL.valueOf().toString()
      ).length).toEqual(2);
      expect(result.error?.innerError).toBeUndefined();
    });

    test("Subinvoke error two layers deep", async () => {
      client = new PolywrapClient({
        redirects: [
          {
            from: Uri.from("ens/imported-invoke.eth"),
            to: asInvokeWrapperUri,
          },
          {
            from: Uri.from("ens/imported-subinvoke.eth"),
            to: asSubinvokeWrapperUri,
          }
        ]
      })
      const result = await client.invoke<boolean>({
        uri: asConsumerWrapperUri.uri,
        method: "throwError",
        args: {
          a: "Hey"
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason.startsWith("SubInvocation exception encountered")).toBeTruthy();
      expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/subinvoke/02-consumer/implementations/as")).toBeTruthy();
      expect(result.error?.method).toEqual("throwError");
      expect(result.error?.args).toEqual("{\n  \"a\": \"Hey\"\n}");
      expect(result.error?.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

      expect(result.error?.innerError instanceof WrapError).toBeTruthy();
      const prev = result.error?.innerError as WrapError;
      expect(prev.name).toEqual("WrapError");
      expect(prev.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(prev.reason.startsWith("SubInvocation exception encountered")).toBeTruthy();
      expect(prev.uri).toEqual("wrap://ens/imported-invoke.eth");
      expect(prev.method).toEqual("invokeThrowError");
      expect(prev.args).toEqual("{\n  \"0\": 129,\n  \"1\": 161,\n  \"2\": 97,\n  \"3\": 163,\n  \"4\": 72,\n  \"5\": 101,\n  \"6\": 121\n}");
      expect(prev.source).toEqual({ file: "~lib/@polywrap/wasm-as/containers/Result.ts", row: 171, col: 13 });

      expect(prev.innerError instanceof WrapError).toBeTruthy();
      const prevOfPrev = prev.innerError as WrapError;
      expect(prevOfPrev.name).toEqual("WrapError");
      expect(prevOfPrev.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(prevOfPrev.reason).toEqual("__wrap_abort: Hey");
      expect(prevOfPrev.uri.endsWith("wrap://ens/imported-subinvoke.eth")).toBeTruthy();
      expect(prevOfPrev.method).toEqual("subinvokeThrowError");
      expect(prev.args).toEqual("{\n  \"0\": 129,\n  \"1\": 161,\n  \"2\": 97,\n  \"3\": 163,\n  \"4\": 72,\n  \"5\": 101,\n  \"6\": 121\n}");
      expect(prevOfPrev.source).toEqual({ file: "src/index.ts", row: 8, col: 5 });
    });

  //   test("Invoke a wrapper of incompatible version", async () => {
  //     const wrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/as`;
  //     const manifestBuffer = fs.readFileSync(path.join(wrapperPath, "wrap.info"))
  //     const wasmModuleBuffer = fs.readFileSync(path.join(wrapperPath, "wrap.wasm"))

  //     const manifest: Record<string, unknown> = await msgpackDecode(manifestBuffer) as Record<string, unknown>;
  //     manifest.version = "0.0.0.5" as any;
  //     const modifiedManifestBuffer = msgpackEncode(manifest, false);
  
  //     let wrapper: Wrapper = await WasmWrapper.from(modifiedManifestBuffer, wasmModuleBuffer);
  
  //     const client = new PolywrapClient({
  //       wrappers: [
  //         {
  //           uri: "wrap://ens/incompatible-wrapper.eth",
  //           wrapper
  //         }
  //       ]
  //     });
  //     const result = await client.invoke<string>({
  //       uri: "wrap://ens/incompatible-wrapper.eth",
  //       method: "simpleMethod"
  //     });
    
  //     expect(result.ok).toBeFalsy();
  //     if (result.ok) throw Error("should never happen");
    
  //     expect(result.error?.name).toEqual("WrapError");
  //     expect(result.error?.code).toEqual(WrapErrorCode.URI_RESOLVER_ERROR);
  //     expect(result.error?.uri.endsWith("packages/test-cases/cases/wrappers/wasm-as/simple-deprecated")).toBeTruthy();
  //     expect(result.error?.resolutionStack).toBeDefined();
  //     expect(`${result.error?.cause}`).toContain(`Unrecognized WrapManifest schema version "0.0.1"`);
  //   });
  // });

  describe("Plugin wrapper", () => {
    const client = new PolywrapClient({
      packages: [mockPluginRegistration("plugin/mock")]
    });
    test("Invoke a plugin wrapper with malformed args", async () => {
      const result = await client.invoke<Uint8Array>({
        uri: defaultPackages.fileSystem,
        method: "readFile",
        args: {
          pathh:  "packages/js/client/src/__tests__/core/index.ts",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason).toEqual("The \"path\" argument must be of type string or an instance of Buffer or URL. Received undefined");
      expect(result.error?.uri).toEqual(defaultPackages.fileSystem);
      expect(result.error?.method).toEqual("readFile");
      expect(result.error?.args).toContain("{\n  \"pathh\": \"packages/js/client/src/__tests__/core/index.ts\"\n}");
      expect(result.error?.source).toEqual({ file: "node:internal/fs/promises", row: 450, col: 10 });
    });

    test("Invoke a plugin wrapper with a method that doesn't exist", async () => {
      const result = await client.invoke<Uint8Array>({
        uri: defaultPackages.fileSystem,
        method: "readFileNotFound",
        args: {
          path: __dirname + "/index.ts",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_METHOD_NOT_FOUND);
      expect(result.error?.reason.startsWith("Plugin missing method ")).toBeTruthy();
      expect(result.error?.uri).toEqual(defaultPackages.fileSystem);
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
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason).toEqual("I'm throwing!");
      expect(result.error?.uri).toEqual("wrap://plugin/mock");
      expect(result.error?.source?.file?.endsWith("packages/js/client/src/__tests__/helpers.ts")).toBeTruthy();
      expect(result.error?.source?.row).toEqual(49);
      expect(result.error?.source?.col).toEqual(17);
    });

    test("Invoke a plugin wrapper that throws unexpectedly", async () => {
      const result = await client.invoke<Uint8Array>({
        uri: defaultPackages.fileSystem,
        method: "readFile",
        args: {
          path: "./this/path/does/not/exist.ts",
        },
      });

      expect(result.ok).toBeFalsy();
      if (result.ok) throw Error("should never happen");

      expect(result.error?.name).toEqual("WrapError");
      expect(result.error?.code).toEqual(WrapErrorCode.WRAPPER_INVOKE_ABORTED);
      expect(result.error?.reason.startsWith("ENOENT: no such file or directory")).toBeTruthy();
      expect(result.error?.uri).toEqual(defaultPackages.fileSystem);
      expect(result.error?.method).toEqual("readFile");
      expect(result.error?.args).toEqual("{\n  \"path\": \"./this/path/does/not/exist.ts\"\n}");
    });
  });
});
