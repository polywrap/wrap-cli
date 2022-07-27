import { Deployer } from "../../../deploy/deployer";

import { Uri } from "@polywrap/core-js";
import axios from "axios";
import { readdirSync, readFileSync } from "fs-extra";

const isValidUri = (uri: Uri) => uri.authority === "fs";

const dirToFormData = (baseDirPath: string) => {
  const formData = new FormData();

  const convertDir = (dirPath: string, formDataRelPath: string) => {
    const files = readdirSync(dirPath, { withFileTypes: true });

    files.map((dirent) => {
      const direntPath = `${dirPath}/${dirent.name}`;
      const nextFormDataRelPath = formDataRelPath
        ? `${formDataRelPath}/${dirent.name}`
        : dirent.name;
      if (dirent.isDirectory()) {
        convertDir(direntPath, nextFormDataRelPath);
      } else {
        const fileBuffer = readFileSync(direntPath);
        const fileBlob = new Blob([fileBuffer]);

        formData.append("file", fileBlob, nextFormDataRelPath);
      }
    });
  };

  convertDir(baseDirPath, "");

  return formData;
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

    const formData = dirToFormData(uri.path);

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
