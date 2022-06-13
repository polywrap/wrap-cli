export function parseArgs(args?: string[] | null): unknown[] {
  if (!args) {
    return [];
  }

  return args.map((arg: string) =>
    (arg.startsWith("[") && arg.endsWith("]")) ||
    (arg.startsWith("{") && arg.endsWith("}"))
      ? JSON.parse(arg)
      : arg
  );
}
