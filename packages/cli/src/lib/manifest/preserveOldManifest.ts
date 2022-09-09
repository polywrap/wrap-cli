import fs from "fs";
import path from "path";

export function preserveOldManifest(filePath: string): string {
  const polywrapDirectory = ".polywrap";
  const oldManifestsDirectory = "manifest";

  const fileName = path.basename(filePath);

  const outputFilePath = path.join(
    polywrapDirectory,
    oldManifestsDirectory,
    fileName
  );
  const outputFileDir = path.dirname(outputFilePath);

  if (!fs.existsSync(outputFileDir)) {
    fs.mkdirSync(outputFileDir, { recursive: true });
  }

  fs.copyFileSync(filePath, outputFilePath);

  return outputFilePath;
}
