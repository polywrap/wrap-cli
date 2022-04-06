import { Deployer } from "../../deploy/DeploymentManager";
import { DirectoryBlob, DirectoryEntry, FileEntry } from "../../deploy/file";

import FormData from "form-data";
import axios from "axios";

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

function convertDirectoryBlobToFormData(
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

class IPFSDeployer implements Deployer {
  async deploy(
    buildDirBlob: DirectoryBlob,
    config?: { gatewayUri: string }
  ): Promise<string> {
    console.log(`Publishing build contents to IPFS...`);

    const ipfsUrl = config?.gatewayUri ?? "https://ipfs.wrappers.io";

    const formDataEntries = convertDirectoryBlobToFormData(buildDirBlob);

    const fd = new FormData();

    formDataEntries.forEach((formDataEntry) => {
      const options: FormData.AppendOptions = {};
      if (formDataEntry.opts) {
        if (
          formDataEntry.opts.contentType &&
          formDataEntry.opts.contentType != ""
        ) {
          options.contentType = formDataEntry.opts.contentType;
        }
        if (formDataEntry.opts.fileName && formDataEntry.opts.fileName != "") {
          options.filename = formDataEntry.opts.fileName;
        }
        if (formDataEntry.opts.filePath && formDataEntry.opts.filePath != "") {
          options.filepath = formDataEntry.opts.filePath;
        }
      }
      const elementData =
        formDataEntry.data == null ? Buffer.alloc(0) : formDataEntry.data;
      fd.append(formDataEntry.key, elementData, options);
    });

    const resp = await axios.post(`${ipfsUrl}/add`, fd, {
      headers: {
        ...fd.getHeaders(),
      },
    });

    if (resp.status === 200 && !resp.data.error) {
      const cid = resp.data.cid;

      console.log(`Publish to IPFS successful, CID: ${cid}`);
      return cid;
    } else if (resp.status === 200 && resp.data.error) {
      throw new Error(resp.data.error);
    } else {
      throw new Error("Unexpected error: " + resp.status);
    }
  }
}

export default IPFSDeployer;
