import { JSONValueSerializer } from "@serial-as/json";
import { JSON } from "@web3api/assemblyscript-json";

export { JSON };

export function decode<T>(json: JSON.Value): T {
  const decoder = new JSONValueSerializer();
  return decoder.decode<T>(json);
}

export function encode<T>(t: T): JSON.Value {
  const encoder = new JSONValueSerializer();
  return encoder.encode<T>(t);
}
