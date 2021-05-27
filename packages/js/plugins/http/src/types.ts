// TODO: Generate this from the schema.graphql file
// https://github.com/web3-api/monorepo/issues/101

export class Header {
  key: string;
  value: string;
}

export class UrlParam {
  key: string;
  value: string;
}

export enum ResponseType {
  TEXT,
  BINARY,
}

export class Request {
  headers?: Header[];
  urlParams?: UrlParam[];
  responseType: ResponseType;
  body?: Body;
}

export class Body {
  stringBody?: string;
  rawBody?: ArrayBuffer;
  formDataBody?: FormData;
}

export class FormData {
  data: FormDataEntry[];
}

export class FormDataEntry {
  key: string;
  data: string;
  opts?: FormDataOptions;
}

export class FormDataOptions {
  contentType?: string;
  fileName?: string;
  filePath?: string;
}

export class Response {
  status: number;
  statusText: string;
  headers: Header[];
  body?: string;
}
