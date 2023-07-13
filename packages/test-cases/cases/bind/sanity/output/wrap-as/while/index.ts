export enum _while {
  _for,
  _in,
  _MAX_
}

export function sanitizewhileValue(value: i32): void {
  const valid = value >= 0 && value < _while._MAX_;
  if (!valid) {
    throw new Error("Invalid value for enum '_while': " + value.toString());
  }
}

export function getwhileValue(key: string): _while {
  if (key == "_for") {
    return _while._for;
  }
  if (key == "_in") {
    return _while._in;
  }

  throw new Error("Invalid key for enum '_while': " + key);
}

export function getwhileKey(value: _while): string {
  sanitizewhileValue(value);

  switch (value) {
    case _while._for: return "_for";
    case _while._in: return "_in";
    default:
      throw new Error("Invalid value for enum '_while': " + value.toString());
  }
}
