from __future__ import annotations

from typing import Any, Dict

from graphql import SelectionSetNode, ValueNode

from ..types import InvokeApiOptions


def parse_query(uri: Uri, doc: QueryDocument, variables=None) -> InvokeApiOptions:
    if variables is None:
        variables = {}
    if len(doc.definitions) == 0:
        raise ValueError("Empty query document found.")

    query_invocations = {}
    for definition in doc.definitions:
        if definition.kind != "operation_definition":
            raise ValueError(
                f"""Unrecognized root level definition type: {definition.kind}\n
                Please use a 'query' or 'mutation' operations."""
            )

        selection_set = definition.selection_set
        selections = selection_set.selections

        if len(selections) == 0:
            raise ValueError("Empty selection set found. Please include the name of a method you'd like to query.")

        for selection in selections:
            if selection.kind != "field":
                raise ValueError(f"""Unsupported selection type found: {selection.kind}\nPlease query a method.""")

            method = selection.name.value
            invocation_name = selection.alias.value if selection.alias and selection.alias.value else method

            if query_invocations.get(invocation_name):
                raise ValueError(
                    f"""Duplicate query name found "{invocation_name}".
                    Please use GraphQL aliases that each have unique names."""
                )

            selection_args = selection.arguments
            input = {}

            if selection_args:
                for arg in selection_args:
                    name = arg.name.value

                    if input.get(name):
                        raise ValueError(f"Duplicate input argument found: {name}")

                    input[name] = extract_value(arg.value, variables)

            selection_results = selection.selection_set
            result_filter = None

            if selection_results:
                result_filter = extract_selections(selection_results)

            query_invocations[invocation_name] = InvokeApiOptions(uri, method, input, result_filter)
    return query_invocations


def extract_value(node: ValueNode, variables: Dict[str, Any] = {}) -> Any:
    if node.kind == "variable":
        # Get the argument's value from the variables object
        if not variables:
            raise ValueError(
                f"Variables were not specified, tried to resolve variable from query. Name: {node.name.value}\n"
            )

        if variables.get(node.name.value) is None:
            raise ValueError(f"Missing variable: {node.name.value}")

        return variables[node.name.value]
    elif node.kind == "string_value" or node.kind == "enum_value" or node.kind == "boolean_value":
        return node.value
    elif node.kind == "int_value":
        return int(node.value)
    elif node.kind == "float_value":
        return float(node.value)
    elif node.kind == "null_value":
        return None
    elif node.kind == "list_value":
        length = len(node.values)
        list = []
        for i in range(length):
            list.append(extract_value(node.values[i], variables))
        return list
    elif node.kind == "object_value":
        length = len(node.fields)
        object = {}
        for i in range(length):
            field = node.fields[i]
            object[field.name.value] = extract_value(field.value, variables)
        return object
    else:
        raise ValueError(f"Unsupported value node: {node} and {node.kind}")


def extract_selections(node: SelectionSetNode) -> Dict[str, Any]:
    result = {}
    for selection in node.selections:
        if selection.kind != "field":
            raise ValueError(f"Unsupported result selection type found: {selection.kind}")
        name = selection.name.value

        if result.get(name):
            raise ValueError(f"Duplicate result selections found: {name}")

        if selection.selection_set:
            result[name] = extract_selections(selection.selection_set)
        else:
            result[name] = True

    return result
