from abc import ABC, abstractmethod
from .wrapper import Wrapper


class IWasmPackage(ABC):
    @abstractmethod
    def create_wrapper(self) -> Wrapper:
        pass
