import { execAbortable, AbortablePromise } from "./abortable";

import createIpfsClient, { IpfsClient } from "@polywrap/ipfs-http-client-lite";

export const execFallbacks = async <TReturn>(
  operation: string,
  defaultIpfs: IpfsClient,
  defaultProvider: string,
  providers: string[],
  timeout: number,
  func: (
    ipfs: IpfsClient,
    provider: string,
    options: unknown
  ) => Promise<TReturn>,
  options?: { parallel?: boolean }
): Promise<TReturn> => {
  const parallel = !!options?.parallel;

  return parallel
    ? await execParallel<TReturn>(
        operation,
        defaultIpfs,
        defaultProvider,
        providers,
        timeout,
        func
      )
    : await execSerial<TReturn>(
        operation,
        defaultIpfs,
        defaultProvider,
        providers,
        timeout,
        func
      );
};

const execSerial = async <TReturn>(
  operation: string,
  defaultIpfs: IpfsClient,
  defaultProvider: string,
  providers: string[],
  timeout: number,
  func: (
    ipfs: IpfsClient,
    provider: string,
    options: unknown
  ) => Promise<TReturn>
): Promise<TReturn> => {
  const errors: Error[] = [];

  // Gather all requests from all providers
  for (const provider of providers) {
    let ipfs: IpfsClient;

    if (provider === defaultProvider) {
      // If the provider is the default, we use the existing ipfs client
      ipfs = defaultIpfs;
    } else {
      // Otherwise we create a new ipfs client from the provider
      ipfs = createIpfsClient(provider);
    }

    const { promise } = execAbortable(operation, ipfs, provider, timeout, func);

    const [error, result] = await promise;

    if (error) {
      errors.push(error);
    } else {
      return result as TReturn;
    }
  }

  // Throw all aggregated errors
  throw new Error(errors.map((x) => x.message).join("\n"));
};

const execParallel = async <TReturn>(
  operation: string,
  defaultIpfs: IpfsClient,
  defaultProvider: string,
  providers: string[],
  timeout: number,
  func: (
    ipfs: IpfsClient,
    provider: string,
    options: unknown
  ) => Promise<TReturn>
): Promise<TReturn> => {
  const errors: Error[] = [];
  const requests: AbortablePromise<TReturn>[] = [];

  // Gather all requests from all providers
  for (const provider of providers) {
    let ipfs: IpfsClient;

    if (provider === defaultProvider) {
      // If the provider is the default, we use the existing ipfs client
      ipfs = defaultIpfs;
    } else {
      // Otherwise we create a new ipfs client from the provider
      ipfs = createIpfsClient(provider);
    }

    const request = execAbortable(operation, ipfs, provider, timeout, func);

    requests.push(request);
  }

  const successPromise = gatherSuccessPromises(requests);
  const allPromises = gatherAllPromisesAndTrackErrors(requests, errors);

  // Wait for either the first successful request to finish
  // Or for all requests to finish (they all failed)
  const response = await Promise.race([successPromise, allPromises]);

  if (response.success) {
    abortAllRequests(requests);
  } else {
    // Throw all aggregated errors
    throw new Error(errors.map((x) => x.message).join("\n"));
  }

  return response.result as TReturn;
};

const gatherSuccessPromises = async <TReturn>(
  requests: AbortablePromise<TReturn>[]
): Promise<{
  success: boolean;
  result: TReturn | undefined;
  provider: string | undefined;
}> => {
  const successPromises: Promise<{
    success: boolean;
    result: TReturn | undefined;
    provider: string | undefined;
  }>[] = [];

  for (const request of requests) {
    successPromises.push(
      new Promise<{
        success: boolean;
        result: TReturn | undefined;
        provider: string | undefined;
      }>((resolve, reject) => {
        request.promise.then((response) => {
          const [error, result] = response;

          if (!error && result !== undefined) {
            resolve({
              success: true,
              result: result,
              provider: request.provider,
            });
          }
        }, reject);
      })
    );
  }

  return Promise.race(successPromises);
};

const gatherAllPromisesAndTrackErrors = <TReturn>(
  requests: AbortablePromise<TReturn>[],
  errors: Error[]
): Promise<{
  success: boolean;
  result: TReturn | undefined;
  provider: string | undefined;
}> => {
  return new Promise<{
    success: boolean;
    result: TReturn | undefined;
    provider: string | undefined;
  }>((resolve, reject) => {
    Promise.all(
      requests.map(async (request) => {
        const [error] = await request.promise;

        if (error) {
          errors.push(error);
        }
      })
    ).then(() => {
      resolve({
        success: false,
        result: undefined,
        provider: undefined,
      });
    }, reject);
  });
};

const abortAllRequests = <TReturn>(
  requests: AbortablePromise<TReturn>[]
): void => {
  for (const request of requests) {
    request.abort();
  }
};
