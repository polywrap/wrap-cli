import {
  Read,
  ReadDecoder,
  Nullable
} from "@web3api/wasm-as";
import { AnotherType } from "./";

export function deserializeAnotherType(buffer: ArrayBuffer, type: AnotherType) {
  const reader = new ReadDecoder(buffer);
  var numFields = reader.readMapLength();

  while (numFields > 0) {
    numFields--;
    const field = reader.readString();

    if (field == "prop") {
      type.prop = reader.readNullableString();
    }
  }
}
