import { IWrapPackage, Wrapper } from "..";

export const initWrapper = async (
  packageOrWrapper: IWrapPackage | Wrapper
): Promise<Wrapper> => {
  const wrapPackage = packageOrWrapper as Partial<IWrapPackage>;

  if (wrapPackage.createWrapper) {
    return await wrapPackage.createWrapper();
  } else {
    return packageOrWrapper as Wrapper;
  }
};
