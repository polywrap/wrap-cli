import fs from "fs";
import path from "path";
import { SchemaComposer, Project, CodeGenerator } from "../../lib";

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
scalar BigInt

directive @imported(
  uri: String!
  namespace: String!
  nativeType: String!
) on OBJECT | ENUM

directive @imports(
  types: [String!]!
) on OBJECT
### Web3API Header END ###

type Query @imports(
  types: [
    "Ethereum_Query",
    "Ethereum_Connection"
  ]
) {
  getData(
    address: String!
    connection: Ethereum_Connection
  ): UInt32!
}

type Mutation @imports(
  types: [
    "Ethereum_Mutation",
    "Ethereum_Connection"
  ]
) {
  setData(
    options: SetDataOptions!
    connection: Ethereum_Connection
  ): SetDataResult!

  deployContract(
    connection: Ethereum_Connection
  ): String!
}

type SetDataOptions {
  address: String!
  value: UInt32!
}

type SetDataResult {
  txReceipt: String!
  value: UInt32!
}

### Imported Queries START ###

type Ethereum_Query @imported(
  uri: "w3://ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "Query"
) {
  callView(
    address: String!
    method: String!
    args: [String!]
    connection: Ethereum_Connection
  ): String!
}

type Ethereum_Mutation @imported(
  uri: "w3://ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "Mutation"
) {
  sendTransaction(
    address: String!
    method: String!
    args: [String!]
    connection: Ethereum_Connection
  ): String!

  deployContract(
    abi: String!
    bytecode: String!
    args: [String!]
    connection: Ethereum_Connection
  ): String!
}

### Imported Queries END ###

### Imported Objects START ###

type Ethereum_Connection @imported(
  uri: "w3://ens/ethereum.web3api.eth",
  namespace: "Ethereum",
  nativeType: "Connection"
) {
  node: String
  networkNameOrChainId: String
}

### Imported Objects END ###

`;

    const { schema: schema1 } = require("../project/types/schema1.ts");
    expect(schema1).toEqual(expectedSchema);

    const { schema: schema2 } = require("../project/types/schema3.ts");
    expect(schema2).toEqual(expectedSchema);

    const { schema: schema3 } = require("../project/types/folder/schema2.ts");
    expect(schema3).toEqual(expectedSchema);

    rimraf.sync(outputDir);
  });
});
