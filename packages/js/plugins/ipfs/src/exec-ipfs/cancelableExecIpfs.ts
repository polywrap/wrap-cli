import { IpfsClient } from "../types/IpfsClient";
import { CancelablePromise } from "./CancelablePromise";
import AbortController from "abort-controller";

const abortErrorMessage = "The user aborted a request.";

//Returns a promise, provider and callback that can be used to cancel the request
export const cancelableExecIpfs = <TReturn>( 
  operation: string,
  ipfs: IpfsClient,
  provider: string,
  timeout: number,
  exec: (
    ipfs: IpfsClient,
    provider: string,
    options: unknown
  ) => Promise<TReturn>,
): CancelablePromise<TReturn> => {
  let controller = new AbortController();
  
  let error: any = undefined;
  
  //If timer is not 0 then set a timeout to abort the execution
  const timer: NodeJS.Timeout | undefined = timeout 
    ? setTimeout(() => {
        error = buildExecError(operation, provider, timeout, new Error("Timeout has been reached")); 
        controller.abort()
      }, timeout)
    : undefined;

    const promise = new Promise<[error: any, result: TReturn | undefined]>(
    async (resolve, reject) => {
      try {
        const result = await exec(ipfs, provider, { signal: controller.signal });
        
        //Clear timeout if exists
        timeout && clearTimeout(timer as NodeJS.Timeout);

        if(result === undefined && !error) {
          return [
            buildExecError(operation, provider, timeout, new Error("The provider returned an empty response")), 
            result
          ];
        }
        resolve([error, result]);
      } catch(e) {
        //Clear timeout if exists
        timeout && clearTimeout(timer as NodeJS.Timeout);
        
        if(!e.message || e.message !== abortErrorMessage) {
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
      timeout && clearTimeout(timer as NodeJS.Timeout);
    }
  };
}

const buildExecError = (operation: string, provider: string, timeout: number, error: any) => {
  return new Error(
    `An error occurred\nOperation: ${operation}\nProvider: ${provider}\nTimeout: ${timeout}\nError: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`
  );
};