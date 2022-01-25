export type CancelablePromise<TReturn> = {
  promise: Promise<[error: Error | undefined, result: TReturn | undefined]>;
  cancel: () => void;
  provider: string;
};
