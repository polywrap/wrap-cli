import { QueryDocument } from "./";
import { ExecuteOptions } from "../web3api";

import {
  SelectionSetNode,
  ValueNode
} from "graphql";

export function extractExecuteOptions(
  doc: QueryDocument,
  variables?: Record<string, unknown>
): ExecuteOptions {
  if (doc.definitions.length === 0) {
    throw Error(
      "Empty query document found."
    );
  }

  if (doc.definitions.length > 1) {
    throw Error(
      "Multiple simultaneous queries not yet supported."
    );
  }

  const def = doc.definitions[0];

  if (def.kind !== "OperationDefinition") {
    throw Error(
      `Unrecognized root level definition type: ${def.kind}\n` +
      "Please use a 'query' or 'mutation' operations."
    );
  }

  // Get the module name (query or mutation)
  const module = def.operation;

  if (module === "subscription") {
    throw Error(
      "Subscription queries are not yet supported."
    );
  }

  // Get the method name
  const selectionSet = def.selectionSet;
  const selections = selectionSet.selections;

  if (selections.length === 0) {
    throw Error(
      "Empty selection set found. Please include the name of a method you'd like to query."
    );
  }

  if (selections.length > 1) {
    throw Error(
      "Multiple simultaneous queries not yet supported"
    );
  }

  const selection = selections[0];

  if (selection.kind !== "Field") {
    throw Error(
      `Unsupported selection type found: ${selection.kind}\n` +
      "Please query a method."
    );
  }

  const method = selection.name.value;

  // Get all arguments
  const selectionArgs = selection.arguments;
  let args: Record<string, unknown> = {};

  if (selectionArgs) {
    for (const arg of selectionArgs) {
      const name = arg.name.value;
      const valueDef = arg.value;
      args[name] = extractValue(valueDef, variables);
    }
  }

  // Get the results the query is asking for
  const selectionResults = selection.selectionSet;
  let results: Record<string, unknown> = {};

  if (selectionResults) {
    results = extractSelections(selectionResults);
  }

  return {
    module,
    method,
    input: args,
    results
  }
}

function extractValue(node: ValueNode, variables?: Record<string, unknown>): unknown {
  if (node.kind === "Variable") {
    // Get the argument's value from the variables object
    if (!variables) {
      throw Error(
        `Variables were not specified, tried to resolve variable from query. Name: ${node.name.value}\n`
      );
    }
    return variables[node.name.value];
  } else if (
    node.kind === "StringValue" ||
    node.kind === "BooleanValue" ||
    node.kind === "IntValue" ||
    node.kind === "FloatValue" ||
    node.kind === "EnumValue"
  ) {
    return node.value;
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
    const result: Record<string, unknown> = { };

    for (let i = 0; i < length; ++i) {
      const field = node.fields[i];
      result[field.name.value] = extractValue(field.value, variables);
    }

    return result;
  } else {
    throw Error(`Unsupported value node: ${node}`)
  }
}

function extractSelections(node: SelectionSetNode): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const selection of node.selections) {
    if (selection.kind !== "Field") {
      throw Error(
        "Unsupported result selection type found: ${result.kind}"
      );
    }

    const name = selection.name.value;

    if (selection.selectionSet) {
      result[name] = extractSelections(selection.selectionSet);
    } else {
      result[name] = true;
    }
  }

  return result;
}
