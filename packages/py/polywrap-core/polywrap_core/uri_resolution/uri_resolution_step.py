from dataclasses import dataclass

from ..types import IUriResolutionStep


@dataclass(slots=True, kw_only=True)
class UriResolutionStep(IUriResolutionStep):
    pass
