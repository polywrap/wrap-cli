import path from "path";
import { WrapperValidator } from "..";
import { FileSystemPackageReader } from "../types";

jest.setTimeout(200000);

const testWrappersPath = path.join(__dirname, "./wrappers");

describe("sanity", () => {
  it("can validate a valid wrapper", async () => {
    const pathToValidWrapper = path.join(testWrappersPath, "valid");
    const reader = new FileSystemPackageReader(pathToValidWrapper);

    const validator = new WrapperValidator({
      maxSize: 1_000_000,
      maxFileSize: 100_000,
      maxModuleSize: 100_000,
      maxNumberOfFiles: 1000,
    });

    const result = await validator.validate(reader);

    expect(result.valid).toBeTruthy();
    expect(result.failReason).toEqual(undefined);
  });
});
