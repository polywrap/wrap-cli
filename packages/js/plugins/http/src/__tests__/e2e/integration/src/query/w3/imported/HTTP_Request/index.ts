import {
  Read,
  Write,
  Nullable,
  BigInt,
  BigNumber,
  JSON,
  JSONSerializer,
  JSONDeserializer,
} from "@web3api/wasm-as";
import {
  serializeHTTP_Request,
  deserializeHTTP_Request,
  writeHTTP_Request,
  readHTTP_Request
} from "./serialization";
import * as Types from "../..";

@serializable
export class HTTP_Request {

  public static uri: string = "w3://ens/http.web3api.eth";

  headers: Array<Types.HTTP_Header> | null;
  urlParams: Array<Types.HTTP_UrlParam> | null;
  responseType: Types.HTTP_ResponseType;
  body: string | null;

  static toBuffer(type: HTTP_Request): ArrayBuffer {
    return serializeHTTP_Request(type);
  }

  static fromBuffer(buffer: ArrayBuffer): HTTP_Request {
    return deserializeHTTP_Request(buffer);
  }

  static write(writer: Write, type: HTTP_Request): void {
    writeHTTP_Request(writer, type);
  }

  static read(reader: Read): HTTP_Request {
    return readHTTP_Request(reader);
  }

  static toJson(type: HTTP_Request): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): HTTP_Request {
    return (new JSONDeserializer(json)).decode<HTTP_Request>();
  }
}
