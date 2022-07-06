import { msgpackEncode } from "@polywrap/msgpack-js";
import { writeFileSync } from "@polywrap/os-js";
import fs from "fs";
import path from "path";

export function convertWrapInfoJsonToMsgpack() {
  const root = path.join(__dirname, "wrappers");
  const dirs = fs.readdirSync(root, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => path.join(root, dirent.name));

  for (const dir of dirs) {
    const wrapInfoJsonPath = path.join(dir, "wrap.info.json"); 

    if (fs.existsSync(wrapInfoJsonPath)) {
      const json = JSON.parse(
        fs.readFileSync(wrapInfoJsonPath, "utf-8")
      );

      const msgpack = msgpackEncode(json);

      writeFileSync(
        path.join(dir, "wrap.info"),
        msgpack,
        { encoding: "binary" }
      );
    }
  }
}
