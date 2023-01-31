import {
  UriPackageOrWrapper,
  IUriResolutionStep,
  Uri,
  IWrapPackage,
  Wrapper,
} from "@polywrap/core-js";
import { Result, ResultOk, ResultErr } from "@polywrap/result";

/** Factory for creating Result from URI resolution output */
export class UriResolutionResult<TError = undefined> {
  // TODO: are the result and history fields ever assigned or used?
  public result: Result<UriPackageOrWrapper, TError>;
  public history?: IUriResolutionStep<unknown>[];

  /** Returns a Result with `ok` set to true */
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
    uriPackageOrWrapper: UriPackageOrWrapper
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uriPackageOrWrapper: Uri | UriPackageOrWrapper,
    packageOrWrapper?: IWrapPackage | Wrapper
  ): Result<UriPackageOrWrapper, TError> {
    if (!packageOrWrapper) {
      if ((uriPackageOrWrapper as UriPackageOrWrapper).type) {
        return ResultOk(uriPackageOrWrapper as UriPackageOrWrapper);
      } else {
        return ResultOk({
          type: "uri",
          uri: uriPackageOrWrapper as Uri,
        } as UriPackageOrWrapper);
      }
    }

    const uri = uriPackageOrWrapper as Uri;

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

  /** Returns a Result with `ok` set to false */
  static err<TError = unknown>(
    error: TError
  ): Result<UriPackageOrWrapper, TError> {
    return ResultErr(error);
  }
}
