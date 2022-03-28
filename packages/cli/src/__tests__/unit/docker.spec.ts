import path from "path";
import { initTestEnvironment, runCLI, stopTestEnvironment } from "@web3api/test-env-js";
import { w3Cli } from "../e2e/utils";

describe("e2e tests for docker", () => {
  const projectRoot = path.resolve(__dirname, "../project/");

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
          args: ["build", "-v"],
          cwd: projectRoot,
          cli: w3Cli
        }).then((result: { exitCode: number; stdout: string; stderr: string }) => {
          const { exitCode, stderr } = result;
          expect(stderr.indexOf("Conflict. The container name \"/root-build-env\" is already in use")).toBeLessThan(0);
          expect(exitCode).toEqual(0);
        })
      );
    }
    await Promise.all(promises);
  });

});
