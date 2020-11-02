import { JSWeb3APIDefinition } from "../definitions";
import { Client } from "../types";

import * as fs from 'fs';
import { JSWeb3APIModule } from "../JSWeb3Api";
import { Web3APIModuleResolver } from ".";

type ResolveToJSModuleFunction = (schemaPath: string, factory: (client: Client) => Promise<JSWeb3APIModule>) => Web3APIModuleResolver;

export const ResolveToJSModule: ResolveToJSModuleFunction = (schemaPath: string, factory: (client: Client) => Promise<JSWeb3APIModule>) => {
  const schemaExists = fs.existsSync(schemaPath);
  if (!schemaExists) {
    throw Error(`No schema for JS Module at '${schemaPath}'`);
  }

  const schema = fs.readFileSync(schemaPath).toString();

  return async (uri: string) => {
    return new JSWeb3APIDefinition(schema, factory);
  }
}

/*
example code:

createPatternResolver("ethereum.eth",
  ResolveToJSModule(
    "./src/jsModules/Ethereum/schema.graphql",
    async (client: Client) => {
      const rpcEndPoint = "http://localhost:8545";
      return EthereumJSModule({provider: rpcEndPoint});
    }
  )
)

*/