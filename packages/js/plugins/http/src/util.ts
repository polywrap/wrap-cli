import {
  Http_Response,
  Http_ResponseType,
  Http_ResponseTypeEnum,
} from "./wrap";

export async function fromFetchResponse(
  fetchResponse: Response,
  responseType?: Http_ResponseType | null
): Promise<Http_Response> {
  const headers = new Map<string, string>();
  fetchResponse.headers.forEach((v, k) => headers.set(k, v));

  const response: Http_Response = {
    status: fetchResponse.status,
    statusText: fetchResponse.statusText,
    headers,
  };

  // encode bytes as base64 string if response is array buffer
  if (
    responseType === Http_ResponseTypeEnum.BINARY ||
    responseType === Http_ResponseTypeEnum[Http_ResponseTypeEnum.BINARY]
  ) {
    const buffer = await fetchResponse.arrayBuffer();
    return {
      ...response,
      body: Buffer.from(buffer).toString("base64"),
    };
  } else {
    const text = await fetchResponse.text();
    return {
      ...response,
      body: text,
    };
  }
}

export function addParams(
  url: string,
  urlParams?: Map<string, string> | null
): string {
  if (!urlParams || urlParams.size == 0) {
    return url;
  }
  url += "?";
  urlParams?.forEach((v, k) => {
    url += k + "=" + v + "&";
  });
  url = url.substring(0, url.length - 1);
  return url;
}
