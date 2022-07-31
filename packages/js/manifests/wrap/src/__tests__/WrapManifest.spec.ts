import { WrapManifest, deserializeWrapManifest } from "..";
import { msgpackEncode } from "@polywrap/msgpack-js";

const testManifest: WrapManifest = {
  abi: {
    objectTypes: [
      {
        type: "SampleResult",
        kind: 1,
        properties: [
          {
            type: "String",
            name: "value",
            required: true,
            kind: 34,
            scalar: {
              type: "String",
              name: "value",
              required: true,
              kind: 4,
            },
          },
        ],
        interfaces: [],
      },
    ],
    enumTypes: [],
    interfaceTypes: [],
    importedObjectTypes: [],
    importedModuleTypes: [],
    importedEnumTypes: [],
    importedEnvTypes: [],
    moduleType: {
      type: "Module",
      kind: 128,
      methods: [
        {
          type: "Method",
          name: "sampleMethod",
          required: true,
          kind: 64,
          arguments: [
            {
              type: "String",
              name: "arg",
              required: true,
              kind: 34,
              scalar: {
                type: "String",
                name: "arg",
                required: true,
                kind: 4,
              },
            },
          ],
          return: {
            type: "SampleResult",
            name: "sampleMethod",
            required: true,
            kind: 34,
            object: {
              type: "SampleResult",
              name: "sampleMethod",
              required: true,
              kind: 8192,
            },
          },
        },
      ],
      imports: [],
      interfaces: [],
    },
  },
  name: "template-wasm-as",
  type: "wasm",
  version: "0.1.0",
};

describe("Polywrap Manifest Validation", () => {
  it("Should succeed", async () => {
    const manifest = msgpackEncode(testManifest);
    expect(await deserializeWrapManifest(manifest)).toMatchObject(testManifest);
  });

  it("Should throw incorrect version format error", async () => {
    const manifest = msgpackEncode({
      ...testManifest,
      version: "bad-str",
    });

    await expect(() => deserializeWrapManifest(manifest)).rejects.toThrow(
      /Unrecognized WrapManifest schema version/
    );
  });

  it("Should throw not accepted field error", async () => {
    const manifest = msgpackEncode({
      ...testManifest,
      not_accepted_field: "not_accepted_field",
    });

    await expect(() => deserializeWrapManifest(manifest)).rejects.toThrow(
      /not allowed to have the additional property "not_accepted_field"/
    );
  });

  it("Should throw required field missing error", async () => {
    const manifest = msgpackEncode({
      ...testManifest,
      name: undefined,
    });

    await expect(() => deserializeWrapManifest(manifest)).rejects.toThrow(
      /instance requires property "name"/
    );
  });

  it("Should throw if name field incorrect patterh", async () => {
    const manifest = msgpackEncode({
      ...testManifest,
      name: "foo bar baz $%##$@#$@#$@#$#$",
    });

    await expect(() => deserializeWrapManifest(manifest)).rejects.toThrow(
      /instance.name does not match pattern/
    );
  });

  it("Should throw wrong type error", async () => {
    const manifest = msgpackEncode({
      ...testManifest,
      abi: true,
    });

    await expect(() => deserializeWrapManifest(manifest)).rejects.toThrow(
      /instance.abi is not of a type\(s\) object/
    );
  });
});
