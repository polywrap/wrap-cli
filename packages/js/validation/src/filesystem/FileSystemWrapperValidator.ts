import {
  ValidationResult,
  WrapperValidator,
  WrapperReadOperations,
  WrapperContraints,
} from "../base";

import path from "path";
import fs from "fs";

export type FileSystemValidatorConfig = {
  maxSize: number;
  maxFileSize: number;
  maxModuleSize: number;
  maxNumberOfFiles: number;
};

const getOpsFromPath = (wrapperPath: string): WrapperReadOperations => {
  return {
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
  };
};

export class FileSystemWrapperValidator {
  baseValidator: WrapperValidator;

  constructor(constraints: WrapperContraints) {
    this.baseValidator = new WrapperValidator(constraints);
  }

  validate(wrapperPath: string): ValidationResult {
    return this.baseValidator.validate(getOpsFromPath(wrapperPath));
  }
}
