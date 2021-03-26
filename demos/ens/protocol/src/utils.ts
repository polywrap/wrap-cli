import { SHA3_Query, UTS46_Query } from "./query/w3/imported";

export function namehash (inputName: string): string {
  let node = ''
  for (let i: number = 0; i < 32; i++) {
    node += '00'
  }

  const name: string = normalize(inputName)

  if (name) {
    let labels: string[] = name.split('.')

    for(let i = labels.length - 1; i >= 0; i--) {
      let labelSha = SHA3_Query.keccak_256({ message: labels[i] })
      node = SHA3_Query.buffer_keccak_256({ message: (node + labelSha) })
    }
  }

  return '0x' + node
}

export function normalize(name: string): string {
  return name ? UTS46_Query.toAscii({ 
    value: name
  }) : name
}