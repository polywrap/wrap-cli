import { Uri } from "../../types";
import { MaybeUriOrApi } from "./MaybeUriOrApi";

export interface UriToApiResolver {
  name: string;
  resolveUri(uri: Uri): Promise<MaybeUriOrApi>;
};