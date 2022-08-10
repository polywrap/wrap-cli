import { IUriResolutionStep, IWrapPackage, Uri, Wrapper } from "../..";

export class UriResolutionResult {
  response: Uri | Wrapper | IWrapPackage;
  history?: IUriResolutionStep[];

  constructor(
    response: Uri | Wrapper | IWrapPackage,
    history?: IUriResolutionStep[]
  ) {
    this.response = response;
    this.history = history;
  }

  uri(): Uri | undefined {
    if ((this.response as Uri).path) {
      return this.response as Uri;
    }

    return undefined;
  }

  package(): IWrapPackage | undefined {
    const wrapPackage = this.response as Partial<IWrapPackage>;

    if (wrapPackage.createWrapper) {
      return wrapPackage as IWrapPackage;
    }

    return undefined;
  }

  wrapper(): Wrapper | undefined {
    const wrapper = this.response as Partial<Wrapper>;

    if (wrapper.invoke) {
      return wrapper as Wrapper;
    }

    return undefined;
  }
}
