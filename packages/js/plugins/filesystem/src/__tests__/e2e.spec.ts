import { filesystemPlugin } from "../index";
import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";
import { Filesystem_Module, Filesystem_EncodingEnum } from "../wrap";
import fs from "fs";
import path from "path";
import filesystemEncodingToBufferEncoding from "../utils/filesystemEncodingToBufferEncoding";

jest.setTimeout(360000);

describe("Filesystem plugin", () => {
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

    const config: Partial<PolywrapClientConfig> = {
      plugins: [
        {
          uri: "wrap://ens/fs.polywrap.eth",
          plugin: filesystemPlugin({ query: {}, mutation: {} }),
        },
      ],
    };
    client = new PolywrapClient(config);
  });

  afterEach(async () => {
    await cleanUpTempFiles();
  });

  it("can read a file", async () => {
    const expectedContents = await fs.promises.readFile(sampleFilePath);

    const result = await Filesystem_Module.readFile(
      { path: sampleFilePath },
      client
    );

    expect(result.error).toBeFalsy();
    expect(result.data).toEqual(expectedContents);
  });

  it("should fail reading a nonexistent file", async () => {
    const nonExistentFilePath = path.resolve(__dirname, "nonexistent.txt");

    const result = await Filesystem_Module.readFile(
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

    const result = await Filesystem_Module.readFileAsString(
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
      const result = await Filesystem_Module.readFileAsString(
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
    const result_fileExists = await Filesystem_Module.exists(
      { path: sampleFilePath },
      client
    );

    expect(result_fileExists.error).toBeFalsy();
    expect(result_fileExists.data).toBe(true);

    const nonExistentFilePath = path.resolve(
      __dirname,
      "samples/this-file-should-not-exist.txt"
    );

    const result_fileMissing = await Filesystem_Module.exists(
      { path: nonExistentFilePath },
      client
    );

    expect(result_fileMissing.error).toBeFalsy();
    expect(result_fileMissing.data).toBe(false);
  });

  it("should write byte data to a file", async () => {
    const bytes = new Uint8Array([0, 1, 2, 3]);

    const result = await Filesystem_Module.writeFile(
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

    const result = await Filesystem_Module.rm({ path: tempFilePath }, client);

    expect(result.error).toBeFalsy();
    expect(result.data).toBe(true);

    const fileExists = fs.existsSync(tempFilePath);

    expect(fileExists).toBe(false);
  });

  it("should remove a directory with files recursively", async () => {
    const fileInDirPath = path.resolve(tempDirPath, "inner.txt");

    await fs.promises.mkdir(tempDirPath);

    await fs.promises.writeFile(fileInDirPath, "test file contents", {
      encoding: "utf-8",
    });

    const result = await Filesystem_Module.rm(
      { path: tempDirPath, recursive: true },
      client
    );

    expect(result.error).toBeFalsy();
    expect(result.data).toBe(true);

    const fileExists = fs.existsSync(fileInDirPath);

    expect(fileExists).toBe(false);
  });

  it("should create a directory", async () => {
    const result = await Filesystem_Module.mkdir({ path: tempDirPath }, client);

    expect(result.data).toBe(true);

    let directoryExists = fs.existsSync(tempDirPath);

    expect(directoryExists).toBe(true);
  });

  it("should create a directory recursively", async () => {
    const dirInDirPath = path.resolve(tempDirPath, "inner");

    const result = await Filesystem_Module.mkdir(
      { path: dirInDirPath, recursive: true },
      client
    );

    expect(result.data).toBe(true);

    let directoryExists = fs.existsSync(dirInDirPath);

    expect(directoryExists).toBe(true);
  });

  it("should remove a directory", async () => {
    await fs.promises.mkdir(tempDirPath);

    const result = await Filesystem_Module.rmdir({ path: tempDirPath }, client);

    expect(result.data).toBe(true);

    const directoryExists = fs.existsSync(tempDirPath);

    expect(directoryExists).toBe(false);
  });
});
