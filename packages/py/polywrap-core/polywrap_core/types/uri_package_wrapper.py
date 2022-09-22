from typing import Union

from .uri import Uri
from .uri_wrapper import UriWrapper
from .uri_package import UriPackage

UriPackageOrWrapper = Union[Uri, UriWrapper, UriPackage]
