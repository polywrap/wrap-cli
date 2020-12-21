import { Uri } from "../";

describe("Uri", () => {
  it("Inserts a w3:// scheme when one is not present", () => {
    const uri = new Uri("/authority-v2/path.to.thing.root/sub/path");

    expect(uri.uri).toEqual("w3://authority-v2/path.to.thing.root/sub/path")
    expect(uri.authority).toEqual("authority-v2");
    expect(uri.path).toEqual("path.to.thing.root/sub/path");
  });

  it("isUri fails when given something that's not a URI", () => {
    expect(Uri.isUri("not a Uri object" as any)).toBeFalsy();
  });

  it("Fails if an authority is not present", () => {
    expect(() => new Uri("w3://path")).toThrowError(/URI is malformed,/);
  });

  it("Fails if a path is not present", () => {
    expect(() => new Uri("w3://authority/")).toThrowError(/URI is malformed,/);
  });

  it("Fails if scheme is not at the beginning", () => {
    expect(() => new Uri("path/w3://something")).toThrowError(/The w3:\/\/ scheme must/);
  });

  it("Fails with an empty string", () => {
    expect(() => new Uri("")).toThrowError("The provided URI is empty");
  });

  it("Returns true if URI is valid", () => {
    expect(Uri.isValidUri("w3://valid/uri")).toBeTruthy();
  });

  it("Returns false if URI is invalid", () => {
    expect(Uri.isValidUri("w3://.....")).toBeFalsy();
  });

  it("Returns a parsed URI configuration from isValidUri", () => {
    const config: any = { };

    expect(Uri.isValidUri("w3://valid/uri", config)).toBeTruthy();
    expect(config).toMatchObject({ uri: "w3://valid/uri", authority: "valid", path: "uri" });
  })
});
