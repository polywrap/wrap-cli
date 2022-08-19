from enum import Enum

from ..types import Uri


class CoreInterfaceUris(Enum):
    uri_resolver = Uri("wrap://ens/uri-resolver.core.web3api.eth")
    logger = Uri("wrap://ens/logger.core.web3api.eth")
