import { clearStyle } from "../utils";

import fs from "fs";
import path from "path";

export const testCliOutput = (
  testCaseDir: string,
  exitCode: number,
  stdout: string,
  stder: string
) => {
  const output = clearStyle(stdout);
  const error = clearStyle(stder);

  const expected = JSON.parse(
    fs.readFileSync(
      path.join(testCaseDir, "expected", "stdout.json"),
      "utf-8"
    )
  );

  if (expected.stdout) {
    if (Array.isArray(expected.stdout)) {
      for (const line of expected.stdout) {
        expect(output).toContain(line);
      }
    } else {
      expect(output).toContain(expected.stdout);
    }
  }

  if (expected.stderr) {
    if (Array.isArray(expected.stderr)) {
      for (const line of expected.stderr) {
        expect(error).toContain(line);
      }
    } else {
      expect(error).toContain(expected.stderr);
    }
  }

  if (expected.exitCode) {
    expect(exitCode).toEqual(expected.exitCode);
  }

  if (expected.files) {
    for (const file of expected.files) {
      expect(fs.existsSync(path.join(testCaseDir, file))).toBeTruthy();
    }
  }
};