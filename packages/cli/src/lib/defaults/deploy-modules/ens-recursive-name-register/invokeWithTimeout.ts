import {
  Invoker,
  InvokeResult,
  InvokerOptions,
  WrapError,
  WrapErrorCode,
} from "@polywrap/core-js";
import { ResultErr } from "@polywrap/result";

/**
 * Invoke a wrapper; abort the invocation if a timeout expires.
 *
 * @param client - a Polywrap Invoker (e.g. CoreClient)
 * @param options - invocation options
 * @param timeout - a timeout period (in ms)
 * */
export async function invokeWithTimeout<TResult>(
  client: Invoker,
  options: InvokerOptions,
  timeout: number
): Promise<InvokeResult<TResult>> {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  return await new Promise<InvokeResult<TResult>>((resolve, reject) => {
    controller.signal.addEventListener("abort", () => {
      const wrapError = new WrapError("Timeout has been reached", {
        code: WrapErrorCode.WRAPPER_INVOKE_ABORTED,
        uri: options.uri.uri,
        method: options.method,
        args: JSON.stringify(options.args, null, 2),
      });
      reject(wrapError);
    });
    client
      .invoke<TResult>(options)
      .then((result) => resolve(result))
      .catch((error) => {
        // the client threw an error (this should never happen)
        const wrapError = new WrapError(error.message, {
          code: WrapErrorCode.WRAPPER_INVOKE_FAIL,
          uri: options.uri.uri,
          method: options.method,
          args: JSON.stringify(options.args, null, 2),
        });
        resolve(ResultErr(wrapError));
      });
  })
    .catch((error) => {
      return ResultErr<WrapError>(error as WrapError);
    })
    .finally(() => timer && clearTimeout(timer));
}
