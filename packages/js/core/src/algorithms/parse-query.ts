import { QueryInvocations, QueryDocument, Uri, InvokeResult } from "../types";

import { SelectionSetNode, ValueNode } from "graphql";
import { Tracer } from "@polywrap/tracing-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";

export const parseQuery = Tracer.traceFunc(
  "core: parseQuery",
  (
    uri: Uri,
    doc: QueryDocument,
    variables?: Record<string, unknown>
  ): Result<QueryInvocations<Uri>, Error> => {
    if (doc.definitions.length === 0) {
      return ResultErr(Error("Empty query document found."));
    }

    const queryInvocations: QueryInvocations<Uri> = {};

    for (const def of doc.definitions) {
      if (def.kind !== "OperationDefinition") {
        const error = Error(
          `Unrecognized root level definition type: ${def.kind}\n` +
            "Please use a 'query' or 'mutation' operations."
        );
        return ResultErr(error);
      }

      // Get the method name
      const selectionSet = def.selectionSet;
      const selections = selectionSet.selections;

      if (selections.length === 0) {
        const error = Error(
          "Empty selection set found. Please include the name of a method you'd like to query."
        );
        return ResultErr(error);
      }

      for (const selection of selections) {
        if (selection.kind !== "Field") {
          const error = Error(
            `Unsupported selection type found: ${selection.kind}\n` +
              "Please query a method."
          );
          return ResultErr(error);
        }

        const method = selection.name.value;
        const invocationName = selection.alias ? selection.alias.value : method;

        if (queryInvocations[invocationName]) {
          const error = Error(
            `Duplicate query name found "${invocationName}". Please use GraphQL aliases that each have unique names.`
          );
          return ResultErr(error);
        }

        // Get all arguments
        const selectionArgs = selection.arguments;
        const args: Record<string, unknown> = {};

        if (selectionArgs) {
          for (const arg of selectionArgs) {
            const name = arg.name.value;

            if (args[name]) {
              return ResultErr(Error(`Duplicate arguments found: ${name}`));
            }

            const extractionResult = extractValue(arg.value, variables);
            if (!extractionResult.ok) {
              return extractionResult;
            }
            args[name] = extractionResult.value;
          }
        }

        queryInvocations[invocationName] = {
          uri,
          method,
          args,
        };
      }
    }

    return ResultOk(queryInvocations);
  }
);

const extractValue = Tracer.traceFunc(
  "core: extractValue",
  (
    node: ValueNode,
    variables?: Record<string, unknown>
  ): InvokeResult<unknown> => {
    if (node.kind === "Variable") {
      // Get the argument's value from the variables object
      if (!variables) {
        const error = Error(
          `Variables were not specified, tried to resolve variable from query. Name: ${node.name.value}\n`
        );
        return ResultErr(error);
      }

      if (variables[node.name.value] === undefined) {
        return ResultErr(Error(`Missing variable: ${node.name.value}`));
      }

      return ResultOk(variables[node.name.value]);
    } else if (
      node.kind === "StringValue" ||
      node.kind === "EnumValue" ||
      node.kind === "BooleanValue"
    ) {
      return ResultOk(node.value);
    } else if (node.kind === "IntValue") {
      return ResultOk(Number.parseInt(node.value));
    } else if (node.kind === "FloatValue") {
      return ResultOk(Number.parseFloat(node.value));
    } else if (node.kind === "NullValue") {
      return ResultOk(null);
    } else if (node.kind === "ListValue") {
      const length = node.values.length;
      const list = [];

      for (let i = 0; i < length; ++i) {
        const extractionResult = extractValue(node.values[i], variables);
        if (!extractionResult.ok) {
          return extractionResult;
        }
        list.push(extractionResult.value);
      }

      return ResultOk(list);
    } else if (node.kind === "ObjectValue") {
      const length = node.fields.length;
      const object: Record<string, unknown> = {};

      for (let i = 0; i < length; ++i) {
        const field = node.fields[i];
        const extractionResult = extractValue(field.value, variables);
        if (!extractionResult.ok) {
          return extractionResult;
        }
        object[field.name.value] = extractionResult.value;
      }

      return ResultOk(object);
    } else {
      return ResultErr(Error(`Unsupported value node: ${node}`));
    }
  }
);

export const extractSelections = Tracer.traceFunc(
  "core: extractSelections",
  (node: SelectionSetNode): Result<Record<string, unknown>, Error> => {
    const result: Record<string, unknown> = {};

    for (const selection of node.selections) {
      if (selection.kind !== "Field") {
        const error = Error(
          `Unsupported result selection type found: ${selection.kind}`
        );
        return ResultErr(error);
      }

      const name = selection.name.value;

      if (result[name]) {
        return ResultErr(Error(`Duplicate result selections found: ${name}`));
      }

      if (selection.selectionSet) {
        const selectionsResult = extractSelections(selection.selectionSet);
        if (!selectionsResult.ok) {
          return selectionsResult;
        }
        result[name] = selectionsResult.value;
      } else {
        result[name] = true;
      }
    }

    return ResultOk(result);
  }
);
