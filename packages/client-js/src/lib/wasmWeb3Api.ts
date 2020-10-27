import { buildSchema, execute, GraphQLObjectType, GraphQLSchema } from "graphql";
import { executeMaybeAsyncFunction, isPromise } from "./async";
import { GqlQuery, GqlQueryResult, Manifest, WasmImports, Web3API } from "./types";
import { WasmWorker } from "./wasm-worker";

export interface WASMWeb3APIParams {
    manifest: Manifest;
    rawSchema: string;
    mutateModule: Maybe<ArrayBuffer>;
    queryModule: Maybe<ArrayBuffer>;
    uri: string;
    cid: string;
}

/**
 * Represents an instance of a WASM Web3API.
 */
export class WASMWeb3API implements Web3API {
    _config: WASMWeb3APIParams;
    _schema: GraphQLSchema;

    constructor(config: WASMWeb3APIParams) {
        this._config = config;
        this._schema = this.prepareSchema();
    }

    private prepareSchema(): GraphQLSchema {
        const { rawSchema, manifest, mutateModule, queryModule } = this._config;

        const buildGraphQLSchema = (): GraphQLSchema => {
            // Convert schema into GraphQL Schema object
            let schema: GraphQLSchema = buildSchema(rawSchema);
        
            // If there's no Query type, add it to avoid execution errors
            if (!schema.getQueryType()) {
                const rawSchemaWithQuery = rawSchema + `type Query { dummy: String }`;
                schema = buildSchema(rawSchemaWithQuery);
            }

            return schema
        }

        const schema = buildGraphQLSchema();

        const mutationType = schema.getMutationType();
        const queryType = schema.getQueryType();
    
        // Wrap all queries & mutations w/ a proxy that
        // loads the module and executes the call
        if (mutationType) {
            if (!manifest.mutation) {
                throw Error("Malformed Manifest: Schema contains mutations but the manifest does not.");
            }

            if (!mutateModule) {
                throw Error("No mutate module.")
            }
    
            this._addResolvers(
                mutateModule,
                mutationType
            );
        }
    
        if (queryType) {
            if (!manifest.query) {
                throw Error("Malformed Manifest: Schema contains queries but the manifest does not.");
            }

            if (!queryModule) {
                throw Error("No query Module")
            }
        
            this._addResolvers(
                queryModule,
                queryType
            );
        }

        return schema;
    }

    private _addResolvers(module: ArrayBuffer, schemaType: GraphQLObjectType<any, any>) {
      
        const schemaFields = schemaType.getFields();
        const schemaFieldNames = Object.keys(schemaFields);

        for (const fieldName of schemaFieldNames) {
            const outputType = schemaFields[fieldName].type.toString().toLowerCase().replace('!', '');

            const wasmWorkerImports: WasmImports = {
              
            };
      
            schemaFields[fieldName].resolve = async (source, args, context, info) => {      
              // Instantiate it
              const ww: WasmWorker = new WasmWorker(
                module,
                wasmWorkerImports);
      
              // TODO: this is very incomplete and hacky, replace with
              //       proper heap manager.
              let mapped = []
              let toRelease = []
      
              // Marshall Types
              const toMarsh = Object.values(args);
              for (const marshMe of toMarsh) {
                let result;
                if (typeof marshMe === "string") {
                  result = (await ww.writeStringAsync(marshMe)).result;
                } else {
                  mapped.push(marshMe);
                  continue;
                }
                mapped.push(result);
                toRelease.push(result);
              }
      
              // Execute the call
              const res = await ww.callAsync(fieldName, ...mapped)
      
              // TODO: validate return value against the schema
              let result: any = res.result;
      
              if (result) {
                if (outputType === "string") {
                  result = (await ww.readStringAsync(result)).result;
                } else if (outputType === "boolean") {
                  result = result === 1 ? true : false;
                } else if (outputType === "int") {
                  if (typeof result === "string") {
                    result = Number.parseInt(result);
                  }
                } else {
                  throw Error(`Unsupported return type: ${outputType}`);
                }
              }
      
              // TODO: have a pattern around reusing workers instead of spinning
              //       them up each time (measure how long that takes first)
              ww.destroy();
      
              return result;
            }
        }
    }

    async query(query: GqlQuery): Promise<GqlQueryResult> {
        const queryDoc = query.query;

        if (queryDoc.definitions.length > 1) {
          throw Error("Multiple async queries is not supported at this time.");
        }

        if (queryDoc.definitions.length === 0) {
          throw Error("Empty query.");
        }

        const def = queryDoc.definitions[0];

        if (def.kind === "OperationDefinition" && def.name) {
            const schema = this._schema;

            const res = await executeMaybeAsyncFunction(execute, {
                schema,
                document: queryDoc,
                variableValues: query.variables
              });
        
            return res;
        } else {
            throw Error("Subgraph not supported yet");
        }
    }

}
