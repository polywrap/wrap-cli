export enum KeyType {
  ED25519,
  _MAX_
}

export function sanitizeKeyTypeValue(value: i32): void {
  const valid = value >= 0 && value < KeyType._MAX_;
  if (!valid) {
    throw new Error("Invalid value for enum 'KeyType': " + value.toString());
  }
}

export function getKeyTypeValue(key: string): KeyType {
  if (key == "ED25519") {
    return KeyType.ED25519;
  }

  throw new Error("Invalid key for enum 'KeyType': " + key);
}

export function getKeyTypeKey(value: KeyType): string {
  sanitizeKeyTypeValue(value);

  switch (value) {
    case KeyType.ED25519: return "ED25519";
    default:
      throw new Error("Invalid value for enum 'KeyType': " + value.toString());
  }
}
