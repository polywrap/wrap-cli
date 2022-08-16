import { Ok, Result, Uri, Err, Wrapper, IWrapPackage } from "../..";
import {
  UriPackageOrWrapper,
  IUriResolutionStep,
  IUriResolutionResponse,
} from ".";

export class UriResolutionResponse<TError = undefined>
  implements IUriResolutionResponse<TError> {
  public result: Result<UriPackageOrWrapper, TError>;
  public history?: IUriResolutionStep<unknown>[];

  static ok<TError = undefined>(
    uri: Uri,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResponse<TError>;
  static ok<TError = undefined>(
    wrapPackage: IWrapPackage,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResponse<TError>;
  static ok<TError = undefined>(
    wrapper: Wrapper,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResponse<TError>;
  static ok<TError = undefined>(
    uriPackageOrWrapper: UriPackageOrWrapper,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResponse<TError>;
  static ok<TError = undefined>(
    uriPackageOrWrapper: Uri | IWrapPackage | Wrapper | UriPackageOrWrapper,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResponse<TError> {
    const uriPackageOrWrapperUnion = uriPackageOrWrapper as UriPackageOrWrapper;

    if (
      uriPackageOrWrapperUnion.type &&
      (uriPackageOrWrapperUnion.type === "uri" ||
        uriPackageOrWrapperUnion.type === "package" ||
        uriPackageOrWrapperUnion.type === "wrapper")
    ) {
      return {
        result: Ok(uriPackageOrWrapperUnion),
        history,
      } as UriResolutionResponse<TError>;
    }

    const uriPackageOrWrapperType = uriPackageOrWrapper as
      | Uri
      | IWrapPackage
      | Wrapper;

    if ((uriPackageOrWrapperType as Uri).path) {
      return {
        result: Ok({
          type: "uri",
          uri: uriPackageOrWrapperType as Uri,
        } as UriPackageOrWrapper),
        history,
      } as UriResolutionResponse<TError>;
    }

    const wrapPackage = uriPackageOrWrapperType as Partial<IWrapPackage>;

    if (wrapPackage.createWrapper) {
      return {
        result: Ok({
          type: "package",
          package: wrapPackage as IWrapPackage,
        } as UriPackageOrWrapper),
        history,
      } as UriResolutionResponse<TError>;
    }

    const wrapper = uriPackageOrWrapperType as Partial<Wrapper>;

    if (wrapper.invoke) {
      return {
        result: Ok({
          type: "wrapper",
          wrapper: wrapper as Wrapper,
        } as UriPackageOrWrapper),
        history,
      } as UriResolutionResponse<TError>;
    }

    throw new Error("Unexpected type when creating UriResolutionResponse");
  }

  static err<TError = unknown>(
    error: TError,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResponse<TError> {
    return {
      result: Err(error),
      history,
    } as UriResolutionResponse<TError>;
  }
}
