export function isEnumType(type: string, enumTypes: string[]): boolean {
  const index = enumTypes.findIndex((item: string) => type === item);

  return index === -1 ? false : true;
}
