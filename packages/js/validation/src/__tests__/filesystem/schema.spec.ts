import path from "path";
import { FileSystemWrapperValidator } from "../../filesystem/FileSystemWrapperValidator";
import { ValidationFailReason } from "../../base";

jest.setTimeout(200000);

const testWrappersPath = path.join(__dirname, "../wrappers");

describe("schema", () => {
  let validator: FileSystemWrapperValidator;

  beforeAll(async () => {
    validator = new FileSystemWrapperValidator({
      maxSize: 1_000_000,
      maxFileSize: 100_000,
      maxModuleSize: 100_000,
      maxNumberOfFiles: 1000,
    });
  });

  it("fails validating wrapper with missing schema", async () => {
    const pathToInvalidWrapper = path.join(testWrappersPath, "missing-schema");

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.SchemaNotFound);
  });

  it("fails validating invalid schema file", async () => {
    const pathToInvalidWrapper = path.join(testWrappersPath, "invalid-schema");

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.InvalidSchema);
  });
});
