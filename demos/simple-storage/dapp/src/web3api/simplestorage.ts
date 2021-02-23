import { Uri, Web3ApiClient } from "@web3api/client-js";

export const uri = new Uri("ens/api.simplestorage.eth");

export interface SetDataResult {
  txReceipt: string,
  value: number
};

export async function setData(
  contract: string,
  value: number,
  client: Web3ApiClient
): Promise<SetDataResult> {
  const { data, errors } = await client.query<{
    setData: SetDataResult
  }>({
    uri,
    query: `mutation {
      setData(options: {
        address: "${contract}"
        value: ${value}
      })
    }`
  });

  if (errors || !data) {
    throw errors;
  }

  return data.setData;
}

export async function deployContract(
  client: Web3ApiClient
): Promise<string> {
  const { data, errors } = await client.query<{
    deployContract: string
  }>({
    uri,
    query: `mutation { deployContract }`
  });

  if (errors || !data) {
    throw errors;
  }

  return data.deployContract;
}
