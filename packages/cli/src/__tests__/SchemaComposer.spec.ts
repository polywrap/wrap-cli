import path from "path";
import { loadManifest } from "../lib/helpers/manifest";
import { SchemaComposer } from "../lib/SchemaComposer";
import { composedSchema } from "./project/sample";

describe("SchemaComposer validation", () => {
  let manifest;
  const manifestPath = path.join(__dirname, "project", "web3api.yaml");

  beforeAll(async () => {
    manifest = await loadManifest(manifestPath);
  });

  it("Should load & compose schema properly", async () => {
    const composer = new SchemaComposer({
      manifestPath,
    });
    const schema = await composer.composeSchemas(manifest);
    expect(schema).toEqual(composedSchema);
  });
});
