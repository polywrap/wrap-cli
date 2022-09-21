import { deserializeDeployManifest, deserializePolywrapManifest } from "../";

import fs from "fs";

describe("Polywrap Manifest Migrations", () => {
  it("Should succesfully migrate from 0.1.0 to 0.2.0", async() => {
    const manifestPath = __dirname + "/manifest/polywrap/migrations/polywrap-0.1.0.yaml";
    const expectedManifestPath = __dirname + "/manifest/polywrap/migrations/polywrap-0.2.0.yaml";

    const manifestFile = fs.readFileSync(manifestPath, "utf-8");
    const expectedManifestFile = fs.readFileSync(expectedManifestPath, "utf-8");

    const manifest = deserializePolywrapManifest(manifestFile);
    const expectedManifest = deserializePolywrapManifest(expectedManifestFile);

    expect(manifest).toEqual(expectedManifest);
  });
});

describe("Polywrap Deploy Manifest Migrations", () => {
  it("Should succesfully migrate from 0.1.0 to 0.2.0", async() => {
    const manifestPath = __dirname + "/manifest/deploy/migrations/polywrap-0.1.0.yaml";
    const expectedManifestPath = __dirname + "/manifest/deploy/migrations/polywrap-0.2.0.yaml";

    const manifestFile = fs.readFileSync(manifestPath, "utf-8");
    const expectedManifestFile = fs.readFileSync(expectedManifestPath, "utf-8");

    const manifest = deserializeDeployManifest(manifestFile);
    const expectedManifest = deserializeDeployManifest(expectedManifestFile);

    expect(manifest).toEqual(expectedManifest);
  });
});