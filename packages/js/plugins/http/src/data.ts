export class Header {
    key: string;
    value: string;
}

export class UrlParam {
    key: string;
    value: string;
}

export type ResponseType = "TEXT" | "JSON" | "ARRAYBUFFER"

export class Request {
    headers?: Header[];
    urlParams?: UrlParam[];
    responseType: ResponseType;
    body?: String;
}

export class Response {
    status: number;
    statusText: string;
    headers: Header[];
    body: string;
}