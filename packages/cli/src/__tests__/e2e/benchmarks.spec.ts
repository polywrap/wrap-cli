import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import fse from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { runCLI } from "@polywrap/test-env-js";
import { polywrapCli } from "./utils";

const { performance } = require("perf_hooks");
jest.setTimeout(500000);

describe("benchmarking", () => {
  const testCaseRoot = path.join(
    GetPathToCliTestFiles(),
    "wasm/build-benchmarks"
  );
  const testCases = fse
    .readdirSync(testCaseRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
  const getTestCaseDir = (index: number) =>
    path.join(testCaseRoot, testCases[index]);

  let cacheFiles = new Map<string, string>();

  const mockFunc = `
    fn foo() -> &'static str {
  "foo"
}
    `;

  const modifySource = (wrapperPath: string) => {
    const libPath = path.join(wrapperPath, "src", "lib.rs");
    const libFile = fse.readFileSync(libPath, "utf-8");

    cacheFiles.set(libPath, libFile);

    const modifiedFile = `${libFile}\n${mockFunc}`;

    fse.writeFileSync(libPath, modifiedFile);
  };

  const buildImage = async (wrapperPath: string, name: string, msg: string) => {
    const startTime = performance.now();

    await runCLI({
      args: ["codegen"],
      cwd: wrapperPath,
      cli: polywrapCli,
    });

    execSync(`docker build ${wrapperPath} -t ${name}`);
    const endTime = performance.now();
    const msTime = endTime - startTime;

    console.log(`${msg} (${name}): ${msTime.toFixed(2)}ms`);
  };

  beforeAll(() => {
    fse.removeSync(`${getTestCaseDir(0)}/optimized/build`);
    fse.removeSync(`${getTestCaseDir(0)}/optimized/.polywrap`);

    fse.removeSync(`${getTestCaseDir(0)}/current/build`);
    fse.removeSync(`${getTestCaseDir(0)}/current/.polywrap`);
  });

  afterAll(() => {
    for (const [key, value] of cacheFiles) {
      fse.writeFileSync(key, value);
    }
  });

  it("Rust images", async () => {
    execSync(`docker system prune -a -f`);

    await buildImage(
      `${getTestCaseDir(0)}/current`,
      "rust-current",
      "1st build - no cache"
    );
    await buildImage(
      `${getTestCaseDir(0)}/current`,
      "rust-current",
      "2nd build - with cache"
    );

    modifySource(`${getTestCaseDir(0)}/current`);

    await buildImage(
      `${getTestCaseDir(0)}/current`,
      "rust-current",
      "3rd build - modified source"
    );

    execSync(`docker system prune -a -f`);

    await buildImage(
      `${getTestCaseDir(0)}/optimized`,
      "rust-optimized",
      "1st build - no cache"
    );
    await buildImage(
      `${getTestCaseDir(0)}/optimized`,
      "rust-optimized",
      "2nd build - with cache"
    );

    modifySource(`${getTestCaseDir(0)}/optimized`);

    await buildImage(
      `${getTestCaseDir(0)}/optimized`,
      "rust-optimized",
      "3rd build - modified source"
    );
  });
});
