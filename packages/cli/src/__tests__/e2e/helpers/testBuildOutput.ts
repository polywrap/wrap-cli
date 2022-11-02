import path from "path";
import fs from "fs";

export const testBuildOutput = (testCaseDir: string, buildDir: string) => {
  const expectedOutputFile = path.join(
    testCaseDir,
    "expected",
    "output.json"
  );
  if (fs.existsSync(expectedOutputFile)) {
    const expectedFiles = JSON.parse(
      fs.readFileSync(expectedOutputFile, { encoding: "utf8" })
    );

    for (const file of expectedFiles) {
      if (!fs.existsSync(path.join(buildDir, file))) {
        expect(path.join(buildDir, file)).toBe("debug")
      }
      expect(fs.existsSync(path.join(buildDir, file))).toBeTruthy();
    }
  }
};