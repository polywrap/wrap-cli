export interface ExecOptions {
  timeout: number;
  provider: string;
  fallbackProviders: string[];
  disableParallelRequests: boolean;
}
