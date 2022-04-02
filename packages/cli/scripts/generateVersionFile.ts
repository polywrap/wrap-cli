import { name, version } from "../package.json";

import fs from "fs";

try {
  fs.writeFileSync(
    `${__dirname}/../src/version.ts`,
    `export const BUILDER_ID = ${JSON.stringify(`${name}@${version}`)};\n`
  );
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
