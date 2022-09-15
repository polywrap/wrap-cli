import { Uri } from "..";

export const toUri = (uri: Uri | string): Uri => {
  if (typeof uri === "string") {
    return new Uri(uri);
  } else if (Uri.isUri(uri)) {
    return uri;
  } else {
    throw Error(`Unknown uri type, cannot convert. ${JSON.stringify(uri)}`);
  }
};
