from abc import ABC, abstractmethod

class IFileReader(ABC):
    @abstractmethod
    async def read_file(self, file_path: str) -> bytearray:
        pass