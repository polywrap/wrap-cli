import { InvokeResult } from "@polywrap/core-js";
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
          plugin: ipfsPlugin({}),
        },
      ],
      envs: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          env: {
            provider: providers.ipfs,
          },
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

  it("Should timeout within a specified amount of time - env and options", async () => {
    const createRacePromise = (
      timeout: number
    ): Promise<InvokeResult<Uint8Array>> => {
      return new Promise<InvokeResult<Uint8Array>>((resolve) =>
        setTimeout(() => {
          resolve({
            data: Uint8Array.from([1, 2, 3, 4]),
            error: undefined,
          });
        }, timeout)
      );
    };

    const altClient = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({}),
        },
      ],
      envs: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          env: {
            provider: providers.ipfs,
            timeout: 1000,
          },
        },
      ],
    });

    const nonExistentFileCid = "Qmaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    const catPromise = Ipfs_Module.cat({ cid: nonExistentFileCid }, altClient);

    let racePromise = createRacePromise(1100);

    const result = await Promise.race([catPromise, racePromise]);

    expect(result).toBeTruthy();
    expect(result.data).toBeFalsy();
    expect(result.error).toBeTruthy();
    expect(result.error?.stack).toMatch("Timeout has been reached");
    expect(result.error?.stack).toMatch("Timeout: 1000");

    const catPromiseWithTimeoutOverride = Ipfs_Module.cat(
      {
        cid: nonExistentFileCid,
        options: { timeout: 500 },
      },
      altClient
    );

    racePromise = createRacePromise(600);

    const resultForOverride = await Promise.race([
      catPromiseWithTimeoutOverride,
      racePromise,
    ]);

    expect(resultForOverride).toBeTruthy();
    expect(resultForOverride.data).toBeFalsy();
    expect(resultForOverride.error).toBeTruthy();
    expect(resultForOverride.error?.stack).toMatch("Timeout has been reached");
    expect(resultForOverride.error?.stack).toMatch("Timeout: 500");
  });

  it("Should use provider from method options", async () => {
    const clientWithBadProvider = new PolywrapClient({
      plugins: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          plugin: ipfsPlugin({}),
        },
      ],
      envs: [
        {
          uri: "wrap://ens/ipfs.polywrap.eth",
          env: {
            provider: "this-provider-doesnt-exist",
          },
        },
      ],
    });

    const catResult = await Ipfs_Module.cat(
      {
        cid: sampleFileIpfsInfo.hash.toString(),
        options: { provider: providers.ipfs },
      },
      clientWithBadProvider
    );

    expect(catResult.error).toBeFalsy();
    expect(catResult.data).toEqual(sampleFileBuffer);

    const resolveResult = await Ipfs_Module.resolve(
      {
        cid: sampleFileIpfsInfo.hash.toString(),
        options: { provider: providers.ipfs },
      },
      clientWithBadProvider
    );

    expect(resolveResult.error).toBeFalsy();
    expect(resolveResult.data).toEqual({
      cid: `/ipfs/${sampleFileIpfsInfo.hash.toString()}`,
      provider: providers.ipfs,
    });
  });
});
