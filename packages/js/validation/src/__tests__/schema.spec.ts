import path from "path";
import {
  FileSystemPackageReader,
  ValidationFailReason,
  WasmPackageValidator,
} from "..";

jest.setTimeout(200000);

const testWrappersPath = path.join(__dirname, "./wrappers");

describe("schema", () => {
  let validator: WasmPackageValidator;

  beforeAll(async () => {
    validator = new WasmPackageValidator({
      maxSize: 1_000_000,
      maxFileSize: 1_000_000,
      maxModuleSize: 1_000_000,
      maxNumberOfFiles: 1000,
    });
  });

  it("fails validating wrapper with missing schema", async () => {
    const reader = new FileSystemPackageReader(
      path.join(testWrappersPath, "missing-schema")
    );

    const result = await validator.validate(reader);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.SchemaNotFound);
  });

  it("fails validating invalid schema file", async () => {
    const reader = new FileSystemPackageReader(
      path.join(testWrappersPath, "invalid-schema")
    );

    const result = await validator.validate(reader);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.InvalidSchema);
  });
});
