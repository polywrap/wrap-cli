import { Http_FormDataEntry } from "./w3/imported";
import { DirectoryEntry, DirectoryBlob, FileEntry } from "./w3";
import { encodeURIComponent } from "../util";

export function convertDirectoryBlobToFormData(directoryEntry: DirectoryBlob): Array<Http_FormDataEntry> {
    let formData: Array<Http_FormDataEntry> = []
    // files
    const files = directoryEntry.files;
    for (let i = 0; i < files.length; i++) {
        formData.push(convertFileEntryToFormData(files[i], ""));
    }
    // directories
    if (directoryEntry.directories.length != 0) {
        const dirFormData = converDirectoryEntryToFormData(directoryEntry.directories, "");
        formData = formData.concat(dirFormData);
    }
    return formData;
}

function convertFileEntryToFormData(fileEntry: FileEntry, path: string): Http_FormDataEntry {
    return {
        key: fileEntry.name,
        data: String.UTF8.decode(fileEntry.data),
        opts: {
            contentType: "application/octet-stream",
            fileName: encodeURIComponent(path + fileEntry.name),
            filePath: null
        }
    }
}

function converDirectoryEntryToFormData(dirs: DirectoryEntry[], path: string): Array<Http_FormDataEntry> {
    let formData: Array<Http_FormDataEntry> = []
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        formData.push({
            key: dir.name,
            data: null,
            opts: {
                contentType: "application/x-directory",
                fileName: encodeURIComponent(dir.name),
                filePath: ""
            }
        });
        const newPath = path + dir.name + "/";
        for (let j = 0; j < dir.files.length; j++) {
            formData.push(convertFileEntryToFormData(dir.files[j], newPath))
        }
        for (let k = 0; k < dir.directories.length; k++) {
            const rest = converDirectoryEntryToFormData(dir.directories[k].directories, newPath);
            formData = formData.concat(rest);
        }
    }
    return formData;
}