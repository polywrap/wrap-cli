import { filesystemPlugin } from "../index";
import { Web3ApiClient, Web3ApiClientConfig } from "@web3api/client-js";
import { Filesystem_EncodingEnum, Filesystem_Query } from "../query/w3";
import { Filesystem_Mutation } from "../mutation/w3";
import fs from "fs";
import path from "path";
import { filesystemEncodingToBufferEncoding } from "../utils/encodingUtils";

jest.setTimeout(360000);

describe("Filesystem plugin", () => {
  const sampleFilePath = path.resolve(__dirname, "samples/sample.txt");
  const tempFilePath = path.resolve(__dirname, "samples/tempfile.dat");
  const tempFolderPath = path.resolve(__dirname, "samples/tempfolder");

  let client: Web3ApiClient;

  beforeAll(async () => {
    const config: Partial<Web3ApiClientConfig> = {
      plugins: [
        {
          uri: "w3://ens/fs.web3api.eth",
          plugin: filesystemPlugin({ query: {}, mutation: {} }),
        },
      ],
    };
    client = new Web3ApiClient(config);
  });

  afterEach(async () => {
    // Clean up temp files/folders in case test failed
    if (fs.existsSync(tempFilePath)) {
      await fs.promises.rm(tempFilePath, { force: true, recursive: true });
    }

    if (fs.existsSync(tempFolderPath)) {
      await fs.promises.rm(tempFolderPath, { force: true, recursive: true });
    }
  });

  it("should read a file", async () => {
    const expectedContents = await fs.promises.readFile(sampleFilePath);

    const result = await Filesystem_Query.readFile(
      { path: sampleFilePath },
      client
    );

    expect(result.error).toBeFalsy();
    expect(result.data).toEqual(expectedContents);
  });

  it("should fail reading a nonexistent file", async () => {
    const nonExistentFilePath = `${sampleFilePath}nonexistent`;

    const result = await Filesystem_Query.readFile(
      { path: nonExistentFilePath },
      client
    );

    expect(result.data).toBeFalsy();
    expect(result.error).toBeTruthy();
  });

  it("should read a UTF8-encoded file as a string", async () => {
    let encoding = Filesystem_EncodingEnum.UTF8;

    const expectedContents = await fs.promises.readFile(sampleFilePath, {
      encoding: filesystemEncodingToBufferEncoding(encoding),
    });

    const result = await Filesystem_Query.readFileAsString(
      { path: sampleFilePath, encoding: Filesystem_EncodingEnum.UTF8 },
      client
    );

    expect(result.error).toBeFalsy();
    expect(result.data).toBe(expectedContents);
  });

  it("should read a file using supported encodings as a string", async () => {
    let supportedEncodings = [
      Filesystem_EncodingEnum.ASCII,
      Filesystem_EncodingEnum.BASE64,
      Filesystem_EncodingEnum.BASE64URL,
      Filesystem_EncodingEnum.BINARY,
      Filesystem_EncodingEnum.HEX,
      Filesystem_EncodingEnum.LATIN1,
      Filesystem_EncodingEnum.UCS2,
      Filesystem_EncodingEnum.UTF16LE,
      Filesystem_EncodingEnum.UTF8,
    ];

    for (const encoding of supportedEncodings) {
      const result = await Filesystem_Query.readFileAsString(
        { path: sampleFilePath, encoding: encoding },
        client
      );

      expect(result.error).toBeFalsy();

      const expectedContents = await fs.promises.readFile(sampleFilePath, {
        encoding: filesystemEncodingToBufferEncoding(encoding),
      });

      expect(result.data).toBe(expectedContents);
    }
  });

  it("should return whether a file exists or not", async () => {
    const result_fileExists = await Filesystem_Query.exists(
      { path: sampleFilePath },
      client
    );

    expect(result_fileExists.error).toBeFalsy();
    expect(result_fileExists.data).toBe(true);

    const nonExistentFilePath = path.resolve(
      __dirname,
      "samples/this-file-should-not-exist.txt"
    );

    const result_fileMissing = await Filesystem_Query.exists(
      { path: nonExistentFilePath },
      client
    );

    expect(result_fileMissing.error).toBeFalsy();
    expect(result_fileMissing.data).toBe(false);
  });

  it("should write byte data to a file", async () => {
    const bytes = new Uint8Array([0, 1, 2, 3]);

    const result = await Filesystem_Mutation.writeFile(
      { data: bytes, path: tempFilePath },
      client
    );

    const expectedFileContents = new Uint8Array(
      await fs.promises.readFile(tempFilePath)
    );

    expect(result.error).toBeFalsy();
    expect(result.data).toBe(true);
    expect(expectedFileContents).toEqual(bytes);
  });

  it("should remove a file", async () => {
    await fs.promises.writeFile(tempFilePath, "test file contents", {
      encoding: "utf-8",
    });

    const result = await Filesystem_Mutation.rm({ path: tempFilePath }, client);

    expect(result.error).toBeFalsy();
    expect(result.data).toBe(true);

    const fileExists = fs.existsSync(tempFilePath);

    expect(fileExists).toBe(false);
  });

  it("should remove a file recursively", async () => {
    const fileInFolderPath = path.resolve(tempFolderPath, "inner.txt");

    await fs.promises.mkdir(tempFolderPath);

    await fs.promises.writeFile(fileInFolderPath, "test file contents", {
      encoding: "utf-8",
    });

    const result = await Filesystem_Mutation.rm(
      { path: tempFolderPath, recursive: true },
      client
    );

    expect(result.error).toBeFalsy();
    expect(result.data).toBe(true);

    const fileExists = fs.existsSync(fileInFolderPath);

    expect(fileExists).toBe(false);
  });

  it("should create a folder", async () => {
    const result = await Filesystem_Mutation.mkdir(
      { path: tempFolderPath },
      client
    );

    expect(result.data).toBe(true);

    let directoryExists = fs.existsSync(tempFolderPath);

    expect(directoryExists).toBe(true);
  });

  it("should create a folder recursively", async () => {
    const folderInFolderPath = path.resolve(tempFolderPath, "inner");

    const result = await Filesystem_Mutation.mkdir(
      { path: folderInFolderPath, recursive: true },
      client
    );

    expect(result.data).toBe(true);

    let directoryExists = fs.existsSync(folderInFolderPath);

    expect(directoryExists).toBe(true);
  });

  it("should remove a folder", async () => {
    await fs.promises.mkdir(tempFolderPath);

    const result = await Filesystem_Mutation.rmdir(
      { path: tempFolderPath },
      client
    );

    expect(result.data).toBe(true);

    const directoryExists = fs.existsSync(tempFolderPath);

    expect(directoryExists).toBe(false);
  });
});
