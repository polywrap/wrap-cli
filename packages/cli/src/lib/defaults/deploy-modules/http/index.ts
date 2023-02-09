import { DeployModule } from "../../../deploy";

import { Uri } from "@polywrap/core-js";
import FormData from "form-data";
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

        formData.append("file[]", fileBuffer, nextFormDataRelPath);
      }
    });
  };

  convertDir(baseDirPath, "");

  return formData;
};

class HTTPDeployer implements DeployModule {
  async execute(uri: Uri, config?: { postUrl: string }): Promise<Uri> {
    if (!isValidUri(uri)) {
      throw new Error(
        `HTTP Deployer error: Invalid URI: ${uri.toString()}. Supplied URI needs to be a Filesystem URI, example: fs/./build`
      );
    }

    if (!config?.postUrl) {
      throw new Error(
        `HTTP Deployer error: No postUrl provided. Please provide a postUrl in the deploy manifest's config object`
      );
    }

    const formData = dirToFormData(uri.path);

    const response = await axios.post<{ uri: string; error: string }>(
      config.postUrl,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return new Uri(`http/${config.postUrl}`);
  }
}

export default new HTTPDeployer();
