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

export function parseResult(abi: any[], result: any[] | any): string {
  if (!(result instanceof Array)) {
    // if not array, return single value
    return result.toString();
  }
  const isRawAbi = abi[0] instanceof Object;
  if (!isRawAbi) {
    return stringifySimpleArray(result);
  }
  const outputs = abi[0].outputs;
  const returnIsStruct = outputs.length > 0 && "components" in outputs[0];
  if (returnIsStruct) {
    return stringifyStruct(abi, result);
  } else {
    return stringifySimpleArray(result);
  }
}

function stringifyStruct(abi: any[], result: any): string {
  const objects: Record<string, string>[] = [];
  for (const element of result) {
    const object: Record<string, string> = {};
    const output = abi[0].outputs[0];
    for (const component of output.components) {
      object[component.name] = element[component.name].toString();
    }
    objects.push(object);
  }
  return JSON.stringify(objects);
}

function stringifySimpleArray(result: any): string {
  const objects: string[] = [];
  for (const element of result) {
    objects.push(element.toString());
  }
  return JSON.stringify(objects);
}
