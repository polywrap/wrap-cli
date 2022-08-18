import { FileSystem_Encoding, FileSystem_EncodingEnum } from "../wrap-man";

const fileSystemEncodingToBufferEncoding = (
  encoding: FileSystem_Encoding | null | undefined
): BufferEncoding => {
  switch (encoding) {
    case FileSystem_EncodingEnum.ASCII:
    case "ASCII":
      return "ascii";

    case FileSystem_EncodingEnum.BASE64:
    case "BASE64":
      return "base64";

    case FileSystem_EncodingEnum.BASE64URL:
    case "BASE64URL":
      return "base64url";

    case FileSystem_EncodingEnum.BINARY:
    case "BINARY":
      return "binary";

    case FileSystem_EncodingEnum.HEX:
    case "HEX":
      return "hex";

    case FileSystem_EncodingEnum.LATIN1:
    case "LATIN1":
      return "latin1";

    case FileSystem_EncodingEnum.UCS2:
    case "UCS2":
      return "ucs2";

    case FileSystem_EncodingEnum.UTF16LE:
    case "UTF16LE":
      return "utf16le";

    case FileSystem_EncodingEnum.UTF8:
    case "UTF8":
      return "utf8";

    default:
      return "utf8";
  }
};

export default fileSystemEncodingToBufferEncoding;
