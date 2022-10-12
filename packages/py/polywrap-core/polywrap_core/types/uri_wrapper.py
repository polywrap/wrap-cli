from dataclasses import dataclass
from .uri import Uri
from .wrapper import Wrapper


@dataclass(slots=True, kw_only=True)
class UriWrapper:
    uri: Uri
    wrapper: Wrapper
