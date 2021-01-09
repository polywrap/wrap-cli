import {
  InvokeApiOptions,
  QueryDocument,
  Uri
} from "../types";

import {
  SelectionSetNode,
  ValueNode
} from "graphql";

export function parseQuery(
  uri: Uri,
  doc: QueryDocument,
  variables?: Record<string, unknown>
): InvokeApiOptions[] {
  if (doc.definitions.length === 0) {
    throw Error("Empty query document found.");
  }

  const invokeOptions: InvokeApiOptions[] = [];

  for (const def of doc.definitions) {
    if (def.kind !== "OperationDefinition") {
      throw Error(
        `Unrecognized root level definition type: ${def.kind}\n` + "Please use a 'query' or 'mutation' operations."
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
      throw Error("Empty selection set found. Please include the name of a method you'd like to query.");
    }

    for (const selection of selections) {
      if (selection.kind !== "Field") {
        throw Error(`Unsupported selection type found: ${selection.kind}\n` + "Please query a method.");
      }

      const method = selection.name.value;

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
        }
      }

      // Get the results the query is asking for
      const selectionResults = selection.selectionSet;
      let resultFilter: Record<string, unknown> = {};

      if (selectionResults) {
        resultFilter = extractSelections(selectionResults);
      }

      invokeOptions.push({
        uri,
        module,
        method,
        input,
        resultFilter,
      });
    }
  }

  return invokeOptions;
}

function extractValue(node: ValueNode, variables?: Record<string, unknown>): unknown {
  if (node.kind === "Variable") {
    // Get the argument's value from the variables object
    if (!variables) {
      throw Error(`Variables were not specified, tried to resolve variable from query. Name: ${node.name.value}\n`);
    }

    if (!variables[node.name.value]) {
      throw Error(`Missing variable: ${node.name.value}`);
    }

    return variables[node.name.value];
  } else if (node.kind === "StringValue" || node.kind === "EnumValue" || node.kind === "BooleanValue") {
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
