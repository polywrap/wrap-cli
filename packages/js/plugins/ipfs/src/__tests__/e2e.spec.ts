import { PolywrapClient } from "@polywrap/client-js";
import {
  initTestEnvironment,
  providers,
  stopTestEnvironment,
} from "@polywrap/test-env-js";
import CID from "cids";
import { ipfsPlugin } from "..";
import { IpfsClient } from "../utils/IpfsClient";
import { Ipfs_Module } from "../wrap";

const createIpfsClient = require("@dorgjelli-test/ipfs-http-client-lite");

jest.setTimeout(30000);

type IpfsFileInfo = {
  name: string;
  hash: CID;
};

describe("IPFS Plugin", () => {
  let client: PolywrapClient;
  let ipfs: IpfsClient;

  const sampleFileTextContents = "Hello World!";
  let sampleFileIpfsInfo: IpfsFileInfo;
  const sampleFileBuffer = Buffer.from(sampleFileTextContents, "utf-8");

  beforeAll(async () => {
    await initTestEnvironment();
    ipfs = createIpfsClient(providers.ipfs);

    client = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({
            provider: providers.ipfs,
          }),
        },
      ],
    });

    let ipfsAddResult = await ipfs.add(sampleFileBuffer);
    sampleFileIpfsInfo = ipfsAddResult[0];
  });

  afterAll(async () => {
    await stopTestEnvironment();
  });

  it("Should cat a sample file successfully", async () => {
    expect(sampleFileIpfsInfo).toBeDefined();

    let result = await Ipfs_Module.cat(
      { cid: sampleFileIpfsInfo.hash.toString() },
      client
    );

    expect(result.error).toBeFalsy();

    expect(result.data).toEqual(sampleFileBuffer);
  });

  it("Should cat a file to string successfully", async () => {
    expect(sampleFileIpfsInfo).toBeDefined();

    let result = await Ipfs_Module.catToString(
      { cid: sampleFileIpfsInfo.hash.toString() },
      client
    );

    expect(result.error).toBeFalsy();

    expect(result.data).toEqual(sampleFileTextContents);
  });

  it("Should cat a file to buffer successfully", async () => {
    expect(sampleFileIpfsInfo).toBeDefined();

    let result = await Ipfs_Module.cat(
      { cid: sampleFileIpfsInfo.hash.toString() },
      client
    );

    expect(result.error).toBeFalsy();

    expect(result.data).toEqual(sampleFileBuffer);
  });

  it("Should resolve a file successfully", async () => {
    expect(sampleFileIpfsInfo).toBeDefined();

    let result = await Ipfs_Module.resolve(
      { cid: sampleFileIpfsInfo.hash.toString() },
      client
    );

    expect(result.error).toBeFalsy();

    expect(result.data).toEqual({
      cid: `/ipfs/${sampleFileIpfsInfo.hash.toString()}`,
      provider: providers.ipfs,
    });
  });

  it("Should add a file successfully", async () => {
    let result = await Ipfs_Module.addFile({ data: sampleFileBuffer }, client);

    expect(result.error).toBeFalsy();

    expect(result.data).toEqual(sampleFileIpfsInfo.hash.toString());
  });
});
