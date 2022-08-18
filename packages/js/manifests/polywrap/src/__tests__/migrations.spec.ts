import { deserializePolywrapManifest } from "../";

import fs from "fs";

describe("Polywrap Manifest Migrations", () => {
  it("Should succesfully migrate from 0.1.0 to 0.3.0", async() => {
    const manifestPath = __dirname + "/manifest/polywrap/migrate-0.1.0-to-0.3.0/polywrap-0.1.0.yaml";
    const expectedManifestPath = __dirname + "/manifest/polywrap/migrate-0.1.0-to-0.3.0/polywrap-0.3.0.yaml";

    const manifest = fs.readFileSync(manifestPath, "utf-8");
    const expectedManifest = fs.readFileSync(expectedManifestPath, "utf-8");

    expect(deserializePolywrapManifest(manifest)).toEqual(deserializePolywrapManifest(expectedManifest));
  });
});
