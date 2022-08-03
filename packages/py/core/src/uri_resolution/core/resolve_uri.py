from __future__ import annotations
from typing import Awaitable, Dict, List

from .types import (
    UriResolutionHistory,
    UriResolutionResult,
    UriResolver,
    ResolveUriErrorType,
    ResolveUriResult,
    InternalResolverError,
    UriResolutionInfo,
    UriResult,
)


async def resolve_uri(
    uri: Uri, uri_resolvers: List[UriResolver], client: Client, cache: ApiCache
) -> Awaitable(ResolveUriResult):
    # Keep track of past URIs to avoid infinite loops
    visited_uri_map = {}
    uri_resolution_stack = []

    current_uri = uri
    api = None
    run_again = True

    while run_again:
        run_again = False
        infinite_loop_detected = track_visited_uri(current_uri.uri, visited_uri_map)

        for resolver in uri_resolvers:
            if infinite_loop_detected:
                print('inf loop')
                return ResolveUriResult(
                    uri=uri,
                    api=api,
                    uri_history=UriResolutionHistory(uri_resolution_stack),
                    error={"type": ResolveUriErrorType.InfiniteLoop} if infinite_loop_detected else None,
                )

            print(f'resolver is {resolver}')
            result = await resolver.resolve_uri(
                current_uri, client, cache, UriResolutionHistory(uri_resolution_stack).get_resolution_path().stack
            )
            print(f'result of {result}')

            track_uri_history(current_uri, resolver, result, uri_resolution_stack)

            if result.api:
                api = result.api
                break
            elif result.uri and result.uri.uri != current_uri.uri:
                current_uri = result.uri
                run_again = True
                break
            elif result.error:
                return ResolveUriResult(
                    uri=current_uri,
                    uri_history=UriResolutionHistory(uri_resolution_stack),
                    error=InternalResolverError(resolver.name, result.error),
                )

    return ResolveUriResult(uri=current_uri, api=api, uri_history=UriResolutionHistory(uri_resolution_stack))


def track_visited_uri(uri: str, visited_uri_map: Dict[str, bool]):
    if uri in visited_uri_map:
        return True

    visited_uri_map[uri] = True

    return False


def track_uri_history(
    source_uri: Uri, resolver: UriResolver, result: UriResolutionResult, uri_resolution_stack: UriResolutionStack
):
    uri_resolution_stack.append(
        UriResolutionInfo(
            uri_resolver=resolver.name, source_uri=source_uri, result=UriResult(uri=result.uri, api=result.api)
        )
    )
