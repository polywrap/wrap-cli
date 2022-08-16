import { IWrapPackage, Wrapper, Client } from "..";

export const initWrapper = async (
  packageOrWrapper: IWrapPackage | Wrapper,
  client: Client
): Promise<Wrapper> => {
  const wrapPackage = packageOrWrapper as Partial<IWrapPackage>;

  if (wrapPackage.createWrapper) {
    return await wrapPackage.createWrapper(client);
  } else {
    return packageOrWrapper as Wrapper;
  }
};
