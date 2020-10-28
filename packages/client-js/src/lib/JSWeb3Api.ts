import { buildSchema, execute, GraphQLObjectType, GraphQLSchema } from "graphql";
import { executeMaybeAsyncFunction } from "./async";
import { GqlQuery, GqlQueryResult, Web3API } from "./types";

export interface JSWeb3APIMethods {
    [key: string]: Function
}

export interface JSWeb3APIModule {
    Query: JSWeb3APIMethods,
    Mutate: JSWeb3APIMethods
}

export interface JSWeb3APIParams {
    rawSchema: string;
    module: JSWeb3APIModule;
}


export class JSWeb3API implements Web3API {
    _config: JSWeb3APIParams;
    _schema: GraphQLSchema;

    constructor(config: JSWeb3APIParams) {
        this._config = config;
        this._schema = this.prepareSchema(this._config.rawSchema, this._config.module);
    }

    private prepareSchema(rawSchema: string, module: JSWeb3APIModule): GraphQLSchema {

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
            this._addResolvers(
                module.Mutate,
                mutationType
            );
        }
    
        if (queryType) {
            this._addResolvers(
                module.Query,
                queryType
            );
        }

        return schema;
    }

    private _addResolvers(module: JSWeb3APIMethods, schemaType: GraphQLObjectType<any, any>) {
      
        const schemaFields = schemaType.getFields();
        const schemaFieldNames = Object.keys(schemaFields);

        for (const fieldName of schemaFieldNames) {
            schemaFields[fieldName].resolve = async (source, args, context, info) => {

              const method = this._getModuleMethod(module, fieldName);

              const result = await executeMaybeAsyncFunction(method, args)

              return result;
            }
        }
    }

    private _getModuleMethod(module: JSWeb3APIMethods, method: string): Function {
        // Find function
        if (!module[method]) {
            throw Error(`Expected member '${method}' to be defined.`);
        }

        if (typeof(module[method]) !== 'function') {
            throw Error(`Expected '${method}' to be a function.`)
        }

        return module[method] as Function;
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

        if (def.kind === "OperationDefinition" && def.operation) {
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