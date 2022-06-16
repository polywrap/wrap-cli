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
  serializeHTTP_UrlParam,
  deserializeHTTP_UrlParam,
  writeHTTP_UrlParam,
  readHTTP_UrlParam
} from "./serialization";
import * as Types from "../..";

@serializable
export class HTTP_UrlParam {

  public static uri: string = "w3://ens/http.web3api.eth";

  key: string;
  value: string;

  static toBuffer(type: HTTP_UrlParam): ArrayBuffer {
    return serializeHTTP_UrlParam(type);
  }

  static fromBuffer(buffer: ArrayBuffer): HTTP_UrlParam {
    return deserializeHTTP_UrlParam(buffer);
  }

  static write(writer: Write, type: HTTP_UrlParam): void {
    writeHTTP_UrlParam(writer, type);
  }

  static read(reader: Read): HTTP_UrlParam {
    return readHTTP_UrlParam(reader);
  }

  static toJson(type: HTTP_UrlParam): JSON.Value {
    return JSONSerializer.encode(type);
  }

  static fromJson(json: JSON.Value): HTTP_UrlParam {
    return (new JSONDeserializer(json)).decode<HTTP_UrlParam>();
  }
}
