import { resolveURI, Web3APIModuleResolver } from "./lib/resolver";
import { GqlQuery, GqlQueryResult, Web3APIDefinition } from "./lib/types";

export class Web3APIClient {

    _definitionCache: Map<string, Web3APIDefinition> = new Map<string, Web3APIDefinition>();

    constructor(private _resolvers: Web3APIModuleResolver[]) {
    }

    public async query(uri: string, query: GqlQuery): Promise<GqlQueryResult> {
        const apiDefinition = await this.getWeb3APIDefinition(uri);
        const instance = await apiDefinition.create();
        return await instance.query(query);
    }

    /**
     * Gets the definition of a Web3API at a given URI.
     * @param uri The URI of the Web3API to get the definition of.
     */
    private async getWeb3APIDefinition(uri: string): Promise<Web3APIDefinition> {
        let definition: Maybe<Web3APIDefinition> = this._definitionCache.get(uri);

        if (!definition) {
            definition = await resolveURI(uri, this._resolvers);
            if (!definition) {
                throw new Error(`Unable to resolve ${uri} into a Web3API`);
            }

            this._definitionCache.set(uri, definition);
        }

    
        return definition;
    }
    
}