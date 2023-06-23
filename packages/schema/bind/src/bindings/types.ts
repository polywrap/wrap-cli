import { BindOptions, BindOutput } from "../";

export type GenerateBindingFn = (options: BindOptions) => Promise<BindOutput> | BindOutput;

export type MustacheFn = () => (
  value: string,
  render: (template: string) => string
) => string;
