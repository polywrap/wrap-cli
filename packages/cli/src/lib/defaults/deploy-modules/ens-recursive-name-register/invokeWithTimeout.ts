import { InvokerOptions } from "@polywrap/core-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";
import { PolywrapClient } from "@polywrap/client-js";

export async function invokeWithTimeout<TResult>(
  client: PolywrapClient,
  options: InvokerOptions,
  timeout: number
): Promise<Result<TResult, Error>> {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  const [error, value] = await new Promise<
    [error: Error | undefined, result: TResult | undefined]
  >((resolve, reject) => {
    controller.signal.addEventListener("abort", () => {
      reject("Timeout has been reached");
    });
    client
      .invoke<TResult>(options)
      .then((result) => {
        timer && clearTimeout(timer);
        if (!result.ok) {
          resolve([result.error, undefined]);
          return;
        }
        resolve([undefined, result.value]);
      })
      .catch((error) => {
        timer && clearTimeout(timer);
        resolve([error, undefined]);
      });
  });

  if (error) {
    return ResultErr(error);
  }
  return ResultOk(value as TResult);
}
