import path from "path";
import { WasmPackageValidator, FileSystemPackageReader } from "..";

jest.setTimeout(200000);

const testWrappersPath = path.join(__dirname, "./wrappers");

describe("sanity", () => {
  it("can validate a valid wasm wrapper", async () => {
    const pathToValidWrapper = path.join(testWrappersPath, "valid");
    const reader = new FileSystemPackageReader(pathToValidWrapper);

    const validator = new WasmPackageValidator({
      maxSize: 1_000_000,
      maxFileSize: 1_000_000,
      maxModuleSize: 1_000_000,
      maxNumberOfFiles: 1000,
    });

    const result = await validator.validate(reader);

    expect(result.valid).toBeTruthy();
    expect(result.failReason).toEqual(undefined);
  });

  it("can validate a valid wrapper interface", async () => {
    const pathToValidWrapper = path.join(testWrappersPath, "valid-interface");
    const reader = new FileSystemPackageReader(pathToValidWrapper);

    const validator = new WasmPackageValidator({
      maxSize: 1_000_000,
      maxFileSize: 1_000_000,
      maxModuleSize: 1_000_000,
      maxNumberOfFiles: 1000,
    });

    const result = await validator.validate(reader);

    expect(result.valid).toBeTruthy();
    expect(result.failReason).toEqual(undefined);
  });
});
