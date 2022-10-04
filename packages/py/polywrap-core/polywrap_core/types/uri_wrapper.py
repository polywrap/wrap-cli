from dataclasses import dataclass
from typing import Any
from .uri import Uri
# from .wrapper import Wrapper


@dataclass(slots=True, kw_only=True)
class UriWrapper:
    uri: Uri
    wrapper: Any
