import { Deployer } from "../../../deploy/deployer";

import { Uri } from "@polywrap/core-js";
import axios from "axios";
import Zip from "jszip";
import { readdirSync, readFileSync } from "fs-extra";

const isValidUri = (uri: Uri) => uri.authority === "fs";

const zipDirectory = (dirPath: string) => {
  const loadZip = (fileOrSubdirPath: string, zip: Zip = new Zip()) => {
    readdirSync(fileOrSubdirPath, { withFileTypes: true }).forEach((dirent) => {
      const direntPath = `${fileOrSubdirPath}/${dirent.name}`;
      if (dirent.isDirectory()) {
        const subDir = zip.folder(dirent.name) as Zip;
        loadZip(direntPath, subDir);
      } else {
        zip.file(direntPath, readFileSync(direntPath));
      }
    });

    return zip;
  };

  const loadedZip = loadZip(dirPath);

  return loadedZip.generateAsync({ type: "blob" });
};

class HTTPDeployer implements Deployer {
  async execute(uri: Uri, config?: { serverUrl: string }): Promise<Uri> {
    if (!isValidUri(uri)) {
      throw new Error(
        `HTTP Deployer error: Invalid URI: ${uri.toString()}. Supplied URI needs to be a Filesystem URI, example: fs/./build`
      );
    }

    if (!config?.serverUrl) {
      throw new Error(
        `HTTP Deployer error: No serverUrl provided. Please provide a serverUrl in the deploy manifest's config object`
      );
    }

    const blob = await zipDirectory(uri.path);
    const formData = new FormData();
    formData.append("directory", blob, "polywrap.zip");

    const response = await axios.post<{ uri: string; error: string }>(
      config.serverUrl,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return new Uri(`http/${response.data.uri}`);
  }
}

export default new HTTPDeployer();
