import { Request, Response, ResponseTypeEnum, Header } from "./w3";

import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import FormData from "form-data";

/**
 * Convert AxiosResponse<string> to Response
 *
 * @param axiosResponse
 */
export function fromAxiosResponse(
  axiosResponse: AxiosResponse<unknown>,
  responseType?: ResponseTypeEnum
): Response {
  const response = {
    status: axiosResponse.status,
    statusText: axiosResponse.statusText,
    headers: mapObjectToHeadersArray(axiosResponse.headers),
  };

  if (
    axiosResponse.config.responseType == "arraybuffer" ||
    axiosResponse.config.responseType === "blob"
  ) {
    if (!Buffer.isBuffer(axiosResponse.data)) {
      throw Error(
        "HttpPlugin: Axios response data malformed, must be a buffer. Type: " +
          typeof axiosResponse.data
      );
    }

    const bodyType = responseType ? responseType : ResponseTypeEnum.BUFFER;

    return {
      data: {
        ...response,
        type: responseType,
        body: {
          buffer: bodyType === ResponseTypeEnum.BUFFER ? axiosResponse.data : undefined,
          text: bodyType === ResponseTypeEnum.TEXT ? axiosResponse.data.toString("utf-8") : undefined,
          json: bodyType === ResponseTypeEnum.JSON ? JSON.stringify(axiosResponse.data) : undefined
        },
      }
    };
  } else if (axiosResponse.config.responseType === "text") {
    
  } else if (axiosResponse.config.responseType === "json") {
    
  } else if (axiosResponse.config.responseType === "document") {
    
  } else if (axiosResponse.config.responseType === "stream") {
    
  } else {
    // TODO: throw
    switch (typeof axiosResponse.data) {
      case "string":
        return {
          data: {
            ...response,
            type: ResponseTypeEnum.TEXT,
            body: {
              text: axiosResponse.data,
            },
          },
        };
      case "undefined":
        return {
          data: {
            ...response
          },
        };
      default:
        return {
          data: {
            ...response,
            type: ResponseTypeEnum.TEXT,
            body: {
              text: JSON.stringify(axiosResponse.data)
            },
          },
        };
    }
  }
}

export function mapObjectToHeadersArray(headers: any): Header[] {
  const responseHeaders: Header[] = [];
  for (const key of Object.keys(headers)) {
    responseHeaders.push({ key: key, value: JSON.stringify(headers[key]) });
  }
  return responseHeaders;
}

const DEFAULT_ERROR_CODE = "UNKNOWNERROR"
const DEFAULT_ERROR_MESSAGE = "Unknown error"
const TIMEOUT_ERROR_CODE = "ECONNABORTED"

export function fromAxiosError(e: Error | AxiosError): Response {
  if(axios.isAxiosError(e)) {
    if(e.response) {
      const responseType = typeof e.response?.data === "string"
        ? ResponseTypeEnum.TEXT
        : ResponseTypeEnum.BINARY;

      return {
        status: e.response.status,
        statusText: e.response.statusText,
        headers: mapObjectToHeadersArray(e.response.headers),
        type: responseType,
        body: {
          stringBody: responseType === ResponseTypeEnum.TEXT ? e.response.data as string : undefined,
          rawBody: responseType === ResponseTypeEnum.BINARY ? e.response.data as Uint8Array : undefined
        }
      }
    } else {
      return {
        error: {
          errorCode: e.code ? e.code : DEFAULT_ERROR_CODE,
          errorMessage: e.message ? e.message : DEFAULT_ERROR_MESSAGE,
          timeoutExcided: e.code == TIMEOUT_ERROR_CODE ? true : false,
        }
      }
    }
  } else {
    throw e;
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

  let responseType: "text" | "arraybuffer" = "text";

  // TODO
  switch (request.responseType) {
    case "BINARY":
    case ResponseTypeEnum.BINARY:
      responseType = "arraybuffer";
  }

  let config: AxiosRequestConfig = {
    responseType,
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
      request.body.formDataBody.data &&
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
