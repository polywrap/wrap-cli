import fs from "fs";
import path from "path";
import { compareSync } from "dir-compare";

export const testCodegenOutput = (
  testCaseDir: string,
  codegenDir: string,
) => {
  if (fs.existsSync(path.join(testCaseDir, "expected", "wrap"))) {
    const expectedCodegenResult = compareSync(
      codegenDir,
      path.join(testCaseDir, "expected", "wrap"),
      { compareContent: true }
    );
    expect(expectedCodegenResult.differences).toBe(0);
  }
};
