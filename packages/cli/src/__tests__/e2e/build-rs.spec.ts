import { polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import fs from "fs";
import path from "path";

jest.setTimeout(1200000);

describe("e2e tests for build command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "wasm/build-cmd/rust");
  const testCases = fs
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  describe("Image strategy", () => {
    it("Builds for rust", async () => {
      const { exitCode: code, stdout: output } = await runCLI({
        args: ["build", "-v", "-s", "image"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
      });
  
      const buildDir = `./build`;
  
      expect(code).toEqual(0);
      expect(output).toContain(`Artifacts written to ${buildDir}`);
      expect(output).toContain(`WRAP manifest written in ${buildDir}/wrap.info`);
    });
  })

  // NOTE: Skipped because CI needs system prequisites: bindgen, snip, etc.
  describe.skip("Local strategy", () => {
    it("Builds for rust", async () => {
      const { exitCode: code, stdout: output } = await runCLI({
        args: ["build", "-v", "-s", "local"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
      });
  
      const buildDir = `./build`;
  
      expect(code).toEqual(0);
      expect(output).toContain(`Artifacts written to ${buildDir}`);
      expect(output).toContain(`WRAP manifest written in ${buildDir}/wrap.info`);
    });
  })

  describe("VM strategy", () => {
    it("Builds for rust", async () => {
      const { exitCode: code, stdout: output } = await runCLI({
        args: ["build", "-v", "-s", "vm"],
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
      });
  
      const buildDir = `./build`;
  
      expect(code).toEqual(0);
      expect(output).toContain(`Artifacts written to ${buildDir}`);
      expect(output).toContain(`WRAP manifest written in ${buildDir}/wrap.info`);
    });
  })
});
