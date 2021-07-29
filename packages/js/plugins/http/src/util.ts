import { Request, Response, ResponseType, Header } from "./types";

import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import FormData from "form-data";

/**
 * Convert AxiosResponse<string> to Response
 *
 * @param axiosResponse
 */
export function fromAxiosResponse(
  axiosResponse: AxiosResponse<string>
): Response {
  const response = {
    status: axiosResponse.status,
    statusText: axiosResponse.statusText,
    headers: mapObjectToHeadersArray(axiosResponse.headers),
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

export function mapObjectToHeadersArray(headers: any): Header[] {
  const responseHeaders: Header[] = [];
  for (const key of Object.keys(headers)) {
    responseHeaders.push({ key: key, value: headers[key] });
  }
  return responseHeaders;
}


const DEFAULT_ERROR_CODE = "UNKNOWNERROR"
const DEFAULT_ERROR_MESSAGE = "Unknown error"
const TIMEOUT_ERROR_CODE = "ECONNABORTED"

export function fromAxiosError(e: Error | AxiosError): Response {
  if(axios.isAxiosError(e)) {
    if(e.response) {
      return {
        status: e.response.status,
        statusText: e.response.statusText,
        headers: mapObjectToHeadersArray(e.response.headers),
        body: e.response.data,
      }
    } else {
      return {
        error: {
          errorCode: e.code ? e.code : DEFAULT_ERROR_CODE,
          errorMessage: e.message ? e.message : DEFAULT_ERROR_MESSAGE,
          timeoutExcided: e.code == TIMEOUT_ERROR_CODE ? true : false
        }
      }
    }
  } else {
    throw e;
  }  
}

    //  ---- 
    // -0--0-
    // --db--
    // -\__/-
    //  ---- 

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
    config.params = urlParams;
  }
  if (requestHeaders) {
    config.headers = requestHeaders;
  }
  if (request.timeout) {
    config.timeout = request.timeout;
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
        const options: FormData.AppendOptions = {};
        if (formDataEntry.opts) {
          if (
            formDataEntry.opts.contentType &&
            formDataEntry.opts.contentType != ""
          ) {
            options.contentType = formDataEntry.opts.contentType;
          }
          if (
            formDataEntry.opts.fileName &&
            formDataEntry.opts.fileName != ""
          ) {
            options.filename = formDataEntry.opts.fileName;
          }
          if (
            formDataEntry.opts.filePath &&
            formDataEntry.opts.filePath != ""
          ) {
            options.filepath = formDataEntry.opts.filePath;
          }
        }
        const elementData =
          formDataEntry.data == null ? Buffer.alloc(0) : formDataEntry.data;
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
