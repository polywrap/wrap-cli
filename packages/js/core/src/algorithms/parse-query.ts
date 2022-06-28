import { QueryInvocations, QueryDocument, Uri } from "../types";

import { SelectionSetNode, ValueNode } from "graphql";
import { Tracer } from "@polywrap/tracing-js";

export const parseQuery = Tracer.traceFunc(
  "core: parseQuery",
  (
    uri: Uri,
    doc: QueryDocument,
    variables?: Record<string, unknown>
  ): QueryInvocations<Uri> => {
    if (doc.definitions.length === 0) {
      throw Error("Empty query document found.");
    }

    const queryInvocations: QueryInvocations<Uri> = {};

    for (const def of doc.definitions) {
      if (def.kind !== "OperationDefinition") {
        throw Error(
          `Unrecognized root level definition type: ${def.kind}\n` +
            "Please use a 'query' or 'mutation' operations."
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

        // Get all arguments
        const selectionArgs = selection.arguments;
        const args: Record<string, unknown> = {};

        if (selectionArgs) {
          for (const arg of selectionArgs) {
            const name = arg.name.value;

            if (args[name]) {
              throw Error(`Duplicate arguments found: ${name}`);
            }

            args[name] = extractValue(arg.value, variables);
          }
        }

        queryInvocations[invocationName] = {
          uri,
          method,
          args,
        };
      }
    }

    return queryInvocations;
  }
);

const extractValue = Tracer.traceFunc(
  "core: extractValue",
  (node: ValueNode, variables?: Record<string, unknown>): unknown => {
    if (node.kind === "Variable") {
      // Get the argument's value from the variables object
      if (!variables) {
        throw Error(
          `Variables were not specified, tried to resolve variable from query. Name: ${node.name.value}\n`
        );
      }

      if (variables[node.name.value] === undefined) {
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
      const list = [];

      for (let i = 0; i < length; ++i) {
        list.push(extractValue(node.values[i], variables));
      }

      return list;
    } else if (node.kind === "ObjectValue") {
      const length = node.fields.length;
      const object: Record<string, unknown> = {};

      for (let i = 0; i < length; ++i) {
        const field = node.fields[i];
        object[field.name.value] = extractValue(field.value, variables);
      }

      return object;
    } else {
      throw Error(`Unsupported value node: ${node}`);
    }
  }
);

export const extractSelections = Tracer.traceFunc(
  "core: extractSelections",
  (node: SelectionSetNode): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    for (const selection of node.selections) {
      if (selection.kind !== "Field") {
        throw Error(
          `Unsupported result selection type found: ${selection.kind}`
        );
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
);
