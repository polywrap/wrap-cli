import { IpfsClient } from "../types/IpfsClient";
import { execAbortable } from "./abortable";

//Executes function in a try catch and returns error (if any) and result
//If timeout is reached, it will return an error
//If timeout is 0 then it will wait until the operation is complete
export const execSafe = async <TReturn>(
  operation: string,
  ipfs: IpfsClient,
  provider: string,
  timeout: number,
  func: (
    ipfs: IpfsClient,
    provider: string,
    options: unknown
  ) => Promise<TReturn>
): Promise<[error: Error | undefined, result: TReturn | undefined]> => {
  const { promise } = await execAbortable(
    operation,
    ipfs,
    provider,
    timeout,
    func
  );

  return promise;
};
