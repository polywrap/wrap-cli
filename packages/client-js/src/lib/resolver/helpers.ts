import { Web3APIModuleResolver } from ".";

// Helper to match a uri to a pattern (* wildcards only)
function uriMatchesPattern(uri: string, pattern: string): boolean {
  pattern = pattern.replace(/\./g, '\.');
  const patternMatcher = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
  return patternMatcher.test(uri);
}

/**
* Wraps a resolver with a pattern matching resolver.
* The wrapped resolver will only be used if the uri matches the pattern.
* @param pattern The uri pattern to match against.
* @param resolver The resolver to use if the URI matches the pattern.
*/
export function createPatternResolver(pattern: string, resolver: Web3APIModuleResolver): Web3APIModuleResolver {
  return async (uri: string) => {

      if (uriMatchesPattern(uri, pattern)) {
          return await resolver(uri);
      }

      return undefined;
  }
}