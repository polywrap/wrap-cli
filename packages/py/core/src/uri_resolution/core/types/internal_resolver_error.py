from . import ResolveUriErrorType
from . import ResolveUriError


class InternalResolverError(ResolveUriError):
    type = ResolveUriErrorType.InternalResolver

    def __init__(self, resolver_name: str, error: Exception):
        self.resolver_name = resolver_name
        self.error = error
