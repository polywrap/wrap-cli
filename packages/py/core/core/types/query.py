from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Awaitable, Dict, List, Optional, Union

from gql import gql
from graphql import DocumentNode

from . import ClientConfig, InvokeOptions, Uri


def create_query_document(query: str) -> DocumentNode:
    """Create a GraphQL QueryDocument by parsing a string."""
    return gql(query)


@dataclass(slots=True, kw_only=True)
class QueryOptions:
    """
    Options required to query a wrapper.

    Args:
        uri: The Wrapper's URI
        query: The GraphQL query to parse and execute, leading to one or more Wrapper invocations.
        variables: Variables referenced within the query string via GraphQL's '$variable' syntax.
        config: Override the client's config for all invokes within this query.
        context_id: Query id used to track query context data set internally.
    """

    uri: Uri
    query: Union[str, DocumentNode]
    variables: Optional[Dict[str, Any]] = field(default_factory=dict)
    config: Optional[ClientConfig] = None
    context_id: Optional[str] = None


@dataclass(slots=True, kw_only=True)
class QueryResult:
    """
    The result of a wrapper query, which is the aggregate of one or more [[InvokeResult | invocation results]].

    Args:
        data: Query result data. The type of this value is a named map, where the key is the method's name, and value is the [[InvokeResult]]'s data. This is done to allow for parallel invocations within a single query document. In case of method name collisions, a postfix of `_0` will be applied, where 0 will be incremented for each occurrence.
        errors: Errors encountered during the query.
    """

    data: Dict[str, Any] = field(default_factory=dict)
    errors: List[Exception] = field(default_factory=list)


QueryInvocations = Dict[str, InvokeOptions]


class QueryHandler(ABC):
    @abstractmethod
    async def query(self, options: QueryOptions) -> Awaitable[QueryResult]:
        """A type that can parse & execute a given query."""

QueryDocument = DocumentNode