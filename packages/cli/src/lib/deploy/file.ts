import fs from "fs";
import path from "path";

export interface FileEntry {
  name: string;
  data: string;
}

export interface DirectoryEntry {
  name: string;
  directories: DirectoryEntry[];
  files: FileEntry[];
}

export const convertFileToEntry = (pathToFile: string): FileEntry => {
  const name = path.basename(pathToFile);
  const data = fs.readFileSync(pathToFile, { encoding: "utf-8" });

  return {
    name,
    data,
  };
};

export const convertDirectoryToEntry = (pathToDir: string): DirectoryEntry => {
  const name = path.basename(pathToDir);

  const filesAndDirs = fs.readdirSync(pathToDir, { withFileTypes: true });

  const files = filesAndDirs
    .filter((dirent) => !dirent.isDirectory())
    .map((dirent) => convertFileToEntry(path.join(pathToDir, dirent.name)));

  const directories = filesAndDirs
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) =>
      convertDirectoryToEntry(path.join(pathToDir, dirent.name))
    );

  return {
    name,
    files,
    directories,
  };
};
