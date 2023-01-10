import { fileSystemPlugin } from "../index";
import { PolywrapClient, Uri } from "@polywrap/client-js";
import { UriResolver } from "@polywrap/uri-resolvers-js";
import { FileSystem_Module, FileSystem_EncodingEnum } from "../wrap";
import fs from "fs";
import path from "path";
import fileSystemEncodingToBufferEncoding from "../utils/fileSystemEncodingToBufferEncoding";
import { WrapError } from "@polywrap/core-js";

jest.setTimeout(360000);

describe("FileSystem plugin", () => {
  const sampleFilePath = path.resolve(__dirname, "samples/sample.txt");
  const tempFilePath = path.resolve(__dirname, "samples/tempfile.dat");
  const tempDirPath = path.resolve(__dirname, "samples/tempdir");

  let client: PolywrapClient;
  const cleanUpTempFiles = async () => {
    if (fs.existsSync(tempFilePath)) {
      await fs.promises.rm(tempFilePath, { force: true });
    }

    if (fs.existsSync(tempDirPath)) {
      await fs.promises.rm(tempDirPath, { force: true, recursive: true });
    }
  };
  beforeAll(async () => {
    await cleanUpTempFiles();

    client = new PolywrapClient(
      {
        resolver: UriResolver.from({
          uri: Uri.from("wrap://ens/fs.polywrap.eth"),
          package: fileSystemPlugin({}),
        }),
      },
      { noDefaults: true }
    );
  });

  afterEach(async () => {
    await cleanUpTempFiles();
  });

  it("can read a file", async () => {
    const expectedContents = await fs.promises.readFile(sampleFilePath);

    const result = await FileSystem_Module.readFile(
      { path: sampleFilePath },
      client
    );

    if (!result.ok) fail(result.error);
    expect(result.value).toEqual(new Uint8Array(expectedContents));
  });

  it("should fail reading a nonexistent file", async () => {
    const nonExistentFilePath = path.resolve(__dirname, "nonexistent.txt");

    let result = await FileSystem_Module.readFile(
      { path: nonExistentFilePath },
      client
    );

    result = result as { ok: false; error: WrapError | undefined };
    expect(result.error).toBeTruthy();
    expect(result.ok).toBeFalsy();
  });

  it("should read a UTF8-encoded file as a string", async () => {
    let encoding = FileSystem_EncodingEnum.UTF8;

    const expectedContents = await fs.promises.readFile(sampleFilePath, {
      encoding: fileSystemEncodingToBufferEncoding(encoding),
    });

    const result = await FileSystem_Module.readFileAsString(
      { path: sampleFilePath, encoding: FileSystem_EncodingEnum.UTF8 },
      client
    );

    if (!result.ok) fail(result.error);
    expect(result.value).toBe(expectedContents);
  });

  it("should read a file using supported encodings as a string", async () => {
    let supportedEncodings = [
      FileSystem_EncodingEnum.ASCII,
      FileSystem_EncodingEnum.UTF8,
      FileSystem_EncodingEnum.UTF16LE,
      FileSystem_EncodingEnum.UCS2,
      FileSystem_EncodingEnum.BASE64,
      FileSystem_EncodingEnum.BASE64URL,
      FileSystem_EncodingEnum.LATIN1,
      FileSystem_EncodingEnum.BINARY,
      FileSystem_EncodingEnum.HEX,
    ];

    for (const encoding of supportedEncodings) {
      const result = await FileSystem_Module.readFileAsString(
        { path: sampleFilePath, encoding: encoding },
        client
      );

      if (!result.ok) fail(result.error);

      const expectedContents = await fs.promises.readFile(sampleFilePath, {
        encoding: fileSystemEncodingToBufferEncoding(encoding),
      });

      expect(result.value).toBe(expectedContents);
    }
  });

  it("should return whether a file exists or not", async () => {
    const result_fileExists = await FileSystem_Module.exists(
      { path: sampleFilePath },
      client
    );

    if (!result_fileExists.ok) fail(result_fileExists.error);
    expect(result_fileExists.value).toBe(true);

    const nonExistentFilePath = path.resolve(
      __dirname,
      "samples/this-file-should-not-exist.txt"
    );

    const result_fileMissing = await FileSystem_Module.exists(
      { path: nonExistentFilePath },
      client
    );

    if (!result_fileMissing.ok) fail(result_fileMissing.error);
    expect(result_fileMissing.value).toBe(false);
  });

  it("should write byte data to a file", async () => {
    const bytes = new Uint8Array([0, 1, 2, 3]);

    const result = await FileSystem_Module.writeFile(
      { data: bytes, path: tempFilePath },
      client
    );

    const expectedFileContents = new Uint8Array(
      await fs.promises.readFile(tempFilePath)
    );

    if (!result.ok) fail(result.error);
    expect(result.value).toBe(true);
    expect(expectedFileContents).toEqual(bytes);
  });

  it("should remove a file", async () => {
    await fs.promises.writeFile(tempFilePath, "test file contents", {
      encoding: "utf-8",
    });

    const result = await FileSystem_Module.rm({ path: tempFilePath }, client);

    if (!result.ok) fail(result.error);
    expect(result.value).toBe(true);

    const fileExists = fs.existsSync(tempFilePath);

    expect(fileExists).toBe(false);
  });

  it("should remove a directory with files recursively", async () => {
    const fileInDirPath = path.resolve(tempDirPath, "inner.txt");

    await fs.promises.mkdir(tempDirPath);

    await fs.promises.writeFile(fileInDirPath, "test file contents", {
      encoding: "utf-8",
    });

    const result = await FileSystem_Module.rm(
      { path: tempDirPath, recursive: true },
      client
    );

    if (!result.ok) fail(result.error);
    expect(result.value).toBe(true);

    const fileExists = fs.existsSync(fileInDirPath);

    expect(fileExists).toBe(false);
  });

  it("should create a directory", async () => {
    const result = await FileSystem_Module.mkdir({ path: tempDirPath }, client);

    if (!result.ok) fail(result.error);
    expect(result.value).toBe(true);

    let directoryExists = fs.existsSync(tempDirPath);

    expect(directoryExists).toBe(true);
  });

  it("should create a directory recursively", async () => {
    const dirInDirPath = path.resolve(tempDirPath, "inner");

    const result = await FileSystem_Module.mkdir(
      { path: dirInDirPath, recursive: true },
      client
    );

    if (!result.ok) fail(result.error);
    expect(result.value).toBe(true);

    let directoryExists = fs.existsSync(dirInDirPath);

    expect(directoryExists).toBe(true);
  });

  it("should remove a directory", async () => {
    await fs.promises.mkdir(tempDirPath);

    const result = await FileSystem_Module.rmdir({ path: tempDirPath }, client);

    if (!result.ok) fail(result.error);
    expect(result.value).toBe(true);

    const directoryExists = fs.existsSync(tempDirPath);

    expect(directoryExists).toBe(false);
  });
});
