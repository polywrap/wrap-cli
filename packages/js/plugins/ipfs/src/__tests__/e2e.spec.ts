import { PolywrapClient } from "@polywrap/client-js";
import {
  initTestEnvironment,
  providers,
  stopTestEnvironment,
} from "@polywrap/test-env-js";

import { ipfsPlugin } from "..";
import { IpfsClient, IpfsFileInfo } from "../utils/IpfsClient";
import { Ipfs_Module } from "../wrap";

const createIpfsClient = require("@dorgjelli-test/ipfs-http-client-lite");

jest.setTimeout(300000);

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

  it("Should cat a file successfully", async () => {
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
    const expectedContents = "A new sample file";
    const contentsBuffer = Buffer.from(expectedContents, "utf-8");

    let result = await Ipfs_Module.addFile({ data: contentsBuffer }, client);

    expect(result.error).toBeFalsy();

    expect(result.data).toBeTruthy();

    const addedFileBuffer = await ipfs.cat(result.data as string);

    expect(contentsBuffer).toEqual(addedFileBuffer);
  });
});
