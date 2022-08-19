from __future__ import annotations

from typing import Any, Dict, Optional, Tuple, Union

from graphql import (
    BooleanValueNode,
    EnumValueNode,
    FieldNode,
    FloatValueNode,
    IntValueNode,
    ListValueNode,
    NullValueNode,
    ObjectValueNode,
    SelectionNode,
    SelectionSetNode,
    StringValueNode,
    ValueNode,
    VariableNode,
    OperationDefinitionNode
)

from ..types import InvokeOptions, QueryDocument, QueryInvocations, Uri


def parse_query(uri: Uri, doc: QueryDocument, variables: Optional[Dict[str, Any]] = None) -> QueryInvocations:
    if variables is None:
        variables = {}
    if len(doc.definitions) == 0:
        raise ValueError("Empty query document found.")

    query_invocations: QueryInvocations = {}
    for definition in doc.definitions:
        if not isinstance(definition, OperationDefinitionNode):
            raise ValueError(
                f"""Unrecognized root level definition type: {definition.kind}\n
                Please use a 'query' or 'mutation' operations."""
            )

        selection_set: Union[SelectionSetNode, None] = definition.selection_set
        selections: Tuple[SelectionNode] = tuple()

        if selection_set:
            selections = selection_set.selections

        if len(selections) == 0:
            raise ValueError("Empty selection set found. Please include the name of a method you'd like to query.")

        for selection in selections:
            if not isinstance(selection, FieldNode):
                raise ValueError(f"""Unsupported selection type found: {selection.kind}\nPlease query a method.""")

            field: FieldNode = selection

            method = field.name.value
            invocation_name = field.alias.value if field.alias and field.alias.value else method

            if query_invocations.get(invocation_name):
                raise ValueError(
                    f"""Duplicate query name found "{invocation_name}".
                    Please use GraphQL aliases that each have unique names."""
                )

            field_args = field.arguments
            args: Dict[str, Any] = {}

            if field_args:
                for arg in field_args:
                    name = arg.name.value

                    if args.get(name):
                        raise ValueError(f"Duplicate argument found: {name}")

                    args[name] = extract_value(arg.value, variables)

            query_invocations[invocation_name] = InvokeOptions(uri=uri, method=method, args=args)
    return query_invocations


def extract_value(node: Union[ValueNode, VariableNode], variables: Dict[str, Any] = {}) -> Any:
    if isinstance(node, VariableNode):
        # Get the argument's value from the variables object
        if not variables:
            raise ValueError(
                f"Variables were not specified, tried to resolve variable from query. Name: {node.name.value}\n"
            )

        if variables.get(node.name.value) is None:
            raise ValueError(f"Missing variable: {node.name.value}")

        return variables[node.name.value]
    elif isinstance(node, StringValueNode) or isinstance(node, EnumValueNode) or isinstance(node, BooleanValueNode):
        return node.value
    elif isinstance(node, IntValueNode):
        return int(node.value)
    elif isinstance(node, FloatValueNode):
        return float(node.value)
    elif isinstance(node, NullValueNode):
        return None
    elif isinstance(node, ListValueNode):
        return [extract_value(node.values[i], variables) for i in range(len(node.values))]
    elif isinstance(node, ObjectValueNode):
        length = len(node.fields)
        object: Dict[str, Any] = {}
        for i in range(length):
            field = node.fields[i]
            object[field.name.value] = extract_value(field.value, variables)
        return object
    else:
        raise ValueError(f"Unsupported value node: {node} and {node.kind}")


# TODO: remove this if not needed
def extract_selections(node: SelectionSetNode) -> Dict[str, Any]:
    result: Dict[str, Any] = {}
    for selection in node.selections:
        print(type(selection))
        if not isinstance(selection, FieldNode):
            raise ValueError(f"Unsupported result selection type found: {selection.kind}")
        name = selection.name.value

        if result.get(name):
            raise ValueError(f"Duplicate result selections found: {name}")

        if selection.selection_set:
            result[name] = extract_selections(selection.selection_set)
        else:
            result[name] = True

    return result
