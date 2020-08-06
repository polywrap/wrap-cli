import { WasmWorker } from "../lib/wasm-worker";
import { runW3CLI } from "./helpers";

import fs from "fs";

jest.setTimeout(15000)

describe("Sanity Checking", () => {
  beforeAll(async () => {
    // build the test wasm module
    const { exitCode, stdout, stderr } = await runW3CLI([
      "build",
      `${__dirname}/apis/ipfs-get-put-string/web3api.yaml`,
      "--output-dir",
      `${__dirname}/apis/ipfs-get-put-string/build`,
    ]);

    if (exitCode !== 0) {
      console.error(`w3 exited with code: ${exitCode}`);
      console.log(`stderr:\n${stderr}`)
      console.log(`stdout:\n${stdout}`)
      throw Error("w3 CLI failed");
    }
  });

  it("works", async () => {
    const testCID = "QmTEST_HASH";

    const aw = new WasmWorker(
      fs.readFileSync(`${__dirname}/apis/ipfs-get-put-string/build/query.wasm`), {
        ipfs: {
          _w3_ipfs_cat: async (ptr, cb) => {
            const read = await aw.readStringAsync(ptr);
            expect(read.result).toBe(testCID);
            const write = await aw.writeStringAsync("Hello World!");
            cb(write.result)
          },
          _w3_ipfs_add(ptr, cb) {
            cb(0)
          }
        }
      }
    );

    const testCIDPtr = await aw.writeStringAsync(testCID);
    const call = await aw.callAsync("getString", testCIDPtr.result);

    const read = await aw.readStringAsync(call.result);
    expect(read.result).toBe("Hello World!");
    aw.destroy();
  });
});
