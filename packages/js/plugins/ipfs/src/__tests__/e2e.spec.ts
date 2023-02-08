import { Result, Uri, WrapError } from "@polywrap/core-js";
import {
  initTestEnvironment,
  providers,
  stopTestEnvironment,
} from "@polywrap/test-env-js";

import { Ipfs_Module } from "../wrap";
import { CoreClient } from "@polywrap/core-js";
import { ResultOk } from "@polywrap/result";
import { PolywrapClient } from "@polywrap/client-js";
import createIpfsClient, {
  IpfsClient,
  IpfsFileInfo,
} from "@polywrap/ipfs-http-client-lite";
import { UriResolver } from "@polywrap/uri-resolvers-js";
import { ipfsPlugin } from "..";

jest.setTimeout(300000);

describe("IPFS Plugin", () => {
  let client: CoreClient;
  let ipfs: IpfsClient;

  const sampleFileTextContents = "Hello World!";
  let sampleFileIpfsInfo: IpfsFileInfo;
  const sampleFileBuffer = Buffer.from(sampleFileTextContents, "utf-8");

  beforeAll(async () => {
    await initTestEnvironment();
    ipfs = createIpfsClient(providers.ipfs);

    client = new PolywrapClient(
      {
        envs: [
          {
            uri: "wrap://ens/ipfs.polywrap.eth",
            env: { provider: providers.ipfs },
          },
        ],
        resolver: UriResolver.from({
          uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
          package: ipfsPlugin({}),
        }),
      },
      { noDefaults: true }
    );

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

    if (!result.ok) fail(result.error);

    expect(result.value).toEqual(sampleFileBuffer);
  });

  it("Should resolve a file successfully", async () => {
    expect(sampleFileIpfsInfo).toBeDefined();

    let result = await Ipfs_Module.resolve(
      { cid: sampleFileIpfsInfo.hash.toString() },
      client
    );

    if (!result.ok) fail(result.error);

    expect(result.value).toEqual({
      cid: `/ipfs/${sampleFileIpfsInfo.hash.toString()}`,
      provider: providers.ipfs,
    });
  });

  it("Should add a file successfully", async () => {
    const expectedContents = "A new sample file";
    const contentsBuffer = Buffer.from(expectedContents, "utf-8");

    let result = await Ipfs_Module.addFile({ data: contentsBuffer }, client);

    if (!result.ok) fail(result.error);

    expect(result.value).toBeTruthy();

    const addedFileBuffer = await ipfs.cat(result.value as string);

    expect(contentsBuffer).toEqual(addedFileBuffer);
  });

  it("Should timeout within a specified amount of time - env and options", async () => {
    const createRacePromise = (
      timeout: number
    ): Promise<Result<Uint8Array, Error>> => {
      return new Promise<Result<Uint8Array, Error>>((resolve) =>
        setTimeout(() => {
          resolve(ResultOk(Uint8Array.from([1, 2, 3, 4])));
        }, timeout)
      );
    };

    const altClient = new PolywrapClient(
      {
        envs: [
          {
            uri: "wrap://ens/ipfs.polywrap.eth",
            env: {
              provider: providers.ipfs,
              timeout: 1000,
            },
          },
        ],
        resolver: UriResolver.from({
          uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
          package: ipfsPlugin({}),
        }),
      },
      { noDefaults: true }
    );

    const nonExistentFileCid = "Qmaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    const catPromise = Ipfs_Module.cat({ cid: nonExistentFileCid }, altClient);

    let racePromise = createRacePromise(1100);

    let result = await Promise.race([catPromise, racePromise]);

    expect(result).toBeTruthy();
    expect(result.ok).toBeFalsy();
    result = result as { ok: false; error: WrapError | undefined };
    expect(result.error).toBeTruthy();
    expect(result.error?.message).toMatch("Timeout has been reached");
    expect(result.error?.message).toMatch("Timeout: 1000");

    const catPromiseWithTimeoutOverride = Ipfs_Module.cat(
      {
        cid: nonExistentFileCid,
        options: { timeout: 500 },
      },
      altClient
    );

    racePromise = createRacePromise(600);

    let resultForOverride = await Promise.race([
      catPromiseWithTimeoutOverride,
      racePromise,
    ]);

    expect(resultForOverride).toBeTruthy();
    resultForOverride = resultForOverride as {
      ok: false;
      error: Error | undefined;
    };
    expect(resultForOverride.error).toBeTruthy();
    expect(resultForOverride.error?.message).toMatch("Timeout has been reached");
    expect(resultForOverride.error?.message).toMatch("Timeout: 500");
  });

  it("Should use provider from method options", async () => {
    const clientWithBadProvider = new PolywrapClient(
      {
        envs: [
          {
            uri: "wrap://ens/ipfs.polywrap.eth",
            env: {
              provider: "this-provider-doesnt-exist",
            },
          },
        ],
        resolver: UriResolver.from({
          uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
          package: ipfsPlugin({}),
        }),
      },
      { noDefaults: true }
    );

    const catResult = await Ipfs_Module.cat(
      {
        cid: sampleFileIpfsInfo.hash.toString(),
        options: { provider: providers.ipfs },
      },
      clientWithBadProvider
    );

    if (!catResult.ok) fail(catResult.error);
    expect(catResult.value).toEqual(sampleFileBuffer);

    const resolveResult = await Ipfs_Module.resolve(
      {
        cid: sampleFileIpfsInfo.hash.toString(),
        options: { provider: providers.ipfs },
      },
      clientWithBadProvider
    );

    if (!resolveResult.ok) fail(resolveResult.error);
    expect(resolveResult.value).toEqual({
      cid: `/ipfs/${sampleFileIpfsInfo.hash.toString()}`,
      provider: providers.ipfs,
    });
  });

  it("Should use fallback provider from method options", async () => {
    const clientWithBadProvider = new PolywrapClient(
      {
        envs: [
          {
            uri: "wrap://ens/ipfs.polywrap.eth",
            env: {
              provider: "this-provider-doesnt-exist",
            },
          },
        ],
        resolver: UriResolver.from({
          uri: Uri.from("wrap://ens/ipfs.polywrap.eth"),
          package: ipfsPlugin({}),
        }),
      },
      { noDefaults: true }
    );

    const catResult = await Ipfs_Module.cat(
      {
        cid: sampleFileIpfsInfo.hash.toString(),
        options: {
          provider: "this-provider-also-doesnt-exist",
          fallbackProviders: [providers.ipfs],
        },
      },
      clientWithBadProvider
    );

    if (!catResult.ok) fail(catResult.error);
    expect(catResult.value).toEqual(sampleFileBuffer);

    const resolveResult = await Ipfs_Module.resolve(
      {
        cid: sampleFileIpfsInfo.hash.toString(),
        options: {
          provider: "this-provider-also-doesnt-exist",
          fallbackProviders: [providers.ipfs],
        },
      },
      clientWithBadProvider
    );

    if (!resolveResult.ok) fail(resolveResult.error);
    expect(resolveResult.value).toEqual({
      cid: `/ipfs/${sampleFileIpfsInfo.hash.toString()}`,
      provider: providers.ipfs,
    });
  });
});
