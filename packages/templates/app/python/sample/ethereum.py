from typing import Any, Optional
from polywrap import Client, Uri, PolywrapClient, PolywrapClientConfigBuilder, web3_bundle, sys_bundle

from .wrap import BaseEthereum


class Ethereum(BaseEthereum):
    def _get_default_client(self) -> Client:
        builder = PolywrapClientConfigBuilder()
        builder.add_bundle(web3_bundle)
        config = builder.build()
        return PolywrapClient(config)

    def _get_default_uri(self) -> Optional[Uri]:
        return None

    def _get_default_env(self) -> Any:
        return None
