import fs from "fs";
import path from "path";
import { SchemaComposer, Project, CodeGenerator } from "../../lib";
import { composedSchema } from "../project/sample";

const rimraf = require("rimraf");

describe("CodeGenerator validation", () => {
  const manifestPath = path.join(__dirname, "../project", "web3api.yaml");
  const generationFile = path.join(__dirname, "../project", "web3api.gen.js");
  const outputDir = path.join(__dirname, "../project", "types");

  it("Should fail with invalid manifest path", async () => {
    const project = new Project({
      manifestPath: "invalidManifest",
      quiet: true,
    });
    const schemaComposer = new SchemaComposer({
      project,
    });
    const generator = new CodeGenerator({
      project,
      schemaComposer,
      generationFile,
      outputDir,
    });

    const result = await generator.generate();
    expect(result).toEqual(false);
  });

  it("Should fail with invalid generation file", async () => {
    const project = new Project({
      manifestPath,
      quiet: true,
    });
    const schemaComposer = new SchemaComposer({
      project,
    });
    const generator = new CodeGenerator({
      project,
      schemaComposer,
      generationFile: path.join(
        __dirname,
        "../project",
        "web3api-norun.gen.js"
      ),
      outputDir,
    });

    const result = await generator.generate();
    expect(result).toEqual(false);
  });

  it("Should generate", async () => {
    if (fs.existsSync(outputDir)) {
      rimraf.sync(outputDir);
    }

    const project = new Project({
      manifestPath,
      quiet: true,
    });
    const schemaComposer = new SchemaComposer({
      project,
    });
    const generator = new CodeGenerator({
      project,
      schemaComposer,
      generationFile,
      outputDir,
    });

    const result = await generator.generate();
    expect(result).toEqual(true);

    const expectedSchema = composedSchema.combined;

    const { schema: schema1 } = require("../project/types/schema1.ts");
    expect(schema1).toEqual(expectedSchema);

    const { schema: schema2 } = require("../project/types/schema3.ts");
    expect(schema2).toEqual(expectedSchema);

    const { schema: schema3 } = require("../project/types/folder/schema2.ts");
    expect(schema3).toEqual(expectedSchema);

    rimraf.sync(outputDir);
  });
});
