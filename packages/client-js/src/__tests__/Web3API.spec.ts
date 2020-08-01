import {
  Web3API,
  IPFS,
  Ethereum,
  Subgraph
} from "../";
import { IPortals } from "../Web3API";
import { printSchema } from "graphql";

// TODO: Replace w/ a fetch to the test driver
const testValues = {
  cid: "TODO",
  manifest: {
    description: "TODO",
    repository: "TODO",
    schema: {
      file: "TODO"
    },
    mutation: {
      schema: {
        file: "TODO"
      },
      module: {
        language: "wasm/assemblyscript",
        file: "TODO"
      }
    },
    query: {
      schema: {
        file: "TODO"
      },
      module: {
        language: "wasm/assemblyscript",
        file: "TODO"
      }
    },
    subgraph: {
      file: "TODO"
    }
  },
  schema: `TODO`
}

describe("Web3API", () => {
  let portals: IPortals;
  let ipfs: IPFS;
  let ethereum: Ethereum;
  let subgraph: Subgraph;

  beforeAll(() => {
    ipfs = new IPFS({
      provider: "localhost:5001"
    });

    ethereum = new Ethereum({
      provider: "localhost:8545"
    });

    subgraph = new Subgraph({
      provider: "localhost:8000"
    });

    portals = {
      ipfs,
      ethereum,
      subgraph
    };
  });

  it("Fetches CID", async () => {
    const api = new Web3API({
      uri: "api.tests.eth",
      portals
    });

    const cid = await api.fetchCID();
    expect(cid).toBe(testValues.cid);
  })

  it("Fetches manifest", async () => {
    const api = new Web3API({
      uri: "api.tests.eth",
      portals
    });

    const manifest = await api.fetchAPIManifest();
    expect(manifest).toMatchObject(testValues.manifest);
  });

  it("Fetches schema", async () => {
    const api = new Web3API({
      uri: "api.tests.eth",
      portals
    });

    const schema = await api.fetchSchema();
    expect(printSchema(schema)).toBe(testValues.schema);
  });

  it("Queries subgraph", async () => {

  });

  it("Queries WASM query", async () => {

  });

  it("Queries WASM mutation", async () => {

  });

  it("Uses IPFS from WASM", async () => {

  });

  it("Uses Ethereum from WASM", async () => {

  });

  it("Uses Subgraph from WASM", async () => {

  });
});
