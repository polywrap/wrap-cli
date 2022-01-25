import { IpfsClient } from "../types/IpfsClient";
import { cancelableExecIpfs } from "./cancelableExecIpfs";
import { CancelablePromise } from "./types/CancelablePromise";

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, @typescript-eslint/naming-convention
const createIpfsClient = require("@dorgjelli-test/ipfs-http-client-lite");

export const execIpfsWithProviders = async <TReturn>( 
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
): Promise<TReturn>  => {
  let parallel: boolean = !!options?.parallel;
  
  return parallel
    ? await execParallelIpfs<TReturn>(operation, defaultIpfs, defaultProvider, providers, timeout, func)
    : await execSerialIpfs<TReturn>(operation, defaultIpfs, defaultProvider, providers, timeout, func);
};

const execSerialIpfs = async <TReturn>(
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
): Promise<TReturn> => {
  let errors: any[] = [];

  //Gather all requests from all providers 
  for(const provider of providers) {
    let ipfs: IpfsClient;

    if(provider === defaultProvider) {
      //If the provider is the default, we use the existing ipfs client
      ipfs = defaultIpfs;
    } else {
      //Otherwise we create a new ipfs client from the provider
      ipfs = createIpfsClient(provider);
    }

    const { promise } = cancelableExecIpfs(operation, ipfs, provider, timeout, func);

    const [error, result] = await promise;
    
    if(error) {
      errors.push(error);
    } else {
      return result as TReturn;
    }
  }

  //Throw all aggregated errors
  throw new Error(errors.map(x => x.message).join("\n"));
};

const execParallelIpfs = async <TReturn>(
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
): Promise<TReturn> => {
  let errors: any[] = [];
  const requests: CancelablePromise<TReturn>[] = [];

  //Gather all requests from all providers 
  for(const provider of providers) {
    let ipfs: IpfsClient;

    if(provider === defaultProvider) {
      //If the provider is the default, we use the existing ipfs client
      ipfs = defaultIpfs;
    } else {
      //Otherwise we create a new ipfs client from the provider
      ipfs = createIpfsClient(provider);
    }

    const request = cancelableExecIpfs(operation, ipfs, provider, timeout, func);

    requests.push(request);
  }

  const successPromise = gatherSuccessPromises(requests);
  const allPromises = gatherAllPromisesAndTrackErrors(requests, errors);

  //Wait for either the first successful request to finish
  //Or for all requests to finish (they all failed)
  const response = await Promise.race([
      successPromise,
      allPromises
    ]);

  if(response.success) {
    cancelAllRequests(requests);
  } else {
    //Throw all aggregated errors
    throw new Error(errors.map(x => x.message).join("\n"));
  }

  return response.result as TReturn;
};

const gatherSuccessPromises = async <TReturn>(
  requests: CancelablePromise<TReturn>[],
): Promise<{
  success: boolean;
  result: TReturn | undefined;
  provider: string | undefined;
}> => {
  const successPromises: Promise<{
    success: boolean
    result: TReturn | undefined;
    provider: string | undefined;
  }>[] = [];
  
  for(const request of requests) {
    successPromises.push(
      new Promise<{
        success: boolean
        result: TReturn | undefined;
        provider: string | undefined;
      }>(async (resolve, reject) => {
          const result = (await request.promise)[1];
  
          if(result !== undefined) {
            resolve({
              success: true,
              result: result,
              provider: request.provider,
            });
          }
        })
      );
  }

  return Promise.race(successPromises);
};

const gatherAllPromisesAndTrackErrors = <TReturn>(
  requests: CancelablePromise<TReturn>[],
  errors: any[]
): Promise<{
  success: boolean;
  result: TReturn | undefined;
  provider: string | undefined;
}> => {
  return new Promise<{
    success: boolean;
    result: TReturn | undefined;
    provider: string | undefined;
  }>(async (resolve) => {
    await Promise.all(requests.map(async request => {
      const [error] = await request.promise;
    
      if(error) {
        errors.push(error);
      }
    }));
  
    resolve({
      success: false,
      result: undefined,
      provider: undefined,
    });
  });
};

const cancelAllRequests = <TReturn>(
  requests: CancelablePromise<TReturn>[]
): void => {
  for(const request of requests) {
    const { cancel } = request;
    cancel();
  }
};
