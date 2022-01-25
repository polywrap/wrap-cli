import { IpfsClient } from "../types/IpfsClient";
import { CancelablePromise } from "./types/CancelablePromise";

import AbortController from "abort-controller";

const abortErrorMessage = "The user aborted a request.";

//Returns a promise, provider and callback that can be used to cancel the request
export const cancelableExecIpfs = <TReturn>(
  operation: string,
  ipfs: IpfsClient,
  provider: string,
  timeout: number,
  func: (
    ipfs: IpfsClient,
    provider: string,
    options: unknown
  ) => Promise<TReturn>
): CancelablePromise<TReturn> => {
  const controller = new AbortController();

  let error: Error | undefined = undefined;

  //If timer is not 0 then set a timeout to abort the execution
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

  const promise = new Promise<[error: Error, result: TReturn | undefined]>(
    async (resolve) => {
      try {
        const result = await func(ipfs, provider, {
          signal: controller.signal,
        });

        //Clear timeout if exists
        timer && clearTimeout(timer);

        if (result === undefined && !error) {
          return [
            buildExecError(
              operation,
              provider,
              timeout,
              new Error("The provider returned an empty response")
            ),
            result,
          ];
        }
        resolve([error, result]);
      } catch (e) {
        //Clear timeout if exists
        timer && clearTimeout(timer);

        if (!e.message || e.message !== abortErrorMessage) {
          error = buildExecError(operation, provider, timeout, e);
        }

        resolve([error, undefined]);
      }
      return;
    }
  );

  return {
    promise,
    provider,
    cancel: () => {
      controller.abort();
      timer && clearTimeout();
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
