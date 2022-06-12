import path from "path";
import { FileSystemWrapperValidator } from "../../FileSystemWrapperValidator";
import { ValidationFailReason } from "../../WrapperValidator";

jest.setTimeout(200000);

const testWrappersPath = path.join(__dirname, "../wrappers");

describe("manfiests", () => {
  let validator: FileSystemWrapperValidator;

  beforeAll(async () => {
    validator = new FileSystemWrapperValidator({
      maxSize: 1_000_000,
      maxFileSize: 100_000,
      maxModuleSize: 100_000,
      maxNumberOfFiles: 1000,
    });
  });

  it("fails validating an invalid wrap manifest", async () => {
    const pathToInvalidWrapper = path.join(
      testWrappersPath,
      "invalid-wrap-manifest"
    );

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.InvalidWrapManifest);
  });

  it("fails validating when multiple wrap manifests", async () => {
    const pathToInvalidWrapper = path.join(
      testWrappersPath,
      "multiple-wrap-manifests"
    );

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(
      ValidationFailReason.MultipleWrapManifests
    );
  });

  it("fails validating when wrap manifest not found", async () => {
    const pathToInvalidWrapper = path.join(
      testWrappersPath,
      "missing-wrap-manifest"
    );

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(
      ValidationFailReason.WrapManifestNotFound
    );
  });

  it("fails validating an invalid build manifest", async () => {
    const pathToInvalidWrapper = path.join(
      testWrappersPath,
      "invalid-build-manifest"
    );

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(
      ValidationFailReason.InvalidBuildManifest
    );
  });

  it("fails validating an invalid meta manifest", async () => {
    const pathToInvalidWrapper = path.join(
      testWrappersPath,
      "invalid-meta-manifest"
    );

    const result = validator.validate(pathToInvalidWrapper);

    expect(result.valid).toBeFalsy();
    expect(result.failReason).toEqual(ValidationFailReason.InvalidMetaManifest);
  });
});
