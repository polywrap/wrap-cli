from __future__ import annotations

from typing import Dict, List, Union

from .types.resolve_uri_error import ResolveUriError

from .types import (
    InternalResolverError,
    ResolveUriErrorType,
    ResolveUriResult,
    UriResolutionHistory,
    UriResolutionInfo,
    UriResolutionResult,
    UriResolver,
    UriResult,
    UriResolutionStack,
)

from ...types import Uri, Client, WrapperCache, Wrapper


async def resolve_uri(
    uri: Uri, uri_resolvers: List[UriResolver], client: Client, cache: WrapperCache
) -> ResolveUriResult:
    # Keep track of past URIs to avoid infinite loops
    visited_uri_map: Dict[str, bool] = {}
    uri_resolution_stack: UriResolutionStack = []

    current_uri: Uri = uri
    wrapper: Union[Wrapper, None] = None
    run_again: bool = True

    while run_again:
        run_again = False
        infinite_loop_detected = track_visited_uri(current_uri.uri, visited_uri_map)

        for resolver in uri_resolvers:
            if infinite_loop_detected:
                return ResolveUriResult(
                    uri=uri,
                    wrapper=wrapper,
                    uri_history=UriResolutionHistory(stack=uri_resolution_stack),
                    error=ResolveUriError(type=ResolveUriErrorType.InfiniteLoop)
                )

            kk = UriResolutionHistory(stack=uri_resolution_stack).resolution_path.stack

            result: UriResolutionResult = await resolver.resolve_uri(
                current_uri, client, cache, resolution_path=kk
            )

            track_uri_history(current_uri, resolver, result, uri_resolution_stack)

            if result.wrapper:
                wrapper = result.wrapper
                break
            elif result.uri and result.uri.uri != current_uri.uri:
                current_uri = result.uri
                run_again = True
                break
            elif result.error:
                return ResolveUriResult(
                    uri=current_uri,
                    uri_history=UriResolutionHistory(stack=uri_resolution_stack),
                    error=InternalResolverError(resolver_name=resolver.name, error=result.error),
                )

    return ResolveUriResult(uri=current_uri, wrapper=wrapper, uri_history=UriResolutionHistory(stack=uri_resolution_stack))


def track_visited_uri(uri: str, visited_uri_map: Dict[str, bool]) -> bool:
    if uri in visited_uri_map:
        return True

    visited_uri_map[uri] = True

    return False


def track_uri_history(
    source_uri: Uri, resolver: UriResolver, result: UriResolutionResult, uri_resolution_stack: UriResolutionStack
) -> None:
    uri_resolution_stack.append(
        UriResolutionInfo(
            uri_resolver=resolver.name, source_uri=source_uri, result=UriResult(uri=result.uri, is_wrapper=isinstance(result.wrapper, Wrapper))
        )
    )
