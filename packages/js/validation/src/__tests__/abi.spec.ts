import path from "path";
import {
  FileSystemPackageReader,
  ValidationFailReason,
  WasmPackageValidator,
} from "..";
import { convertWrapInfoJsonToMsgpack } from "./utils";

jest.setTimeout(200000);

const testWrappersPath = path.join(__dirname, "./wrappers");

describe("abi", () => {
  let validator: WasmPackageValidator;

  beforeAll(async () => {
    validator = new WasmPackageValidator({
      maxSize: 1_000_000,
      maxFileSize: 1_000_000,
      maxModuleSize: 1_000_000,
      maxNumberOfFiles: 1000,
    });

    convertWrapInfoJsonToMsgpack();
  });

  it("fails validating wrapper with missing abi", async () => {
    const reader = new FileSystemPackageReader(
      path.join(testWrappersPath, "missing-abi")
    );

    const result = await validator.validate(reader);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.AbiNotFound);
  });

  it("fails validating invalid abi format", async () => {
    const reader = new FileSystemPackageReader(
      path.join(testWrappersPath, "invalid-abi")
    );

    const result = await validator.validate(reader);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.InvalidAbi);
  });
});
