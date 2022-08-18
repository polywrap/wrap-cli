import { IWrapPackage, Wrapper, Client, Uri } from "..";

export const initWrapper = async (
  packageOrWrapper: IWrapPackage | Wrapper,
  client: Client,
  uriHistory: Uri[]
): Promise<Wrapper> => {
  const wrapPackage = packageOrWrapper as Partial<IWrapPackage>;

  if (wrapPackage.createWrapper) {
    return await wrapPackage.createWrapper(client, uriHistory);
  } else {
    return packageOrWrapper as Wrapper;
  }
};
