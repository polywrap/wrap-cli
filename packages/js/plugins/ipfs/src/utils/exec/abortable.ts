import { IpfsClient } from "@polywrap/ipfs-http-client-lite";
import AbortController from "abort-controller";

const abortErrorMessage = "The user aborted a request.";

export interface AbortablePromise<TReturn> {
  promise: Promise<[error: Error | undefined, result: TReturn | undefined]>;
  abort: () => void;
  provider: string;
}

// Returns a promise, provider and callback that can be used to cancel the request
export const execAbortable = <TReturn>(
  operation: string,
  ipfs: IpfsClient,
  provider: string,
  timeout: number,
  func: (
    ipfs: IpfsClient,
    provider: string,
    options: unknown
  ) => Promise<TReturn>
): AbortablePromise<TReturn> => {
  const controller = new AbortController();
  let error: Error | undefined = undefined;

  // If timer is not 0 then set a timeout to abort the execution
  const timer = timeout
    ? setTimeout(() => {
        error = buildExecError(
          operation,
          provider,
          timeout,
          new Error("Timeout has been reached")
        );
        controller.abort();
      }, timeout)
    : undefined;

  const promise = new Promise<
    [error: Error | undefined, result: TReturn | undefined]
  >((resolve) => {
    func(ipfs, provider, {
      signal: controller.signal,
    }).then(
      (result) => {
        // Clear timeout if exists
        timer && clearTimeout(timer);

        if (result === undefined && !error) {
          error = buildExecError(
            operation,
            provider,
            timeout,
            new Error("The provider returned an empty response")
          );
        }

        resolve([error, result]);
      },
      (e) => {
        // Clear timeout if exists
        timer && clearTimeout(timer);

        if (!e.message || e.message !== abortErrorMessage) {
          error = buildExecError(operation, provider, timeout, e);
        }

        resolve([error, undefined]);
      }
    );
  });

  return {
    promise,
    provider,
    abort: () => {
      controller.abort();
      timer && clearTimeout(timer);
    },
  };
};

const buildExecError = (
  operation: string,
  provider: string,
  timeout: number,
  error: Error
) => {
  return new Error(
    `An error occurred\nOperation: ${operation}\nProvider: ${provider}\nTimeout: ${timeout}\nError: ${JSON.stringify(
      error,
      Object.getOwnPropertyNames(error)
    )}`
  );
};
