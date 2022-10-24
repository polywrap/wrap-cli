export type ExecOptions = {
  timeout: number;
  provider: string;
  fallbackProviders: string[];
  disableParallelRequests: boolean;
};
