import { DirectoryBlob, DirectoryEntry, FileEntry } from "./file";

interface FormDataEntry {
  key: string;
  data?: string;
  opts?: FormDataOptions;
}

interface FormDataOptions {
  contentType?: string;
  fileName?: string;
  filePath?: string;
}

function convertDirectoryEntryToFormData(
  dirs: DirectoryEntry[],
  path: string
): FormDataEntry[] {
  let formData: FormDataEntry[] = [];
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    formData.push({
      key: dir.name,
      opts: {
        contentType: "application/x-directory",
        fileName: encodeURIComponent(dir.name),
        filePath: "",
      },
    });
    const newPath = path + dir.name + "/";
    for (let j = 0; j < dir.files.length; j++) {
      formData.push(convertFileEntryToFormData(dir.files[j], newPath));
    }
    const rest = convertDirectoryEntryToFormData(dir.directories, newPath);
    formData = formData.concat(rest);
  }
  return formData;
}

function convertFileEntryToFormData(
  fileEntry: FileEntry,
  path: string
): FormDataEntry {
  return {
    key: fileEntry.name,
    data: fileEntry.data,
    opts: {
      contentType: "application/octet-stream",
      fileName: encodeURIComponent(path + fileEntry.name),
    },
  };
}

export function convertDirectoryBlobToFormData(
  directoryBlob: DirectoryBlob
): FormDataEntry[] {
  let formData: FormDataEntry[] = [];
  const files = directoryBlob.files;

  for (let i = 0; i < files.length; i++) {
    formData.push(convertFileEntryToFormData(files[i], ""));
  }

  if (directoryBlob.directories.length != 0) {
    const dirFormData = convertDirectoryEntryToFormData(
      directoryBlob.directories,
      ""
    );
    formData = formData.concat(dirFormData);
  }
  return formData;
}
