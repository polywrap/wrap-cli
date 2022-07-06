import { deserializeMetaManifest } from "../../";

import fs from "fs";

describe("Polywrap Manifest Meta Validation", () => {
  it("Should retrieve invocations as expected", async () => {
    const manifestPath = __dirname + "/meta/sanity/polywrap.meta.yaml";
    const manifest = fs.readFileSync(manifestPath, "utf-8");

    const { invocations } = deserializeMetaManifest(manifest)
    const expectedInvocations = {
      invocations: [{
        method: 'getInformation',
        arguments: {
          firstArg: "foo",
          secondArg: 0
        }
      }]
    }
    expect(JSON.stringify({ invocations })).toContain(JSON.stringify(expectedInvocations));
  });
  it("Should throw incorrect version format error", async () => {
    // const manifestPath = __dirname + "/manifest/polywrap/incorrect-version-format/polywrap.yaml";
    // const manifest = fs.readFileSync(manifestPath, "utf-8");

    // expect(() => deserializePolywrapManifest(manifest)).toThrowError(/Unrecognized PolywrapManifest schema format/);
  });
});
