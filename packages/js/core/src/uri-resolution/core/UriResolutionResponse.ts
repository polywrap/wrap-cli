import { Uri, Wrapper, IWrapPackage } from "../..";

export class UriResolutionResponse {
  readonly uri?: Uri;
  readonly wrapper?: Wrapper;
  readonly package?: IWrapPackage;

  constructor(response: Uri | Wrapper | IWrapPackage) {
    if ((response as Uri).path) {
      this.uri = response as Uri;
      return;
    }

    const wrapPackage = response as Partial<IWrapPackage>;

    if (wrapPackage.createWrapper) {
      this.package = wrapPackage as IWrapPackage;
      return;
    }

    const wrapper = response as Partial<Wrapper>;

    if (wrapper.invoke) {
      this.wrapper = wrapper as Wrapper;
    }
  }
}
