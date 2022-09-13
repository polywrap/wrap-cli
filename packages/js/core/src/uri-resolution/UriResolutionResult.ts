import { UriPackageOrWrapper, IUriResolutionStep } from ".";
import { Uri, IWrapPackage, Wrapper } from "..";

import { Result, ResultOk, ResultErr } from "@polywrap/result";

export class UriResolutionResult<TError = undefined> {
  public result: Result<UriPackageOrWrapper, TError>;
  public history?: IUriResolutionStep<unknown>[];

  static ok<TError = undefined>(uri: Uri): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uri: Uri,
    wrapPackage: IWrapPackage
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uri: Uri,
    wrapper: Wrapper
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uri: Uri,
    packageOrWrapper?: IWrapPackage | Wrapper
  ): Result<UriPackageOrWrapper, TError> {
    if (!packageOrWrapper) {
      return ResultOk({
        type: "uri",
        uri,
      } as UriPackageOrWrapper);
    }

    const wrapPackage = packageOrWrapper as Partial<IWrapPackage>;

    if (wrapPackage.createWrapper) {
      return ResultOk({
        type: "package",
        uri,
        package: wrapPackage as IWrapPackage,
      } as UriPackageOrWrapper);
    }

    const wrapper = packageOrWrapper as Partial<Wrapper>;

    if (wrapper.invoke) {
      return ResultOk({
        type: "wrapper",
        uri,
        wrapper: wrapper as Wrapper,
      } as UriPackageOrWrapper);
    }

    throw new Error("Unexpected type when creating UriResolutionResponse");
  }

  static err<TError = unknown>(
    error: TError
  ): Result<UriPackageOrWrapper, TError> {
    return ResultErr(error);
  }
}
