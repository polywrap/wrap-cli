import fs from "fs";
import path from "path";
import { WasmPackage } from "@polywrap/wasm-js";

async function main() {
  const embedsDir = path.join(__dirname, "../src/__tests__/embeds");
  const embedsDirents = fs.readdirSync(embedsDir, { withFileTypes: true });

  const wrapperDirs: string[] = [];

  for (const dirent of embedsDirents) {
    if (dirent.isDirectory()) {
      wrapperDirs.push(path.join(embedsDir, dirent.name));
    }
  }

  for (const wrapperDir of wrapperDirs) {
    const wasmBytes = fs.readFileSync(path.join(wrapperDir, "wrap.wasm"));
    const infoBytes = fs.readFileSync(path.join(wrapperDir, "wrap.info"));

    try {
      // Make sure we can load the wasm module
      const tryLoad = WasmPackage.from(infoBytes, wasmBytes);
      const result = await tryLoad.getManifest();
      if (!result.ok) throw result.error;
    } catch (err) {
      throw Error(`Unable to load wrapper at ${wrapperDir}`);
    }

    fs.writeFileSync(
      path.join(wrapperDir, "wrap.ts"),
      `// NOTE: This file is auto-generated, do not modify by hand!
// See: ./scripts/embed-wrappers.ts
import { WasmPackage } from "@polywrap/wasm-js";
import toUint8Array from "base64-to-uint8array";

const wrap_wasm = toUint8Array(
  "${wasmBytes.toString("base64")}"
);

const wrap_info = toUint8Array(
  "${infoBytes.toString("base64")}"
);

export const wasmPackage = WasmPackage.from(
  wrap_info,
  wrap_wasm
);
`
    );
  }
}

main()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.abort();
  });
