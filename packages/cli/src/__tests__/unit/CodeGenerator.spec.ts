import fs from "fs";
import path from "path";
import { SchemaComposer, Project, CodeGenerator } from "../../lib";

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
      fs.rmdirSync(outputDir, { recursive: true });
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

    const expectedSchema = `
### Web3API Header START ###
scalar UInt
scalar UInt8
scalar UInt16
scalar UInt32
scalar UInt64
scalar Int
scalar Int8
scalar Int16
scalar Int32
scalar Int64
scalar Bytes

directive @imported(
  uri: String!
  namespace: String!
  nativeType: String!
) on OBJECT | ENUM

directive @imports(
  types: [String!]!
) on OBJECT
### Web3API Header END ###

type Query {
  getData(address: String!): Int!
}
type Mutation {
  setData(address: String!, value: UInt32!): String!

  deployContract: String!
}

### Imported Queries START ###

### Imported Queries END ###

### Imported Objects START ###

### Imported Objects END ###

`;

    const { schema: schema1 } = require("../project/types/schema1.ts");
    expect(schema1).toEqual(expectedSchema);

    const { schema: schema2 } = require("../project/types/schema3.ts");
    expect(schema2).toEqual(expectedSchema);

    const { schema: schema3 } = require("../project/types/folder/schema2.ts");
    expect(schema3).toEqual(expectedSchema);

    fs.rmdirSync(outputDir, { recursive: true });
  });
});
