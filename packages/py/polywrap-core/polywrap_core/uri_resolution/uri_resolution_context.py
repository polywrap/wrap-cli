from typing import List, Optional, Set

from ..types.uri import Uri
from .uri_resolution_step import UriResolutionStep

from abc import ABC, abstractmethod
from typing import List, Any

class IUriResolutionContext(ABC):
    @abstractmethod
    def is_resolving(self, uri: Uri) -> bool:
        pass

    @abstractmethod
    def start_resolving(self, uri: Uri) -> None:
        pass

    @abstractmethod
    def stop_resolving(self, uri: Uri) -> None:
        pass

    @abstractmethod
    def track_step(self, step: Any) -> None:
        pass

    @abstractmethod
    def get_history(self) -> List[Any]:
        pass

    @abstractmethod
    def get_resolution_path(self) -> List[Uri]:
        pass

    @abstractmethod
    def create_sub_history_context(self) -> "IUriResolutionContext":
        pass

    @abstractmethod
    def create_sub_context(self) -> "IUriResolutionContext":
        pass


class UriResolutionContext(IUriResolutionContext):
    resolving_uri_set: Set[Uri]
    resolution_path: List[Uri]
    history: List[UriResolutionStep]

    __slots__ = ("resolving_uri_map", "resolution_path", "history")

    def __init__(
        self,
        resolving_uri_set: Optional[Set[Uri]] = None,
        resolution_path: Optional[List[Uri]] = None,
        history: Optional[List[UriResolutionStep]] = None,
    ):
        self.resolving_uri_set = resolving_uri_set or set()
        self.resolution_path = resolution_path or []
        self.history = history or []

    def is_resolving(self, uri: Uri) -> bool:
        return uri in self.resolving_uri_set

    def start_resolving(self, uri: Uri) -> None:
        self.resolving_uri_set.add(uri)
        self.resolution_path.append(uri)

    def stop_resolving(self, uri: Uri) -> None:
        self.resolving_uri_set.remove(uri)

    def track_step(self, step: UriResolutionStep) -> None:
        self.history.append(step)

    def get_history(self) -> List[UriResolutionStep]:
        return self.history

    def get_resolution_path(self) -> List[Uri]:
        return list(self.resolution_path)

    def create_sub_history_context(self) -> "UriResolutionContext":
        return UriResolutionContext(resolving_uri_set=self.resolving_uri_set, resolution_path=self.resolution_path)

    def create_sub_context(self) -> "UriResolutionContext":
        return UriResolutionContext(resolving_uri_set=self.resolving_uri_set, history=self.history)
