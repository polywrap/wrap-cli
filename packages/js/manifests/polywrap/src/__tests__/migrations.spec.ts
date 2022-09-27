import { deserializeDeployManifest, deserializePolywrapManifest } from "../";

import fs from "fs";
import { findShortestMigrationPath, Migrator } from "../migrations";

describe("Manifest migration pathfinding", () => {
  const migrators: Migrator[] = [
    {
      from: "0.1.0",
      to: "0.2.0",
      migrate: () => {},
    },
    {
      from: "0.2.0",
      to: "0.3.0",
      migrate: () => {},
    },
    {
      from: "0.3.0",
      to: "0.4.0",
      migrate: () => {},
    },
    {
      from: "0.4.0",
      to: "0.5.0",
      migrate: () => {},
    },
    {
      from: "0.2.0",
      to: "0.4.0",
      migrate: () => {},
    },
  ];

  it("Should return undefined when no migration path exists", async () => {
    const path = findShortestMigrationPath(migrators, "0.1.0", "0.6.0");

    expect(path).toBeUndefined();

    const reverseUnsupportedPath = findShortestMigrationPath(
      migrators,
      "0.2.0",
      "0.1.0"
    );

    expect(reverseUnsupportedPath).toBeUndefined();
  });

  it("Should return an empty array when from and to are the same", async () => {
    const path = findShortestMigrationPath(migrators, "0.1.0", "0.1.0");

    expect(path).toEqual([]);
  });

  it("Should return the shortest migration path", async () => {
    const path = findShortestMigrationPath(migrators, "0.1.0", "0.5.0");

    expect(path).toEqual([migrators[0], migrators[4], migrators[3]]);
  });
});

describe("Polywrap Project Manifest Migrations", () => {
  it("Should succesfully migrate from 0.1.0 to 0.2.0", async () => {
    const manifestPath =
      __dirname + "/manifest/polywrap/migrations/polywrap-0.1.0.yaml";
    const expectedManifestPath =
      __dirname + "/manifest/polywrap/migrations/polywrap-0.2.0.yaml";

    const manifestFile = fs.readFileSync(manifestPath, "utf-8");
    const expectedManifestFile = fs.readFileSync(expectedManifestPath, "utf-8");

    const manifest = deserializePolywrapManifest(manifestFile);
    const expectedManifest = deserializePolywrapManifest(expectedManifestFile);

    expect(manifest).toEqual(expectedManifest);
  });
});

describe("Polywrap Deploy Manifest Migrations", () => {
  it("Should succesfully migrate from 0.1.0 to 0.2.0", async () => {
    const manifestPath =
      __dirname + "/manifest/deploy/migrations/polywrap-0.1.0.yaml";
    const expectedManifestPath =
      __dirname + "/manifest/deploy/migrations/polywrap-0.2.0.yaml";

    const manifestFile = fs.readFileSync(manifestPath, "utf-8");
    const expectedManifestFile = fs.readFileSync(expectedManifestPath, "utf-8");

    const manifest = deserializeDeployManifest(manifestFile);
    const expectedManifest = deserializeDeployManifest(expectedManifestFile);

    expect(manifest).toEqual(expectedManifest);
  });
});
