from dataclasses import dataclass
from .uri import Uri
from .abc import IWrapPackage


@dataclass(slots=True, kw_only=True)
class UriPackage:
    uri: Uri
    package: IWrapPackage