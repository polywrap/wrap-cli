from abc import ABC, abstractmethod
from typing import List, Any

from ...types import Uri


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
