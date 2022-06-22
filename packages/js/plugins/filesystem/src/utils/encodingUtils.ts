import { Filesystem_Encoding, Filesystem_EncodingEnum } from "../wrap";

export const filesystemEncodingToBufferEncoding = (
  encoding: Filesystem_Encoding | null | undefined
): BufferEncoding => {
  switch (encoding) {
    case Filesystem_EncodingEnum.ASCII:
    case "ASCII":
      return "ascii";

    case Filesystem_EncodingEnum.BASE64:
    case "BASE64":
      return "base64";

    case Filesystem_EncodingEnum.BASE64URL:
    case "BASE64URL":
      return "base64url";

    case Filesystem_EncodingEnum.BINARY:
    case "BINARY":
      return "binary";

    case Filesystem_EncodingEnum.HEX:
    case "HEX":
      return "hex";

    case Filesystem_EncodingEnum.LATIN1:
    case "LATIN1":
      return "latin1";

    case Filesystem_EncodingEnum.UCS2:
    case "UCS2":
      return "ucs2";

    case Filesystem_EncodingEnum.UTF16LE:
    case "UTF16LE":
      return "utf16le";

    case Filesystem_EncodingEnum.UTF8:
    case "UTF8":
      return "utf8";

    default:
      return "utf8";
  }
};
