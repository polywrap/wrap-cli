import { Ok, Result, Uri, Err, Wrapper, IWrapPackage } from "../..";
import {
  IUriResolutionResult,
  IUriResolutionStep,
  UriResolutionResponse,
} from ".";

export class UriResolutionResult<TError = undefined>
  implements IUriResolutionResult<TError> {
  public response: Result<UriResolutionResponse, TError>;
  public history?: IUriResolutionStep<unknown>[];

  static ok<TError = undefined>(
    uri: Uri,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResult<TError>;
  static ok<TError = undefined>(
    wrapPackage: IWrapPackage,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResult<TError>;
  static ok<TError = undefined>(
    wrapper: Wrapper,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResult<TError>;
  static ok<TError = undefined>(
    response: UriResolutionResponse,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResult<TError>;
  static ok<TError = undefined>(
    uriPackageOrWrapperOrResponse:
      | Uri
      | IWrapPackage
      | Wrapper
      | UriResolutionResponse,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResult<TError> {
    const response = uriPackageOrWrapperOrResponse as UriResolutionResponse;
    if (
      response.type &&
      (response.type === "uri" ||
        response.type === "package" ||
        response.type === "wrapper")
    ) {
      return {
        response: Ok(response),
        history,
      } as UriResolutionResult<TError>;
    }

    const uriPackageOrWrapper = uriPackageOrWrapperOrResponse as
      | Uri
      | IWrapPackage
      | Wrapper;

    if ((uriPackageOrWrapper as Uri).path) {
      return {
        response: Ok({
          type: "uri",
          uri: uriPackageOrWrapper as Uri,
        } as UriResolutionResponse),
        history,
      } as UriResolutionResult<TError>;
    }

    const wrapPackage = uriPackageOrWrapper as Partial<IWrapPackage>;

    if (wrapPackage.createWrapper) {
      return {
        response: Ok({
          type: "package",
          package: wrapPackage as IWrapPackage,
        } as UriResolutionResponse),
        history,
      } as UriResolutionResult<TError>;
    }

    const wrapper = uriPackageOrWrapper as Partial<Wrapper>;

    if (wrapper.invoke) {
      return {
        response: Ok({
          type: "wrapper",
          wrapper: wrapper as Wrapper,
        } as UriResolutionResponse),
        history,
      } as UriResolutionResult<TError>;
    }

    throw new Error("Unexpected type when creating UriResolutionResult");
  }

  static err<TError = unknown>(
    error: TError,
    history?: IUriResolutionStep<unknown>[]
  ): UriResolutionResult<TError> {
    return {
      response: Err(error),
      history,
    } as UriResolutionResult<TError>;
  }
}
