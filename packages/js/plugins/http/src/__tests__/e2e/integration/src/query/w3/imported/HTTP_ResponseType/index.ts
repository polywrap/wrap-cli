export enum HTTP_ResponseType {
  TEXT,
  BINARY,
  _MAX_
}

export function sanitizeHTTP_ResponseTypeValue(value: i32): void {
  const valid = value >= 0 && value < HTTP_ResponseType._MAX_;
  if (!valid) {
    throw new Error("Invalid value for enum 'HTTP_ResponseType': " + value.toString());
  }
}

export function getHTTP_ResponseTypeValue(key: string): HTTP_ResponseType {
  if (key == "TEXT") {
    return HTTP_ResponseType.TEXT;
  }
  if (key == "BINARY") {
    return HTTP_ResponseType.BINARY;
  }

  throw new Error("Invalid key for enum 'HTTP_ResponseType': " + key);
}

export function getHTTP_ResponseTypeKey(value: HTTP_ResponseType): string {
  sanitizeHTTP_ResponseTypeValue(value);

  switch (value) {
    case HTTP_ResponseType.TEXT: return "TEXT";
    case HTTP_ResponseType.BINARY: return "BINARY";
    default:
      throw new Error("Invalid value for enum 'HTTP_ResponseType': " + value.toString());
  }
}
