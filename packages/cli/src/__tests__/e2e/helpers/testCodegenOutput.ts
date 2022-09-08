import fs from "fs";
import path from "path";
import { compareSync } from "dir-compare";

export const testCodegenOutput = (
  testCaseDir: string,
  codegenDir: string,
  buildDir?: string
) => {
  if (fs.existsSync(path.join(testCaseDir, "expected", "wrap"))) {
    const expectedCodegenResult = compareSync(
      codegenDir,
      path.join(testCaseDir, "expected", "wrap"),
      { compareContent: true }
    );
    expect(expectedCodegenResult.differences).toBe(0);
  }

  // HACK for testing plugin codegen output, as it outputs ABI to a build folder
  if (buildDir) {
    if (fs.existsSync(path.join(testCaseDir, "expected", "build-artifacts"))) {
      const expectedBuildResult = compareSync(
        buildDir,
        path.join(testCaseDir, "expected", "build-artifacts"),
        { compareContent: true }
      );
      expect(expectedBuildResult.differences).toBe(0);
    }
  }
};
