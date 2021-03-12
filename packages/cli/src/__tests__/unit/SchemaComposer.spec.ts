import path from "path";
import { loadManifest } from "../../lib/helpers/manifest";
import { SchemaComposer, Project } from "../../lib";
import { composedSchema } from "../project/sample";

describe("SchemaComposer validation", () => {
  let manifest;
  const manifestPath = path.join(__dirname, "../project", "web3api.yaml");

  beforeAll(async () => {
    manifest = await loadManifest(manifestPath);
  });

  it("Should load & compose schema properly", async () => {
    const project = new Project({
      manifestPath,
    });
    const composer = new SchemaComposer({
      project,
    });
    const schema = await composer.getComposedSchemas();
    expect(schema).toEqual(composedSchema);
  });
});
