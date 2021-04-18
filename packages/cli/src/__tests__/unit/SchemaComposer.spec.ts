import path from "path";
import { SchemaComposer, Project } from "../../lib";
import { composedSchema } from "../project/sample";

describe("SchemaComposer validation", () => {
  const manifestPath = path.join(__dirname, "../project", "web3api.yaml");

  it("Should load & compose schema properly", async () => {
    const project = new Project({
      manifestPath,
    });
    const composer = new SchemaComposer({
      project,
    });
    const schema = await composer.getComposedSchemas();
    expect({
      query: schema.query?.schema,
      mutation: schema.mutation?.schema,
      combined: schema.combined?.schema,
    }).toEqual(composedSchema);
  });
});
