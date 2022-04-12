import { Deployer } from "../../deploy/deployer";
import { convertDirectoryBlobToFormData } from "./formData";
import { parseAddDirectoryResponse } from "./utils";
import { convertDirectoryToEntry, DirectoryBlob } from "./file";

import FormData from "form-data";
import axios from "axios";
import { Uri } from "@web3api/core-js";

const isValidUri = (uri: Uri) => uri.authority === "file";

const resolveBuildDir = (path: string): DirectoryBlob => {
  const dirEntry = convertDirectoryToEntry(path);

  return {
    files: [],
    directories: [dirEntry],
  };
};

class IPFSDeployer implements Deployer {
  async execute(uri: Uri, config?: { gatewayUri: string }): Promise<Uri> {
    if (!isValidUri(uri)) {
      throw new Error("Invalid URI");
    }

    const path = uri.path;
    const buildDirBlob = resolveBuildDir(path);

    const ipfsUrl = config?.gatewayUri ?? "http://localhost:5001";

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

    const resp = await axios.post(`${ipfsUrl}/api/v0/add`, fd, {
      headers: {
        ...fd.getHeaders(),
      },
    });

    if (resp.status === 200) {
      const directoryCID = parseAddDirectoryResponse(resp.data).find(
        (a) => !a.name.includes("/")
      )?.hash;

      if (!directoryCID) {
        throw new Error("Could not find root folder's CID");
      }

      return new Uri(`ipfs/${directoryCID}`);
    } else {
      throw new Error("Unexpected error: " + resp.status);
    }
  }
}

export default new IPFSDeployer();
