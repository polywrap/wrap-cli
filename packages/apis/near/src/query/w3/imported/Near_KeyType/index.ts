export enum Near_KeyType {
  ED25519,
  _MAX_
}

export function sanitizeNear_KeyTypeValue(value: i32): void {
  const valid = value >= 0 && value < Near_KeyType._MAX_;
  if (!valid) {
    throw new Error("Invalid value for enum 'Near_KeyType': " + value.toString());
  }
}

export function getNear_KeyTypeValue(key: string): Near_KeyType {
  if (key == "ED25519") {
    return Near_KeyType.ED25519;
  }

  throw new Error("Invalid key for enum 'Near_KeyType': " + key);
}

export function getNear_KeyTypeKey(value: Near_KeyType): string {
  sanitizeNear_KeyTypeValue(value);

  switch (value) {
    case Near_KeyType.ED25519: return "ED25519";
    default:
      throw new Error("Invalid value for enum 'Near_KeyType': " + value.toString());
  }
}
