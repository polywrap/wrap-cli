import { polywrapCli } from "../e2e/utils";

import { initTestEnvironment, runCLI, stopTestEnvironment } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";

describe("e2e tests for docker", () => {
  beforeAll(async () => {
    await initTestEnvironment();
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  test("Docker FileLock should make concurrent operations wait for lock", async () => {
    const promises: Promise<void | { exitCode: number; stdout: string; stderr: string }>[] = [];
    for (let i = 0; i < 3; i++) {
      promises.push(
        runCLI({
          args: ["build", "-v", "-s", "image"],
          cwd: path.join(GetPathToCliTestFiles(), "wasm/build-cmd/assemblyscript/001-sanity"),
          cli: polywrapCli
        }).then((result: { exitCode: number; stdout: string; stderr: string }) => {
          const { exitCode, stderr } = result;
          expect(stderr.indexOf("Conflict. The container name \"/root-build-image\" is already in use")).toBeLessThan(0);
          expect(exitCode).toEqual(0);
        })
      );
    }
    await Promise.all(promises);
  });
});
