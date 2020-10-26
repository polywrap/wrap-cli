import { WASMWeb3APIDefinition } from "./definitions";
import { Web3APIDefinition } from "./types";

/**
 * A Web 3 API Module Resolver will attempt to resolve a given URI into a Web3APIDefinition.
 * If the resolution fails, then undefined returns.
 */
export type Web3APIModuleResolver = (uri: string) => Promise<Maybe<Web3APIDefinition>>;


/**
 * Resolves a Web3API via IPFS.
 * @param uri The Web3API URI to resolve.
 */
export const IPFSResolver: Web3APIModuleResolver = async (uri: string) => {
    // @TODO: Implement the actual resolution of the ENS domain (or IPFS Hash) and fetching of data into this resolver
    return new WASMWeb3APIDefinition(uri);
}

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

/**
 * Resolves a URI to a Web3APIModuleDefinition
 * @param uri The URI to resolve
 * @param resolvers An array of resolvers, ordered in resolution order.
 */
export async function resolveURI(uri: string, resolvers: Web3APIModuleResolver[]): Promise<Maybe<Web3APIDefinition>> {
    for (let resolver of resolvers) {
        const module: Maybe<Web3APIDefinition> = await resolver(uri);
        if (module !== undefined) {
            return module;
        }
    }

    return undefined;
}

