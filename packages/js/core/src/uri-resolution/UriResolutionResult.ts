import { UriPackageOrWrapper, IUriResolutionStep } from ".";
import { Uri, IWrapPackage, Wrapper } from "..";

import { Result, ResultOk, ResultErr } from "@polywrap/result";

export class UriResolutionResult<TError = undefined> {
  public result: Result<UriPackageOrWrapper, TError>;
  public history?: IUriResolutionStep<unknown>[];

  static ok<TError = undefined>(uri: Uri): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    wrapPackage: IWrapPackage
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    wrapper: Wrapper
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uriPackageOrWrapper: UriPackageOrWrapper
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uriPackageOrWrapper: Uri | IWrapPackage | Wrapper | UriPackageOrWrapper
  ): Result<UriPackageOrWrapper, TError> {
    const uriPackageOrWrapperUnion = uriPackageOrWrapper as UriPackageOrWrapper;

    if (
      uriPackageOrWrapperUnion.type &&
      (uriPackageOrWrapperUnion.type === "uri" ||
        uriPackageOrWrapperUnion.type === "package" ||
        uriPackageOrWrapperUnion.type === "wrapper")
    ) {
      return ResultOk(uriPackageOrWrapperUnion);
    }

    const uriPackageOrWrapperType = uriPackageOrWrapper as
      | Uri
      | IWrapPackage
      | Wrapper;

    if ((uriPackageOrWrapperType as Uri).path) {
      return ResultOk({
        type: "uri",
        uri: uriPackageOrWrapperType as Uri,
      } as UriPackageOrWrapper);
    }

    const wrapPackage = uriPackageOrWrapperType as Partial<IWrapPackage>;

    if (wrapPackage.createWrapper) {
      return ResultOk({
        type: "package",
        package: wrapPackage as IWrapPackage,
      } as UriPackageOrWrapper);
    }

    const wrapper = uriPackageOrWrapperType as Partial<Wrapper>;

    if (wrapper.invoke) {
      return ResultOk({
        type: "wrapper",
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
