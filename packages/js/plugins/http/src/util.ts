import {
  Http_Request,
  Http_Response,
  Http_ResponseTypeEnum,
  Http_FormDataEntry,
} from "./wrap";

import { AxiosResponse, AxiosRequestConfig } from "axios";
import FormData from "form-data";

/**
 * Convert AxiosResponse<string> to Response
 *
 * @param axiosResponse
 */
export function fromAxiosResponse(
  axiosResponse: AxiosResponse<unknown>
): Http_Response {
  const responseHeaders = new Map<string, string>();
  for (const key of Object.keys(axiosResponse.headers)) {
    responseHeaders.set(
      key,
      Array.isArray(axiosResponse.headers[key])
        ? axiosResponse.headers[key].join(" ")
        : axiosResponse.headers[key]
    );
  }

  const response = {
    status: axiosResponse.status,
    statusText: axiosResponse.statusText,
    headers: responseHeaders,
  };

  // encode bytes as base64 string if response is array buffer
  if (axiosResponse.config.responseType == "arraybuffer") {
    if (!Buffer.isBuffer(axiosResponse.data)) {
      throw Error(
        "HttpPlugin: Axios response data malformed, must be a buffer. Type: " +
          typeof axiosResponse.data
      );
    }

    return {
      ...response,
      body: Buffer.from(axiosResponse.data).toString("base64"),
    };
  } else {
    switch (typeof axiosResponse.data) {
      case "string":
      case "undefined":
        return {
          ...response,
          body: axiosResponse.data,
        };
      default:
        return {
          ...response,
          body: JSON.stringify(axiosResponse.data),
        };
    }
  }
}

/**
 * Creates AxiosRequestConfig from Request
 *
 * @param request
 */
export function toAxiosRequestConfig(
  request: Http_Request
): AxiosRequestConfig {
  let responseType: "text" | "arraybuffer" = "text";

  switch (request.responseType) {
    case "BINARY":
    case Http_ResponseTypeEnum.BINARY:
      responseType = "arraybuffer";
  }

  let config: AxiosRequestConfig = {
    responseType,
  };

  if (request.urlParams) {
    config = { ...config, params: Object.fromEntries(request.urlParams) };
  }

  if (request.headers) {
    config = { ...config, headers: Object.fromEntries(request.headers) };
  }

  if (request.timeout) {
    config.timeout = request.timeout;
  }

  return config;
}

export function toFormData(entries: Http_FormDataEntry[]): FormData {
  const fd = new FormData();
  entries.forEach((entry) => {
    const options: FormData.AppendOptions = {};
    options.contentType = entry.type ?? undefined;
    options.filename = entry.fileName ?? undefined;
    let value: string | Buffer | undefined;
    if (entry.type) {
      value = entry.value
        ? Buffer.from(entry.value, "base64")
        : Buffer.alloc(0);
    } else {
      value = entry.value ?? undefined;
    }
    fd.append(entry.name, value, options);
  });
  return fd;
}
