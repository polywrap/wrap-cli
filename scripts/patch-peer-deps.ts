import rimraf from "rimraf";
import path from "path";

const packagesToPatch = [
  "@polywrap/concurrent-plugin-js",
  "@polywrap/ethereum-provider-js-v1",
  "@polywrap/ethereum-provider-js-v2",
  "@polywrap/file-system-plugin-js",
  "@polywrap/http-plugin-js",
  "@polywrap/logger-plugin-js"
];

function main () {
  for (const packageToPatch of packagesToPatch) {
    rimraf.sync(
      path.join(
        __dirname,
        "../node_modules",
        packageToPatch,
        "node_modules/@polywrap/core-js"
      )
    );
  }
}

main();
