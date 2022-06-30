import path from "path";
import {
  FileSystemPackageReader,
  ValidationFailReason,
  WasmPackageValidator,
} from "..";

jest.setTimeout(200000);

const testWrappersPath = path.join(__dirname, "./wrappers");

describe("manifests", () => {
  let validator: WasmPackageValidator;

  beforeAll(async () => {
    validator = new WasmPackageValidator({
      maxSize: 1_000_000,
      maxFileSize: 1_000_000,
      maxModuleSize: 1_000_000,
      maxNumberOfFiles: 1000,
    });
  });

  it("fails validating an invalid wrap manifest", async () => {
    const reader = new FileSystemPackageReader(
      path.join(testWrappersPath, "invalid-wrap-manifest")
    );

    const result = await validator.validate(reader);
    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.InvalidWrapManifest);
  });

  it("fails validating when wrap manifest not found", async () => {
    const reader = new FileSystemPackageReader(
      path.join(testWrappersPath, "missing-wrap-manifest")
    );

    const result = await validator.validate(reader);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(
      ValidationFailReason.WrapManifestNotFound
    );
  });
});
