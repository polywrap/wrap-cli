from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Dict, Any, Union, Awaitable, List

from gql import gql
from graphql import DocumentNode


def create_query_document(query: str) -> DocumentNode:
    """Create a GraphQL QueryDocument by parsing a string."""
    return gql(query)


@dataclass
class QueryApiOptions:
    """Options required for an API query."""

    uri: Union[Uri, str]
    """The API's URI"""
    query: Union[str, DocumentNode]
    """The GraphQL query to parse and execute, leading to one or more API invocations"""
    variables: Dict[str, Any] = field(default_factory=dict)
    """Variables referenced within the query string via GraphQL's '$variable' syntax"""
    config: ClientConfig = None
    """Override the client's config for all invokes within this query"""
    context_id: str = ''
    """Query id used to track query context data set internally"""


@dataclass
class QueryApiResult:
    """The result of an API query, which is the aggregate of one or more [[InvokeApiResult | invocation results]]."""

    data: Dict[str, Any] = field(default_factory=dict)
    """Query result data. The type of this value is a named map, where the key is the method's name, and value is the [[InvokeApiResult]]'s data. This is done to allow for parallel invocations within a single query document. In case of method name collisions, a postfix of `_0` will be applied, where 0 will be incremented for each occurrence. If undefined, it means something went wrong. Errors should be populated with information as to what happened. Null is used to represent an intentionally null result"""
    errors: List[Exception] = field(default_factory=list)
    """Errors encountered during the query"""


@dataclass
class QueryApiInvocations:
    method_or_alias: Dict[str, InvokeApiOptions]


class QueryHandler(ABC):
    @classmethod
    @abstractmethod
    async def query(cls, options: QueryApiOptions) -> Awaitable[QueryApiResult]:
        """A type that can parse & execute a given query."""
        return
