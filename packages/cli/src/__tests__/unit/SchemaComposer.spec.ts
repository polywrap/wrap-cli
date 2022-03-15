import path from "path";
import { SchemaComposer, Web3ApiProject } from "../../lib";
import { composedSchema } from "../project/sample";

import { ComposerFilter } from "@web3api/schema-compose";

describe("SchemaComposer validation", () => {
  const manifestPath = path.join(__dirname, "../project", "web3api.yaml");

  it("Should load & compose schema properly", async () => {
    const project = new Web3ApiProject({
      rootCacheDir: path.dirname(manifestPath),
      web3apiManifestPath: manifestPath,
    });
    const composer = new SchemaComposer({
      project,
    });
    const schema = await composer.getComposedSchemas(ComposerFilter.Schema);

    expect({
      query: schema.query?.schema,
      mutation: schema.mutation?.schema,
      combined: schema.combined?.schema,
    }).toEqual(composedSchema);
  });
});
