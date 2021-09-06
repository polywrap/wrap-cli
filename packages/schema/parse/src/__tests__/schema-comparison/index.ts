import { parseSchema, TypeInfo } from '../..';
import path from "path";
import { readdirSync, readFileSync, Dirent } from "fs";
import { VersionRelease } from "../../schema-comparison/comparers";

const root = `${__dirname}/schemas/`

const VersionReleaseType: Record<string, VersionRelease> = {
  patch: VersionRelease.PATCH,
  minor: VersionRelease.MINOR,
  major: VersionRelease.MAJOR
}

export type TestCases = {
  name: string;
  input1: TypeInfo;
  input2: TypeInfo;
  output: VersionRelease;
}[];

export function fetchTestCases(): TestCases {
  const cases: TestCases = [];

  const importCase = (versionDirent: Dirent) => {
    // The case must be a folder
    if (!versionDirent.isDirectory()) {
        return;
    }
    const dirPath = path.join(root, versionDirent.name)
    readdirSync(dirPath, {
        withFileTypes: true,
    }).forEach((dirent) => importCaseByVersion(versionDirent, dirent));
  }

  const importCaseByVersion = (versionDirent: Dirent, schemaDirent: Dirent) => {
    // The case must be a folder
    if (!schemaDirent.isDirectory()) {
      return;
    }

    // Fetch the input schema
    const schema1 = readFileSync(
      path.join(root, versionDirent.name, schemaDirent.name, "input1.graphql"),
      {
        encoding: "utf-8",
      }
    );

    const schema2 = readFileSync(
      path.join(root, versionDirent.name, schemaDirent.name, "input2.graphql"),
      {
          encoding: "utf-8",
      }
    );

    const typeInfo1 = parseSchema(schema1);
    const typeInfo2 = parseSchema(schema2);

    cases.push({
      name: `${versionDirent.name}-${schemaDirent.name}`,
      input1: typeInfo1,
      input2: typeInfo2,
      output: VersionReleaseType[versionDirent.name],
    });
  };

  readdirSync(root, {
    withFileTypes: true,
  }).forEach(importCase);

  return cases;
}
