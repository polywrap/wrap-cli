import { ModuleKind, ModuleResolutionKind, transpile } from "typescript";
import fs from "fs";
import path from "path";

export function isTypescriptFile(path: string): boolean {
  return path.endsWith(".ts");
}

export async function importTypescriptModule(tsPath: string): Promise<unknown> {
  const tsFileContent = fs.readFileSync(tsPath);
  const jsFileContent = transpile(tsFileContent.toString(), {
    esModuleInterop: true,
    moduleResolution: ModuleResolutionKind.NodeJs,
    module: ModuleKind.CommonJS,
  });
  const jsFilePath = path.join(
    path.dirname(tsPath),
    `.${path.basename(tsPath, ".ts")}.js`
  );
  fs.writeFileSync(jsFilePath, jsFileContent, { flag: "w" });
  const importedModule = await import(jsFilePath);
  fs.unlinkSync(jsFilePath);
  return importedModule;
}
