import {
  NodeDependencyFetcher,
  YarnDependencyFetcher,
} from "./NodeDependencyFetcher";

export const dependencyFetcherClassMap = {
  npm: NodeDependencyFetcher,
  yarn: YarnDependencyFetcher,
};
