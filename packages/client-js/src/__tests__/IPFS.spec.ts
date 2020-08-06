import {
  Web3API,
  IPFS,
  Ethereum,
  Subgraph
} from "../";
import { IPortals } from "../Web3API";
import { runW3CLI, generateName } from "./helpers";

import gql from "graphql-tag";
import axios from "axios";

jest.setTimeout(150000);

describe("IPFS", () => {
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

    if (exitCode !== 0) {
      console.error(`w3 exited with code: ${exitCode}`);
      console.log(`stderr:\n${stderr}`)
      console.log(`stdout:\n${stdout}`)
      throw Error("w3 CLI failed");
    }

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

  it("Read Content From IPFS", async () => {
    // Upload datat to IPFS
    const testString = "hello world";
    const testData = new Uint8Array(Buffer.from(testString));
    const { cid } = await portals.ipfs.add(testData);
    const ipfsHash = cid.toString();

    // Fetch it using a WASM query
    const api = new Web3API({
      uri: apiENS,
      portals
    });

    const res = await api.query({
      query: gql`
        {
          getString(cid: "${ipfsHash}")
        }
      `
    });

    expect(res.errors).toBeFalsy();
    expect(res.data.getString).toBe(testString)
  });

  it("Write Content To IPFS", async () => {
    const testContent = JSON.stringify({ test: 5 });

    // Fetch it using a WASM query
    const api = new Web3API({
      uri: apiENS,
      portals
    });

    const res = await api.query({
      query: gql`
        mutation PutString($content: String!) {
          putString(content: $content)
        }
      `,
      variables: {
        content: testContent
      }
    });

    expect(res.errors).toBeFalsy();
    expect(res.data.putString).toBeTruthy();

    const cat = await portals.ipfs.catToString(res.data.putString);
    expect(cat).toBe(testContent);
  });
});
