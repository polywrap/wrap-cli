import { BindOptions, BindOutput } from "../";

export type GenerateBindingFn = (
  options: BindOptions
) => Promise<BindOutput> | BindOutput;

export type MustacheFn = () => (
  value: string,
  render: (template: string) => string
) => string;

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface Args_generateBindings {
  wrapInfo: WrapInfo;
  context?: string | null; // JSON string
}

export interface WrapInfo {
  version: string;
  name: string;
  type: string;
  abi: string; // JSON string
}

export interface Output {
  files: Array<File>;
  dirs: Array<Directory>;
}

export interface File {
  name: string;
  data: string;
}

export interface Directory {
  name: string;
  files: Array<File>;
  dirs: Array<Directory>;
}
