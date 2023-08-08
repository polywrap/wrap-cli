import { GetPathToCliTestFiles } from "@polywrap/test-cases";
import { readDirContents } from "../../lib/defaults/deploy-modules/ipfs/utils";
import path from "path";

describe("IPFS Deployer", () => {
  const sampleBuildDir = path.join(
    GetPathToCliTestFiles(),
    "lib",
    "deployers",
    "mock-build-output"
  );

  it("properly reads build dir contents and builds out an IPFS-compatible directory entry", async () => {
    const dirents = await readDirContents(sampleBuildDir, "");

    expect(dirents).toMatchObject({
      name: "",
      files: [{ name: "wrap.info" }, { name: "wrap.wasm" }],
      directories: [
        {
          name: "docs",
          files: [{ name: "polywrap.docs.json" }],
          directories: [
            {
              name: "pages",
              files: [{ name: "readme.md" }],
            },
          ],
        },
      ],
    });
  });
});
