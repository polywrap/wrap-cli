export function toImportablePath(path: string): string {
  // Remove the leading `./`
  if (path.startsWith("./")) {
    path = path.substring(2);
  }

  // Remove the trailing index.js/index.ts otherwise remove the file extension
  if (path.endsWith("index.ts") || path.endsWith("index.js")) {
    path = path.substring(0, path.length - 8);
  } else if (path.endsWith(".ts") || path.endsWith(".js")) {
    path = path.substring(0, path.length - 3);
  }

  // Remove trailing slashes
  if (path.endsWith("/")) {
    path = path.substring(0, path.length - 1);
  }

  return path;
}
