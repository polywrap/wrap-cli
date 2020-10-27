import { TargetLanguage } from "./";
import { GraphQLSchema, parse, visit } from "graphql";
import { printSchemaWithDirectives } from "graphql-toolkit";

export interface OutputEntry {
  type: "File" | "Directory";
  name: string;
  data: string | OutputEntry[];
}

export interface OutputDirectory {
  entries: OutputEntry[]
}

export function generateCode(langauge: TargetLanguage, schema: GraphQLSchema): OutputDirectory {
  // TODO: generators
  // custom_type
  // custom_enum
  // query_method
  // mutation_method
  const printedSchema = printSchemaWithDirectives(schema);
  const astNode = parse(printedSchema);
  const visitor = getVisitor(langauge, schema);
  const visitorResults = visit(astNode, { leave: visitor });

  // TODO: do something with the generated code...
  console.log(visitorResults);
}
