import { polywrapCli } from "./utils";

import { runCLI } from "@polywrap/test-env-js";
import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import fse from "fs-extra";
import path from "path";

const { performance } = require('perf_hooks');
jest.setTimeout(500000);

describe("benchmarking", () => {
  const testCaseRoot = path.join(GetPathToCliTestFiles(), "wasm/build-benchmarks");
  const testCases = fse
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);


    it("Rust images", async () => {
      fse.removeSync(`${getTestCaseDir(0)}/post/build`);
      fse.removeSync(`${getTestCaseDir(0)}/post/.polywrap`);
      const startTime1 = performance.now()
      
      const { stderr, stdout } = await runCLI({
        args: ["build", "-v"],
        cwd: `${getTestCaseDir(0)}/post`,
        cli: polywrapCli,
      });
      const endTime1 = performance.now()
      const msTime1 = endTime1 - startTime1

      console.log(stderr);
      console.log(stdout);

      console.log(`1st Rust post: ${msTime1.toFixed(2)}ms`);

      const startTime2 = performance.now()
      
      await runCLI({
        args: ["build", "-v"],
        cwd: `${getTestCaseDir(0)}/post`,
        cli: polywrapCli,
      });
      const endTime2 = performance.now()
      const msTime2 = endTime2 - startTime2

      console.log(`2nd Rust post: ${msTime2.toFixed(2)}ms`);

      fse.removeSync(`${getTestCaseDir(0)}/pre/build`);
      fse.removeSync(`${getTestCaseDir(0)}/pre/.polywrap`);
      const startTime3 = performance.now()
      
      await runCLI({
        args: ["build", "-v"],
        cwd: `${getTestCaseDir(0)}/pre`,
        cli: polywrapCli,
      });
      const endTime3 = performance.now()
      const msTime3 = endTime3 - startTime3

      console.log(`1st Rust pre: ${msTime3.toFixed(2)}ms`);

      const startTime4 = performance.now()
      
      await runCLI({
        args: ["build", "-v"],
        cwd: `${getTestCaseDir(0)}/pre`,
        cli: polywrapCli,
      });
      const endTime4 = performance.now()
      const msTime4 = endTime4 - startTime4

      console.log(`2nd Rust pre: ${msTime4.toFixed(2)}ms`);
    })
});
