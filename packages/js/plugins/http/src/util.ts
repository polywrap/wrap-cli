import { Request, Response, ResponseType, Header } from "./types";

import { AxiosResponse, AxiosRequestConfig } from "axios";
import FormData from "form-data";

/**
 * Convert AxiosResponse<string> to Response
 *
 * @param axiosResponse
 */
export function fromAxiosResponse(
  axiosResponse: AxiosResponse<string>
): Response {
  const responseHeaders: Header[] = [];
  for (const key of Object.keys(axiosResponse.headers)) {
    responseHeaders.push({ key: key, value: axiosResponse.headers[key] });
  }

  const response = {
    status: axiosResponse.status,
    statusText: axiosResponse.statusText,
    headers: responseHeaders,
  };

  // encode bytes as base64 string if response is array buffer
  if (axiosResponse.config.responseType == "arraybuffer") {
    return {
      ...response,
      body: Buffer.from(axiosResponse.data).toString("base64"),
    };
  } else {
    if (typeof axiosResponse.data == "object") {
      return {
        ...response,
        body: JSON.stringify(axiosResponse.data),
      };
    }
    return {
      ...response,
      body: axiosResponse.data,
    };
  }
}

export type AxiosData = string | ArrayBuffer | FormData | undefined;

/**
 * Creates AxiosRequestConfig from Request
 *
 * @param request
 */
export function toAxiosRequest(
  request: Request
): { config: AxiosRequestConfig; data: AxiosData } {
  const urlParams = request.urlParams?.reduce((params, p) => {
    return { ...params, [p.key]: p.value };
  }, {});

  const requestHeaders = request.headers?.reduce((headers, h) => {
    return { ...headers, [h.key]: h.value };
  }, {});

  let config: AxiosRequestConfig = {
    responseType:
      request.responseType == ResponseType.BINARY ? "arraybuffer" : "text",
  };

  if (urlParams) {
    config = { ...config, params: urlParams };
  }

  if (requestHeaders) {
    config = { ...config, headers: requestHeaders };
  }

  let data: AxiosData;

  if (request.body) {
    if (
      request.body.formDataBody &&
      request.body.formDataBody.data.length > 0
    ) {
      // body is defined as form data
      const fd = new FormData();   
      request.body.formDataBody.data.forEach((formDataEntry) => {
        let options: FormData.AppendOptions = {}
        if(formDataEntry.opts) {
          if(formDataEntry.opts.contentType && formDataEntry.opts.contentType != "") {
            options.contentType = formDataEntry.opts.contentType
          };
          if(formDataEntry.opts.fileName && formDataEntry.opts.fileName != "") {
            options.filename = formDataEntry.opts.fileName
          };
          if(formDataEntry.opts.filePath && formDataEntry.opts.filePath != "") {
            options.filepath = formDataEntry.opts.filePath
          };
        }
        const elementData = formDataEntry.data == null ? Buffer.alloc(0) : formDataEntry.data;
        fd.append(formDataEntry.key, elementData, options);
      });
      data = fd;
      // set up appropriate headers for form data
      config.headers = {
        ...config.headers,
        ...fd.getHeaders(),
      };
    } else if (request.body.stringBody) {
      data = request.body.stringBody;
    } else if (request.body.rawBody) {
      data = request.body.rawBody;
    }
  }

  return { config, data };
}