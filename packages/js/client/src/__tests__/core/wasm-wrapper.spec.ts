import {
  buildWrapper,
  initTestEnvironment,
  stopTestEnvironment,
} from "@polywrap/test-env-js";
import {
  Uri,
  PluginModule,
  Subscription,
  PolywrapManifest,
  BuildManifest,
  MetaManifest,
  deserializePolywrapManifest,
  deserializeBuildManifest,
  deserializeMetaManifest,
  msgpackDecode,
} from "../..";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import fs from "fs";
import path from "path";
import { getClient } from "../utils/getClient";

jest.setTimeout(200000);

const simpleWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple`;
const simpleWrapperUri = new Uri(`fs/${simpleWrapperPath}/build`);

const simpleFsWrapperPath = `${GetPathToTestWrappers()}/wasm-as/simple-fs`;
const simpleFsWrapperUri = new Uri(`fs/${simpleFsWrapperPath}/build`);

const tempFilePath = path.resolve(__dirname, "temp.txt");

describe("wasm-wrapper", () => {
  beforeAll(async () => {
    await initTestEnvironment();
    await buildWrapper(simpleWrapperPath);
    await buildWrapper(simpleFsWrapperPath);
    if(fs.existsSync(tempFilePath)){
      await fs.promises.rm(tempFilePath);
    }
  });

  afterAll(async () => {
    await stopTestEnvironment();
    if(fs.existsSync(tempFilePath)){
      await fs.promises.rm(tempFilePath);
    }
  });

  const mockPlugin = () => {
    class MockPlugin extends PluginModule<{}> {
      simpleMethod(_: unknown): string {
        return "plugin response";
      }
    }

    return {
      factory: () => new MockPlugin({}),
      manifest: {
        schema: ``,
        implements: [],
      },
    };
  };

  test("invoke with decode defaulted to true works as expected", async () => {
    const client = await getClient();
    const result = await client.invoke<string>({
      uri: simpleWrapperUri.uri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(typeof result.data).toBe("string");
    expect(result.data).toEqual("test");
  });

  test("invoke with decode set to false works as expected", async () => {
    const client = await getClient();
    const result = await client.invoke({
      uri: simpleWrapperUri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
      encodeResult: true,
    });

    expect(result.error).toBeFalsy();
    expect(result.data).toBeTruthy();
    expect(result.data instanceof Uint8Array).toBeTruthy();
    expect(msgpackDecode(result.data as Uint8Array)).toEqual("test");
  });

  it("should invoke wrapper with custom redirects", async () => {
    const client = await getClient({
      redirects: [
        {
          from: simpleWrapperUri.uri,
          to: "wrap://ens/mock.polywrap.eth",
        },
      ],
      plugins: [
        {
          uri: "wrap://ens/mock.polywrap.eth",
          plugin: mockPlugin(),
        },
      ],
    });

    const result = await client.invoke({
      uri: simpleWrapperUri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
    });

    expect(result.data).toBeTruthy();
    expect(result.data).toEqual("plugin response");
  });

  it("should allow query time redirects", async () => {
    const client = await getClient({
      plugins: [
        {
          uri: "wrap://ens/mock.polywrap.eth",
          plugin: mockPlugin(),
        },
      ],
    });

    const redirects = [
      {
        from: simpleWrapperUri.uri,
        to: "wrap://ens/mock.polywrap.eth",
      },
    ];

    const result = await client.invoke({
      uri: simpleWrapperUri.uri,
      method: "simpleMethod",
      args: {
        arg: "test",
      },
      config: {
        redirects,
      },
    });

    expect(result.data).toBeTruthy();
    expect(result.data).toEqual("plugin response");
  });

  test("getManifest -- polywrap manifest, build manifest, meta manifest", async () => {
    const client = await getClient();

    const actualManifestStr: string = fs.readFileSync(
      `${simpleWrapperPath}/build/polywrap.json`,
      "utf8"
    );
    const actualManifest: PolywrapManifest = deserializePolywrapManifest(
      actualManifestStr
    );
    const manifest: PolywrapManifest = await client.getManifest(
      simpleWrapperUri,
      {
        type: "polywrap",
      }
    );
    expect(manifest).toStrictEqual(actualManifest);

    const actualBuildManifestStr: string = fs.readFileSync(
      `${simpleWrapperPath}/build/polywrap.build.json`,
      "utf8"
    );
    const actualBuildManifest: BuildManifest = deserializeBuildManifest(
      actualBuildManifestStr
    );
    const buildManifest: BuildManifest = await client.getManifest(
      simpleWrapperUri,
      {
        type: "build",
      }
    );
    expect(buildManifest).toStrictEqual(actualBuildManifest);

    const actualMetaManifestStr: string = fs.readFileSync(
      `${simpleWrapperPath}/build/polywrap.meta.json`,
      "utf8"
    );
    const actualMetaManifest: MetaManifest = deserializeMetaManifest(
      actualMetaManifestStr
    );
    const metaManifest: MetaManifest = await client.getManifest(
      simpleWrapperUri,
      {
        type: "meta",
      }
    );
    expect(metaManifest).toStrictEqual(actualMetaManifest);
  });

  test("get file from wrapper", async () => {
    const client = await getClient();

    const schemaStr: string = fs.readFileSync(
      `${simpleWrapperPath}/build/schema.graphql`,
      "utf8"
    );

    const manifest: PolywrapManifest = await client.getManifest(
      simpleWrapperUri,
      {
        type: "polywrap",
      }
    );

    const fileStr: string = (await client.getFile(simpleWrapperUri, {
      path: manifest.schema as string,
      encoding: "utf8",
    })) as string;
    expect(fileStr).toEqual(schemaStr);

    const fileBuffer: Uint8Array = (await client.getFile(simpleWrapperUri, {
      path: manifest.schema!,
    })) as Uint8Array;
    const decoder = new TextDecoder("utf8");
    const text = decoder.decode(fileBuffer);
    expect(text).toEqual(schemaStr);

    await expect(() =>
      client.getManifest(new Uri("wrap://ens/ipfs.polywrap.eth"), {
        type: "polywrap",
      })
    ).rejects.toThrow(
      "client.getManifest(...) is not implemented for Plugins."
    );
    await expect(() =>
      client.getFile(new Uri("wrap://ens/ipfs.polywrap.eth"), {
        path: "./index.js",
      })
    ).rejects.toThrow("client.getFile(...) is not implemented for Plugins.");
  });

  test("subscribe", async () => {
    const client = await getClient();

    // test subscription
    let expectedResults: Uint8Array[] = [];
    let results: Uint8Array[] = [];
    let value = 0;

    const setter = setInterval(async () => {
      const data = new Uint8Array([value++]);
      await fs.promises.writeFile(tempFilePath, data);
      expectedResults.push(data);
    }, 4000);

    const getSubscription: Subscription<Uint8Array> = client.subscribe<Uint8Array>({
      uri: simpleFsWrapperUri.uri,
      method: "readFile",
      args: {
        path: tempFilePath,
      },
      frequency: { ms: 4500 },
    });

    for await (let result of getSubscription) {
      expect(result.error).toBeFalsy();
      const val = result.data;
      if (val !== undefined) {
        results.push(val);
        if (results.length >= 2) {
          break;
        }
      }
    }
    clearInterval(setter);

    expect(results).toStrictEqual(expectedResults);
  });

  test("subscription early stop", async () => {
    const client = await getClient();

    // test subscription
    let results: number[] = [];
    let value = 0;

    const setter = setInterval(async () => {
      const data = new Uint8Array([value++]);
      await fs.promises.writeFile(tempFilePath, data);
    }, 4000);

    const getSubscription: Subscription<Uint8Array> = client.subscribe<Uint8Array>({
      uri: simpleFsWrapperUri.uri,
      method: "readFile",
      args: {
        path: tempFilePath
      },
      frequency: { ms: 4500 },
    });

    new Promise(async () => {
      for await (let result of getSubscription) {
        expect(result.error).toBeFalsy();
        const val = result.data;
        if (val !== undefined) {
          results.push(val[0]);
          if (val[0] >= 2) {
            break;
          }
        }
      }
    });
    await new Promise((r) => setTimeout(r, 8000));
    getSubscription.stop();
    clearInterval(setter);

    expect(results).toContain(0);
    expect(results).not.toContain(2);
  });
});