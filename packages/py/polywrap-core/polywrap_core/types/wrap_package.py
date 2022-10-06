from abc import ABC, abstractmethod
from .wrapper import Wrapper


class IWrapPackage(ABC):
    @abstractmethod
    def create_wrapper() -> Wrapper:
        pass
