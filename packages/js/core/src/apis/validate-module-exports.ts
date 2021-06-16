/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */

export async function validateModuleExports(
  module: BufferSource
): Promise<string | undefined> {
  const mod = await WebAssembly.compile(module);
  const memory = new WebAssembly.Memory({ initial: 1 });
  const instance = await WebAssembly.instantiate(mod, {
    env: {
      memory,
    },
    w3: {
      __w3_subinvoke: () => {},
      __w3_subinvoke_result_len: () => {},
      __w3_subinvoke_result: () => {},
      __w3_subinvoke_error_len: () => {},
      __w3_subinvoke_error: () => {},
      __w3_invoke_args: () => {},
      __w3_invoke_result: () => {},
      __w3_invoke_error: () => {},
      __w3_abort: () => {},
    },
  });

  if (!instance.exports._w3_init) {
    return "_w3_init";
  }

  if (!instance.exports._w3_invoke) {
    return "_w3_invoke";
  }

  if (!instance.exports.w3Abort) {
    return "w3Abort";
  }

  return undefined;
}
