import { Web3APIDefinition } from "../types";

/**
 * A Web 3 API Module Resolver will attempt to resolve a given URI into a Web3APIDefinition.
 * If the resolution fails, then undefined returns.
 */
export type Web3APIModuleResolver = (uri: string) => Promise<Maybe<Web3APIDefinition>>;

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

