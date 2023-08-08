import { DirectoryEntry } from "./types";

import fs from "fs";

export const readDirContents = async (
  path: string,
  dirName: string
): Promise<DirectoryEntry> => {
  const dirents: fs.Dirent[] = await fs.promises.readdir(path, {
    withFileTypes: true,
  });
  const data: DirectoryEntry = { name: dirName };

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      const subDir = await readDirContents(
        `${path}/${dirent.name}`,
        `${dirent.name}`
      );
      data.directories = data.directories ?? [];
      data.directories?.push(subDir);
    } else {
      const fileData = await fs.promises.readFile(`${path}/${dirent.name}`);
      data.files = data.files ?? [];
      data.files?.push({
        name: dirent.name,
        data: fileData,
      });
    }
  }

  return data;
};
