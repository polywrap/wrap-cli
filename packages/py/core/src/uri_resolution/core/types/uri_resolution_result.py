from dataclasses import dataclass


@dataclass
class UriResolutionResult:
    uri: "Uri"
    api: "Api" = None
    error: Exception = None
