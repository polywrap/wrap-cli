import { Manifest, Web3API, Web3APIDefinition } from "./types";
import { WASMWeb3API } from "./wasmWeb3Api";
import { JSWeb3API, JSWeb3APIParams } from "./JSWeb3Api";

export interface Web3APIWASMModules {
    query: Maybe<ArrayBuffer>;
    mutate: Maybe<ArrayBuffer>;
}

export interface WASMWeb3APIDefinitionParams {
    uri: string,
    cid: string,
    module: Web3APIWASMModules,
    manifest: Manifest,
    schema: string
}

/**
 * Instance of a WASM Web3API Definition.
 */
export class WASMWeb3APIDefinition implements Web3APIDefinition {
    constructor(public config: WASMWeb3APIDefinitionParams) {
    }

    /**
     * Creates an instance of the WASM Web 3 API.
     */
    public async create(): Promise<Web3API> {
        return new WASMWeb3API({
            uri: this.config.uri,
            cid: this.config.cid,
            manifest: this.config.manifest,
            rawSchema: this.config.schema,
            mutateModule: this.config.module.mutate,
            queryModule: this.config.module.query
        });
    }
}


/**
 * Represents an instance of a JS Web3API Definition.
 */
export class JSWeb3APIDefinition implements Web3APIDefinition {

    constructor(private _schema: string, private _factory: Function) {
    }

    public async create(): Promise<Web3API> {

        const apiObject = this._factory();

        if (typeof(apiObject) !== 'object') {
            throw Error(`JS Web3API is not an object.`)
        }

        const apiArguments: JSWeb3APIParams = {
            rawSchema: this._schema,
            module: apiObject
        }

        const api = new JSWeb3API(apiArguments);
        return api;
    }
}
