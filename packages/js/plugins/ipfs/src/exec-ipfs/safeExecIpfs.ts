import { IpfsClient } from "../types/IpfsClient";
import { cancelableExecIpfs } from "./cancelableExecIpfs";

//Executes exec in a try catch and returns error (if any) and result
//If timeout is reached, it will return an error
//If timeout is 0 then it will wait until the operation is complete
export const safeExecIpfs = async <TReturn>( 
  operation: string,
  ipfs: IpfsClient,
  provider: string,
  timeout: number,
  exec: (
    ipfs: IpfsClient,
    provider: string,
    options: unknown
  ) => Promise<TReturn>,
): Promise<[error: any, result: TReturn | undefined]>  => {
  const { promise } = await cancelableExecIpfs(operation, ipfs, provider, timeout, exec);

  return promise;
}
