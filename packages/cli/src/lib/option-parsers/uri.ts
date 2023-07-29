import { intlMsg } from "../intl";

import { Uri } from "@polywrap/core-js";

export function parseUriOption(
  uri: string | undefined | false
): Uri | undefined {
  if (uri) {
    try {
      return Uri.from(uri);
    } catch {
      console.error(intlMsg.commands_codegen_invalid_uri({ uri }));
      process.exit(1);
    }
  }
  return undefined;
}
