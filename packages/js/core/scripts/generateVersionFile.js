const fs = require("fs");

try {
  fs.writeFileSync(
    `${__dirname}/../src/version.ts`,
    `export const RUNTIME_VERSION = ${
      JSON.stringify(require("../package.json").version)
    };\n`
  );
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
