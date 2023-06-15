import { DeployModule } from "../../../deploy";

import { Uri } from "@polywrap/core-js";
import FormData from "form-data";
import axios from "axios";
import { readdirSync, readFileSync } from "fs-extra";

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
  async execute(
    uri: Uri,
    config?: { postUrl: string; headers: { name: string; value: string }[] }
  ): Promise<Uri> {
    if (!config?.postUrl) {
      throw new Error(
        `HTTP Deployer error: No postUrl provided. Please provide a postUrl in the deploy manifest's config object`
      );
    }

    let response;
    if (uri.authority === "fs" || uri.authority === "file") {
      // URI is a FileSystem URI, so we read the directory and publish it
      const formData = dirToFormData(uri.path);

      response = await axios.post<{ uri: string; error: string }>(
        config.postUrl,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            ...parseConfigHeaders(config.headers),
          },
        }
      );
    } else {
      // URI is of another kind, so we just publish it as a redirect
      response = await axios.post<{ uri: string; error: string }>(
        config.postUrl,
        {
          uri: uri.toString(),
        },
        {
          headers: parseConfigHeaders(config.headers),
        }
      );
    }

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return new Uri(`http/${config.postUrl}`);
  }
}

function parseConfigHeaders(configHeaders: { name: string; value: string }[]) {
  const headers: { [key: string]: string } = {};

  configHeaders.forEach((header) => {
    headers[header.name] = header.value;
  });

  return headers;
}

export default new HTTPDeployer();
