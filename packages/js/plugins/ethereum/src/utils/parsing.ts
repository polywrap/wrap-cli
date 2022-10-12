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

export function constructAbi(method: string): string[] {
  let abi;
  try {
    abi = JSON.parse(method);
    if (!(abi instanceof Array)) {
      abi = [abi];
    }
  } catch (e) {
    abi = [method];
  }
  return abi;
}

export function parseResult(result: unknown): string {
  const prep = prepForStringify(result);

  if (typeof prep === "string") {
    return prep;
  } else {
    return JSON.stringify(prep);
  }
}

export function prepForStringify(value: unknown): unknown {
  if (Array.isArray(value)) {
    const prepared = [];
    for (const item of value) {
      prepared.push(prepForStringify(item));
    }
    return prepared;
  } else if (
    typeof value === "object" &&
    typeof (value as Record<string, unknown>).toString === "function"
  ) {
    return (value as Record<string, unknown>).toString();
  } else {
    return value;
  }
}
