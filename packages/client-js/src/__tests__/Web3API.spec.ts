import {
  Web3API,
  IPFS,
  Ethereum,
  Subgraph
} from "../";
import { IPortals } from "../Web3API";
import { printSchema } from "graphql";
import axios from "axios";

// TODO:
// - build & deploy example we want to use
// - publish it to random ENS address for this test run
// - query it

const testValues = {
  cid: {

  },
  manifest: {

  },
  schema: {

  }
}

describe("Web3API", () => {
  let portals: IPortals;

  beforeAll(async () => {
    // fetch providers from dev server
    const { data: { ipfs, ethereum, subgraph } } = await axios.get("http://localhost:4040/providers");

    if (!ipfs) {
      throw Error("Dev server must be running at port 4040");
    }

    // re-deploy ENS
    const { data: { ensAddress } } = await axios.get("http://localhost:4040/deploy-ens");

    // build & deploy the protocol
    // TODO:
    // w3 build --ipfs ${ipfs} --ens-address ${ensAddress} --ens ${randomName}

    portals = {
      ipfs: new IPFS({ provider: ipfs }),
      ethereum: new Ethereum({ provider: ethereum, ens: ensAddress }),
      subgraph: new Subgraph({ provider: subgraph })
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
