/* eslint-disable @typescript-eslint/naming-convention */
const baseTypes = {
  UInt: "UInt",
  UInt8: "UInt8",
  UInt16: "UInt16",
  UInt32: "UInt32",
  UInt64: "UInt64",
  Int: "Int",
  Int8: "Int8",
  Int16: "Int16",
  Int32: "Int32",
  Int64: "Int64",
  String: "String",
  Boolean: "Boolean",
  Bytes: "Bytes",
};

export type BaseTypes = typeof baseTypes;

export type BaseType = keyof BaseTypes;

export function isBaseType(type: string): type is BaseType {
  return type in baseTypes;
}

const builtInTypes = {
  BigInt: "BigInt",
  BigNumber: "BigNumber",
  JSON: "JSON",
};

export type BuiltInTypes = typeof builtInTypes;

export type BuiltInType = keyof BuiltInTypes;

export function isBuiltInType(type: string): type is BuiltInType {
  return type in builtInTypes || type.startsWith("Map<");
}

const keywords = {
  as: "as",
  break: "break",
  const: "const",
  continue: "continue",
  crate: "crate",
  else: "else",
  enum: "enum",
  extern: "extern",
  false: "false",
  fn: "fn",
  for: "for",
  if: "if",
  impl: "impl",
  in: "in",
  let: "let",
  loop: "loop",
  match: "match",
  mod: "mod",
  move: "move",
  mut: "mut",
  pub: "pub",
  ref: "ref",
  return: "return",
  self: "self",
  Self: "Self",
  static: "static",
  struct: "struct",
  super: "super",
  trait: "trait",
  true: "true",
  type: "type",
  unsafe: "unsafe",
  use: "use",
  where: "where",
  while: "while",
  async: "async",
  await: "await",
  dyn: "dyn",
  abstract: "abstract",
  become: "become",
  box: "box",
  Box: "Box",
  do: "do",
  final: "final",
  macro: "macro",
  override: "override",
  priv: "priv",
  typeof: "typeof",
  unsized: "unsized",
  virtual: "virtual",
  yield: "yield",
  try: "try",
  macro_rules: "macro_rules",
  union: "union",
};

export type Keywords = typeof keywords;

export type Keyword = keyof Keywords;

export function isKeyword(keyword: string): keyword is Keyword {
  return keyword in keywords;
}
