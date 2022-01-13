import { transpile } from "typescript";
import fs from "fs";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function importTs(tsPath: string): Promise<any> {
  const tsFileContent = fs.readFileSync(tsPath);
  const jsFileContent = transpile(tsFileContent.toString());
  const jsFilePath = path.join(
    path.dirname(tsPath),
    `.${path.basename(tsPath, ".ts")}.js`
  );
  fs.writeFileSync(jsFilePath, jsFileContent, { flag: "w" });
  const importedModule = await import(jsFilePath);
  fs.unlinkSync(jsFilePath);
  return importedModule;
}
