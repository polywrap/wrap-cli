import { polywrapCli } from "./utils";
import { Commands } from "@polywrap/cli-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import fs from "fs";
import path from "path";

jest.setTimeout(1500000);

describe("e2e tests for build command", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "build-cmd/wasm/typescript");
  const testCases = fs
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  describe("Image strategy", () => {
    it("Builds for typescript", async () => {
      const { exitCode: code, stdout: output } = await Commands.build({
        strategy: "image",
        verbose: true
      }, {
        cwd: getTestCaseDir(0),
        cli: polywrapCli,
      });
      const buildDir = `./build`;

      expect(code).toEqual(0);
      expect(output).toContain(`Artifacts written to ${buildDir}`);
      expect(output).toContain(`WRAP manifest written in ${buildDir}/wrap.info`);
    });
  })

  // NOTE: Skipped because CI needs system prequisites: pwr CLI
  describe.skip("Local strategy", () => {
    it("Builds for typescript", async () => {
      const { exitCode: code, stdout: output } = await Commands.build({
        strategy: "local",
        verbose: true
      }, {
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
    it("Builds for typescript", async () => {
      const { exitCode: code, stdout: output } = await Commands.build({
        strategy: "vm",
        verbose: true
      }, {
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
