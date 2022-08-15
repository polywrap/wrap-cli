from enum import Enum

from ..types import Uri


class CoreInterfaceUris(Enum):
    uri_resolver = Uri("w3://ens/uri-resolver.core.web3api.eth")
    logger = Uri("w3://ens/logger.core.web3api.eth")
