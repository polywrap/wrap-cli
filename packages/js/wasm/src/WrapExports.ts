/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-types */

import { u32 } from "./helpers/types";

export interface WrapExports extends WebAssembly.Exports {
  _wrap_invoke: (nameLen: u32, argsLen: u32, envLen: u32) => boolean;
}
