import {
  WrapManifest,
  deserializeWrapManifest
} from "..";
import {
  msgpackEncode
} from "@polywrap/msgpack-js";

const testManifest: WrapManifest = {
  version: "0.0.1",
  type: "wasm",
  name: "dog-cat",
  abi: {}
};

describe("Polywrap Manifest Validation", () => {
  it("Should succeed", () => {
    const manifest = msgpackEncode(testManifest);
    expect(deserializeWrapManifest(manifest)).toMatchObject(testManifest);
  });

  it("Should throw incorrect version format error", () => {
    const manifest = msgpackEncode({
      ...testManifest,
      version: "bad-str"
    });

    expect(() => deserializeWrapManifest(manifest)).toThrowError(/Unrecognized WrapManifest schema version/);
  });

  it("Should throw not accepted field error", () => {
    const manifest = msgpackEncode({
      ...testManifest,
      not_accepted_field: "not_accepted_field"
    });

    expect(() => deserializeWrapManifest(manifest)).toThrowError(/not allowed to have the additional property "not_accepted_field"/);
  });

  it("Should throw required field missing error", () => {
    const manifest = msgpackEncode({
      ...testManifest,
      name: undefined
    });

    expect(() => deserializeWrapManifest(manifest)).toThrowError(/instance requires property "name"/);
  });

  it("Should throw if name field incorrect patterh", () => {
    const manifest = msgpackEncode({
      ...testManifest,
      name: "foo bar baz $%##$@#$@#$@#$#$"
    });

    expect(() => deserializeWrapManifest(manifest)).toThrowError(/instance.name does not match pattern/);
  });

  it("Should throw wrong type error", () => {
    const manifest = msgpackEncode({
      ...testManifest,
      abi: true
    });

    expect(() => deserializeWrapManifest(manifest)).toThrowError(/instance.abi is not of a type\(s\) object/);
  });
});
