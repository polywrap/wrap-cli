import { ValidationResult, WrapperValidator } from "./WrapperValidator";

import path from "path";
import fs from "fs";

export type FileSystemValidatorConfig = {
  maxSize: number;
  maxFileSize: number;
  maxModuleSize: number;
  maxNumberOfFiles: number;
};

export class FileSystemWrapperValidator {
  constructor(private config: FileSystemValidatorConfig) {}

  validate(wrapperPath: string): ValidationResult {
    return new WrapperValidator({
      ...this.config,
      readFileAsString: (filePath: string) => {
        return fs.readFileSync(path.join(wrapperPath, filePath), "utf8");
      },
      readFile: (filePath: string) => {
        return fs.readFileSync(path.join(wrapperPath, filePath));
      },
      exists: (itemPath: string) => {
        return fs.existsSync(path.join(wrapperPath, itemPath));
      },
      getStats: (itemPath: string) => {
        const stat = fs.lstatSync(path.join(wrapperPath, itemPath));
        return {
          isFile: stat.isFile(),
          isDir: stat.isDirectory(),
          size: stat.size,
        };
      },
      readDir: (dirPath: string) => {
        return fs.readdirSync(path.join(wrapperPath, dirPath));
      },
    }).validate();
  }
}
