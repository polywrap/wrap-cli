import { polywrapCli } from "../e2e/utils";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import path from "path";
import { Commands } from "@polywrap/cli-js";

describe("e2e tests for docker", () => {
  beforeAll(async () => {
    await Commands.infra("down", {
      modules: ["eth-ens-ipfs"]
    }, {
      cwd: path.join(GetPathToCliTestFiles(), "wasm/build-cmd/assemblyscript/001-sanity"),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });
  });

  afterAll(async () => {
    await Commands.infra("down", {
      modules: ["eth-ens-ipfs"]
    }, {
      cwd: path.join(GetPathToCliTestFiles(), "wasm/build-cmd/assemblyscript/001-sanity"),
      cli: polywrapCli,
      env: process.env as Record<string, string>
    });
  });

  test("Docker FileLock should make concurrent operations wait for lock", async () => {
    const promises: Promise<void | { exitCode: number; stdout: string; stderr: string }>[] = [];
    for (let i = 0; i < 3; i++) {
      promises.push(Commands.build({
        strategy: "image",
        verbose: true,
      }, {
        cwd: path.join(GetPathToCliTestFiles(), "wasm/build-cmd/assemblyscript/001-sanity"),
        cli: polywrapCli
      }).then((result: { exitCode: number; stdout: string; stderr: string }) => {
        const { exitCode, stderr } = result;
        expect(stderr.indexOf("Conflict. The container name \"/root-build-image\" is already in use")).toBeLessThan(0);
        expect(exitCode).toEqual(0);
      }));
    }
    await Promise.all(promises);
  });
});
