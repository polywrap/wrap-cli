export const combinePaths = (a: string, b: string): string => {
  // Normalize all path separators
  a = a.replace(/\\/g, "/");
  b = b.replace(/\\/g, "/");

  // Append a separator if one doesn't exist
  if (a[a.length - 1] !== "/") {
    a += "/";
  }

  // Remove any leading separators from
  while (b[0] === "/" || b[0] === ".") {
    b = b.substring(1);
  }

  return a + b;
};
