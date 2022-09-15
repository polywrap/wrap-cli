import { Uri, Wrapper } from "@polywrap/core-js";

export type WrapperRegistration = {
  uri: string | Uri;
  wrapper: Wrapper;
};
