import { SHA3_Query } from "./mutation/w3/imported/SHA3_Query";
import { UTS46_Query } from "./mutation/w3/imported/UTS46_Query";

export function namehash (inputName: string): string {
  let node = new Uint8Array(32);
  node.fill(0);

  const name: string = normalize(inputName)

  if (name) {
    const labels: string[] = name.split('.');

    for(let i = labels.length - 1; i >= 0; i--) {
      const labelSha = SHA3_Query.buffer_keccak_256({
        message: String.UTF8.encode(labels[i])
      });


      const combined = new Uint8Array(node.byteLength + labelSha.byteLength);
      combined.set(node);
      combined.set(Uint8Array.wrap(labelSha), node.byteLength);
      node = Uint8Array.wrap(
        SHA3_Query.buffer_keccak_256({
          message: combined.buffer
        })
      );
    }
  }

  let result = '0x';

  for (let i = 0; i < node.byteLength; ++i) {
    let hexStr = node[i].toString(16);

    if (hexStr.length === 1) {
      hexStr = "0" + hexStr;
    }

    result += hexStr;
  }

  return result;
}

export function normalize(name: string): string {
  return name ? UTS46_Query.toAscii({ 
    value: name
  }) : name
}

export function keccak256 (value: string): string {
  return "0x" + SHA3_Query.keccak_256({ message: value })
}