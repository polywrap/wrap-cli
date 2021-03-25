import { QueryApiInvocations, QueryDocument, Uri } from "../types";

import { SelectionSetNode, ValueNode } from "graphql";
import { Tracer } from "@web3api/tracing";

export function parseQuery(
  uri: Uri,
  doc: QueryDocument,
  variables?: Record<string, unknown>
): QueryApiInvocations {
  Tracer.startSpan("core: parseQuery");

  Tracer.setAttribute("uri", uri);
  Tracer.setAttribute("doc", doc);
  Tracer.setAttribute("variables", variables);

  try {
    if (doc.definitions.length === 0) {
      throw Error("Empty query document found.");
    }

    const queryInvocations: QueryApiInvocations = {};

    for (const def of doc.definitions) {
      if (def.kind !== "OperationDefinition") {
        throw Error(
          `Unrecognized root level definition type: ${def.kind}\n` +
            "Please use a 'query' or 'mutation' operations."
        );
      }

      // Get the module name (query or mutation)
      const module = def.operation;

      if (module === "subscription") {
        throw Error("Subscription queries are not yet supported.");
      }

      // Get the method name
      const selectionSet = def.selectionSet;
      const selections = selectionSet.selections;

      if (selections.length === 0) {
        throw Error(
          "Empty selection set found. Please include the name of a method you'd like to query."
        );
      }

      for (const selection of selections) {
        if (selection.kind !== "Field") {
          throw Error(
            `Unsupported selection type found: ${selection.kind}\n` +
              "Please query a method."
          );
        }

        const method = selection.name.value;
        const invocationName = selection.alias ? selection.alias.value : method;

        if (queryInvocations[invocationName]) {
          throw Error(
            `Duplicate query name found "${invocationName}". Please use GraphQL aliases that each have unique names.`
          );
        }

        // Get all input arguments
        const selectionArgs = selection.arguments;
        const input: Record<string, unknown> = {};

        if (selectionArgs) {
          for (const arg of selectionArgs) {
            const name = arg.name.value;

            if (input[name]) {
              throw Error(`Duplicate input argument found: ${name}`);
            }

            const valueDef = arg.value;
            input[name] = extractValue(valueDef, variables);

            Tracer.addEvent("extractValue done", input[name]);
          }
        }

        // Get the results the query is asking for
        const selectionResults = selection.selectionSet;
        let resultFilter: Record<string, unknown> | undefined = undefined;

        if (selectionResults) {
          resultFilter = extractSelections(selectionResults);

          Tracer.addEvent("extractSelection done", resultFilter);
        }

        queryInvocations[invocationName] = {
          uri,
          module,
          method,
          input,
          resultFilter,
        };
      }
    }

    Tracer.addEvent("parse query finished", queryInvocations);
    Tracer.endSpan();

    return queryInvocations;
  } catch (error) {
    Tracer.recordException(error);

    throw error;
  } finally {
    Tracer.endSpan();
  }
}

function extractValue(
  node: ValueNode,
  variables?: Record<string, unknown>
): unknown {
  Tracer.addEvent("core: extractValue", { node, variables });

  if (node.kind === "Variable") {
    // Get the argument's value from the variables object
    if (!variables) {
      throw Error(
        `Variables were not specified, tried to resolve variable from query. Name: ${node.name.value}\n`
      );
    }

    if (!variables[node.name.value]) {
      throw Error(`Missing variable: ${node.name.value}`);
    }

    return variables[node.name.value];
  } else if (
    node.kind === "StringValue" ||
    node.kind === "EnumValue" ||
    node.kind === "BooleanValue"
  ) {
    return node.value;
  } else if (node.kind === "IntValue") {
    return Number.parseInt(node.value);
  } else if (node.kind === "FloatValue") {
    return Number.parseFloat(node.value);
  } else if (node.kind === "NullValue") {
    return null;
  } else if (node.kind === "ListValue") {
    const length = node.values.length;
    const result = [];

    for (let i = 0; i < length; ++i) {
      result.push(extractValue(node.values[i], variables));
    }

    return result;
  } else if (node.kind === "ObjectValue") {
    const length = node.fields.length;
    const result: Record<string, unknown> = {};

    for (let i = 0; i < length; ++i) {
      const field = node.fields[i];
      result[field.name.value] = extractValue(field.value, variables);
    }

    return result;
  } else {
    throw Error(`Unsupported value node: ${node}`);
  }
}

function extractSelections(node: SelectionSetNode): Record<string, unknown> {
  Tracer.addEvent("core: extractSelections", { node });

  const result: Record<string, unknown> = {};

  for (const selection of node.selections) {
    if (selection.kind !== "Field") {
      throw Error(`Unsupported result selection type found: ${selection.kind}`);
    }

    const name = selection.name.value;

    if (result[name]) {
      throw Error(`Duplicate result selections found: ${name}`);
    }

    if (selection.selectionSet) {
      result[name] = extractSelections(selection.selectionSet);
    } else {
      result[name] = true;
    }
  }

  return result;
}
