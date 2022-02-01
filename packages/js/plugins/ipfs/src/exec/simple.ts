import { IpfsClient } from "../types/IpfsClient";
import { execSafe } from "./safe";

//Executes function in a try catch and returns error (if any) and result
//If timeout is reached, it will return an error
//If timeout is 0 then it will wait until the operation is complete
export const execSimple = async <TReturn>(
  operation: string,
  ipfs: IpfsClient,
  provider: string,
  timeout: number,
  func: (
    ipfs: IpfsClient,
    provider: string,
    options: unknown
  ) => Promise<TReturn>
): Promise<TReturn> => {
  const [error, result] = await execSafe(
    operation,
    ipfs,
    provider,
    timeout,
    func
  );

  if (error) {
    throw error;
  }

  return result as TReturn;
};
