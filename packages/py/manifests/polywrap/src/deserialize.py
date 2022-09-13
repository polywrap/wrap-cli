import abc
from typing import Any, Callable, Optional


class DeserializeManifestOptions(abc.ABC):
    no_validate: Optional[bool]
    ext_schema: Callable[[Any], bool]
