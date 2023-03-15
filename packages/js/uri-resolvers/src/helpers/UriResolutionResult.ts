import {
  UriPackageOrWrapper,
  UriResolutionStep,
  Uri,
  WrapPackage,
  Wrapper,
} from "@polywrap/wrap-js";
import { Result, ResultOk, ResultErr } from "@polywrap/result";

// $start: UriResolutionResult
/** Factory for creating Result from URI resolution output */
export class UriResolutionResult<TError = undefined> /* $ */ {
  // TODO: are the result and history fields ever assigned or used?
  public result: Result<UriPackageOrWrapper, TError>;
  public history?: UriResolutionStep<unknown>[];

  // $start: UriResolutionResult-ok
  /** Returns a Result with `ok` set to true */
  static ok<TError = undefined>(uri: Uri): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uri: Uri,
    wrapPackage: WrapPackage
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
    packageOrWrapper?: WrapPackage | Wrapper
  ): Result<UriPackageOrWrapper, TError> /* $ */ {
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

    const wrapPackage = packageOrWrapper as Partial<WrapPackage>;

    if (wrapPackage.createWrapper) {
      return ResultOk({
        type: "package",
        uri,
        package: wrapPackage as WrapPackage,
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

  // $start: UriResolutionResult-err
  /** Returns a Result with `ok` set to false */
  static err<TError = unknown>(
    error: TError
  ): Result<UriPackageOrWrapper, TError> /* $ */ {
    return ResultErr(error);
  }
}
