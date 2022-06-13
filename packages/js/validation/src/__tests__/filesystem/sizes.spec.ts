import path from "path";
import { FileSystemWrapperValidator } from "../../filesystem/FileSystemWrapperValidator";
import { ValidationFailReason } from "../../base";

jest.setTimeout(200000);

const testWrappersPath = path.join(__dirname, "../wrappers");

const assertValidWrapper = (wrapperPath: string) => {
  const validator = new FileSystemWrapperValidator({
    maxSize: 1_000_000,
    maxFileSize: 100_000,
    maxModuleSize: 100_000,
    maxNumberOfFiles: 1000,
  });

  const result = validator.validate(wrapperPath);

  expect(result.valid).toBeTruthy();
  expect(result.failReason).toEqual(undefined);
};

describe("manfiests", () => {
  it("sanity", async () => {
    assertValidWrapper(path.join(testWrappersPath, "wrapper-size-over-30-kb"));
    assertValidWrapper(path.join(testWrappersPath, "file-size-over-30-kb"));
    assertValidWrapper(path.join(testWrappersPath, "module-size-over-30-kb"));
  });

  it("fails validating a large wrapper", async () => {
    const pathToInvalidWrapper = path.join(
      testWrappersPath,
      "wrapper-size-over-30-kb"
    );

    const validator = new FileSystemWrapperValidator({
      maxSize: 30_000,
      maxFileSize: 100_000,
      maxModuleSize: 100_000,
      maxNumberOfFiles: 1000,
    });

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.WrapperTooLarge);
  });

  it("fails validating a large file", async () => {
    const pathToInvalidWrapper = path.join(
      testWrappersPath,
      "module-size-over-30-kb"
    );

    const validator = new FileSystemWrapperValidator({
      maxSize: 1_000_000,
      maxFileSize: 30_000,
      maxModuleSize: 100_000,
      maxNumberOfFiles: 1000,
    });

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.FileTooLarge);
  });

  it("fails validating a large module", async () => {
    const pathToInvalidWrapper = path.join(
      testWrappersPath,
      "module-size-over-30-kb"
    );

    const validator = new FileSystemWrapperValidator({
      maxSize: 1_000_000,
      maxFileSize: 100_000,
      maxModuleSize: 30_000,
      maxNumberOfFiles: 1000,
    });

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.ModuleTooLarge);
  });
});
