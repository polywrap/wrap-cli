import { filesystemPlugin } from "../index";
import { Web3ApiClient, Web3ApiClientConfig } from "@web3api/client-js";
import { Filesystem_Query } from "../query/w3";
import { Filesystem_Mutation } from "../mutation/w3";
import fs from "fs";
import path from "path";

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
      fs.rmSync(tempFilePath);
    }

    if (fs.existsSync(tempFolderPath)) {
      fs.rmdirSync(tempFolderPath);
    }
  });

  it("should read a file", async () => {
    const expectedContents = fs.readFileSync(sampleFilePath);

    const fsReadFileResult = await Filesystem_Query.readFile(
      { path: sampleFilePath },
      client
    );

    expect(fsReadFileResult.error).toBeFalsy();
    expect(fsReadFileResult.data).toEqual(expectedContents);
  });

  it("should read an UTF-8 encoded file as a string", async () => {
    const encoding = "utf-8";

    const expectedContents = fs.readFileSync(sampleFilePath, {
      encoding: encoding,
    });

    const fsReadFileAsStringResult = await Filesystem_Query.readFileAsString(
      { path: sampleFilePath, encoding: encoding },
      client
    );

    expect(fsReadFileAsStringResult.error).toBeFalsy();
    expect(fsReadFileAsStringResult.data).toBe(expectedContents);
  });

  it("should return whether a file exists or not", async () => {
    const fsExistsResult_fileExists = await Filesystem_Query.exists(
      { path: sampleFilePath },
      client
    );

    expect(fsExistsResult_fileExists.error).toBeFalsy();
    expect(fsExistsResult_fileExists.data).toBe(true);

    const nonExistentFilePath = path.resolve(
      __dirname,
      "samples/this-file-should-not-exist.txt"
    );

    const fsExistsResult_fileMissing = await Filesystem_Query.exists(
      { path: nonExistentFilePath },
      client
    );

    expect(fsExistsResult_fileMissing.error).toBeFalsy();
    expect(fsExistsResult_fileMissing.data).toBe(false);
  });

  it("should write data to a file and succesfully remove it", async () => {
    const bytes = new Uint8Array([0, 1, 2, 3]);

    const fsWriteFileResult = await Filesystem_Mutation.writeFile(
      { data: bytes, path: tempFilePath },
      client
    );

    const expectedFileContents = new Uint8Array(fs.readFileSync(tempFilePath));

    expect(fsWriteFileResult.error).toBeFalsy();
    expect(fsWriteFileResult.data).toBe(true);
    expect(expectedFileContents).toEqual(bytes);

    const fsRmResult = await Filesystem_Mutation.rm(
      { path: tempFilePath },
      client
    );

    expect(fsRmResult.error).toBeFalsy();
    expect(fsRmResult.data).toBe(true);

    const fileExists = fs.existsSync(tempFilePath);

    expect(fileExists).toBe(false);
  });

  it("should create a folder and successfully remove it", async () => {
    const fsMkdirResult = await Filesystem_Mutation.mkdir(
      { path: tempFolderPath },
      client
    );

    expect(fsMkdirResult.data).toBe(true);

    let directoryExists = fs.existsSync(tempFolderPath);

    expect(directoryExists).toBe(true);

    const fsRmdirResult = await Filesystem_Mutation.rmdir(
      { path: tempFolderPath },
      client
    );

    expect(fsRmdirResult.data).toBe(true);

    directoryExists = fs.existsSync(tempFolderPath);

    expect(directoryExists).toBe(false);
  });
});
