import { WasmWorker } from "../lib/wasm-worker";
import { runW3CLI } from "./helpers";

import fs from "fs";

jest.setTimeout(15000)

describe("TEST", () => {
  beforeAll(async () => {
    // build & deploy the protocol
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

  it.only("DOES", async () => {
    const aw = new WasmWorker(
      fs.readFileSync(`${__dirname}/apis/ipfs-get-put-string/build/query.wasm`), {
        ipfs: {
          _w3_ipfs_cat(ptr, cb) {
            console.log("IN THE CLALBACK!!!!")
            console.log(ptr);
            cb(1, undefined);
          },
          _w3_ipfs_add(ptr, cb) {
            console.log('HERERER')
            cb(1, undefined)
          },
          // TODO:
          // - receive values (multiple args of different types)
          // - return string
          _w3_ipfs_hello: async (cb) => {
            console.log('meow');
            await new Promise((resolve) => {
              setTimeout(() => {
                console.log('bark')
                resolve()
              }, 2000)
            })
            cb(1, undefined)
          }
        }
      }
    );

    aw.call("getString", "QmSomething", (err, val) => {
      console.log("done", err, val);
      aw.destroy();
    });

    console.log("COMPLETETETEET")
  });
});
