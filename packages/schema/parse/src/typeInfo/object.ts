export function isObjectType(type: string, objectTypes: string[]): boolean {
  const index = objectTypes.findIndex((item: string) => type === item);

  return index === -1 ? false : true;
}
