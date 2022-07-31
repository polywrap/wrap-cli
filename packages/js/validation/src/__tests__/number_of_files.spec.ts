import path from "path";
import {
  FileSystemPackageReader,
  ValidationFailReason,
  WasmPackageValidator,
} from "..";
import { convertWrapInfoJsonToMsgpack } from "./utils";

jest.setTimeout(200000);

const testWrappersPath = path.join(__dirname, "./wrappers");

const assertValidWrapper = async (wrapperPath: string) => {
  const reader = new FileSystemPackageReader(wrapperPath);

  const validator = new WasmPackageValidator({
    maxSize: 1_000_000,
    maxFileSize: 1_000_000,
    maxModuleSize: 1_000_000,
    maxNumberOfFiles: 1000,
  });

  const result = await validator.validate(reader);

  expect(result.valid).toBeTruthy();
  expect(result.failReason).toEqual(undefined);
};

describe("number of files", () => {
  beforeAll(() => {
    convertWrapInfoJsonToMsgpack();
  });

  it("sanity", async () => {
    await assertValidWrapper(path.join(testWrappersPath, "more-than-6-files"));
  });

  it("fails validating when too many files", async () => {
    const reader = new FileSystemPackageReader(
      path.join(testWrappersPath, "more-than-6-files")
    );

    const validator = new WasmPackageValidator({
      maxSize: 1_000_000,
      maxFileSize: 1_000_000,
      maxModuleSize: 1_000_000,
      maxNumberOfFiles: 6,
    });

    const result = await validator.validate(reader);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.TooManyFiles);
  });
});
