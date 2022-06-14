import {
  ValidationResult,
  WrapperValidator,
  WrapperReadOperations,
  WrapperConstraints,
} from "../base";

import path from "path";
import fs from "fs";

const getOpsFromPath = (wrapperPath: string): WrapperReadOperations => {
  return {
    readFileAsString: (filePath: string) => {
      return fs.promises.readFile(path.join(wrapperPath, filePath), "utf8");
    },
    readFile: (filePath: string) => {
      return fs.promises.readFile(path.join(wrapperPath, filePath));
    },
    exists: (itemPath: string) => {
      return Promise.resolve(fs.existsSync(path.join(wrapperPath, itemPath)));
    },
    getStats: async (itemPath: string) => {
      const stat = await fs.promises.lstat(path.join(wrapperPath, itemPath));
      return {
        isFile: stat.isFile(),
        isDir: stat.isDirectory(),
        size: stat.size,
      };
    },
    readDir: (dirPath: string) => {
      return fs.promises.readdir(path.join(wrapperPath, dirPath));
    },
  };
};

export class FileSystemWrapperValidator {
  baseValidator: WrapperValidator;

  constructor(constraints: WrapperConstraints) {
    this.baseValidator = new WrapperValidator(constraints);
  }

  async validate(wrapperPath: string): Promise<ValidationResult> {
    return this.baseValidator.validate(getOpsFromPath(wrapperPath));
  }
}
