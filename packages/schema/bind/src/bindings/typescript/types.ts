const baseTypes = {
  boolean: "boolean",
  number: "number",
  string: "string",
};

export type BaseTypes = typeof baseTypes;

export type BaseType = keyof BaseTypes;

export function isBaseType(type: string): type is BaseType {
  return type in baseTypes;
}

// based on:
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#keywords
const keywords = {
  break: "break",
  case: "case",
  catch: "catch",
  class: "class",
  const: "const",
  continue: "continue",
  debugger: "debugger",
  default: "default",
  delete: "delete",
  do: "do",
  else: "else",
  export: "export",
  extends: "extends",
  false: "false",
  finally: "finally",
  for: "for",
  function: "function",
  if: "if",
  import: "import",
  in: "in",
  instanceof: "instanceof",
  new: "new",
  null: "null",
  return: "return",
  super: "super",
  switch: "switch",
  this: "this",
  throw: "throw",
  true: "true",
  try: "try",
  typeof: "typeof",
  var: "var",
  void: "void",
  while: "while",
  with: "with",
  yield: "yield",
  let: "let",
  await: "await",
  enum: "enum",
  implements: "implements",
  interface: "interface",
  package: "package",
  private: "private",
  protected: "protected",
  public: "public",
  static: "static",
  arguments: "arguments",
  eval: "eval",
};

export type Keywords = typeof keywords;

export type Keyword = keyof Keywords;

export function isKeyword(keyword: string): keyword is Keyword {
  return keyword in keywords;
}
