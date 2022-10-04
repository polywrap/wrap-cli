from abc import ABC, abstractmethod
from typing import Any
# from ..wrapper import Wrapper


class IWrapPackage(ABC):
    @abstractmethod
    def create_wrapper(self) -> Any:
        pass
