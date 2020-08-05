import {
  Web3API,
  IPFS,
  Ethereum,
  Subgraph
} from "../";
import { IPortals } from "../Web3API";
import { runW3CLI, generateName } from "./helpers";

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

jest.setTimeout(15000);

describe("Web3API", () => {
  let portals: IPortals;
  let apiCID: string;
  let apiENS: string;

  beforeAll(async () => {
    // fetch providers from dev server
    const { data: { ipfs, ethereum, subgraph } } = await axios.get("http://localhost:4040/providers");

    if (!ipfs) {
      throw Error("Dev server must be running at port 4040");
    }

    // re-deploy ENS
    const { data: { ensAddress } } = await axios.get("http://localhost:4040/deploy-ens");

    // create a new ENS domain
    apiENS = `${generateName()}.eth`;
    console.log(apiENS);

    // build & deploy the protocol
    const { exitCode, stdout, stderr } = await runW3CLI([
      "build",
      `${__dirname}/apis/ipfs-get-put-string/web3api.yaml`,
      "--output-dir",
      `${__dirname}/apis/ipfs-get-put-string/build`,
      "--ipfs",
      ipfs,
      "--test-ens",
      apiENS
    ]);

    console.log(stdout)
    console.log(stderr)

    // get the IPFS CID of the published package
    const extractCID = /IPFS { (([A-Z]|[a-z]|[0-9])*) }/;
    const result = stdout.match(extractCID);
    apiCID = result[1];

    portals = {
      ipfs: new IPFS({ provider: ipfs }),
      ethereum: new Ethereum({ provider: ethereum, ens: ensAddress }),
      subgraph: new Subgraph({ provider: subgraph })
    };
  });

  it.only("Fetches CID", async () => {
    const api = new Web3API({
      uri: apiENS,
      portals
    });

    const cid = await api.fetchCID();
    expect(cid).toBe(apiCID);
  })

  it("Fetches manifest", async () => {
    const api = new Web3API({
      uri: apiENS,
      portals
    });

    const manifest = await api.fetchAPIManifest();
    expect(manifest).toMatchObject(testValues.manifest);
  });

  it("Fetches schema", async () => {
    const api = new Web3API({
      uri: apiENS,
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
