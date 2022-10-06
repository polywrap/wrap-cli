from dataclasses import dataclass
from .uri import Uri
from .wrap_package import IWrapPackage


@dataclass(slots=True, kw_only=True)
class UriPackage:
    uri: Uri
    package: IWrapPackage
