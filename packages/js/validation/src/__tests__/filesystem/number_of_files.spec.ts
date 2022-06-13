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

describe("number of files", () => {
  it("sanity", async () => {
    assertValidWrapper(path.join(testWrappersPath, "more-than-6-files"));
  });

  it("fails validating when too many files", async () => {
    const pathToInvalidWrapper = path.join(
      testWrappersPath,
      "more-than-6-files"
    );

    const validator = new FileSystemWrapperValidator({
      maxSize: 1_000_000,
      maxFileSize: 100_000,
      maxModuleSize: 100_000,
      maxNumberOfFiles: 6,
    });

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.TooManyFiles);
  });
});
