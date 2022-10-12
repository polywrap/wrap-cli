/* eslint-disable @typescript-eslint/no-explicit-any */

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

export function constructAbi(method: string): any[] {
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

export function parseResult(result: any): string {
  return JSON.stringify(prepForStringify(result));
}

export function prepForStringify(value: any): any {
  if (Array.isArray(value)) {
    let prepared = [];
    for (const item of value) {
      prepared.push(prepForStringify(item));
    }
    return prepared;
  } else if (
    typeof value === "object" &&
    typeof value.toString === "function"
  ) {
    return value.toString();
  } else {
    return value;
  }
}
