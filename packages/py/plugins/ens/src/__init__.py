from __future__ import annotations
import re
from dataclasses import dataclass
from typing import Awaitable, List

from .wrap_man import Module, Ethereum_Module, manifest

# TODO: Generated files? And ethers python equivalent?


@dataclass
class Addresses:
    network: Address


@dataclass 
class EnsPluginConfig:
    addresses: Addresses = None


class EnsPlugin(Module):
    default_address = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"

    def __init__(self, config: EnsPluginConfig):
        super().__init__()

        # Sanitize address
        if self.config.addresses:
            self._set_addresses(self.config.addresses)

    async def try_resolve_uri(
        self,
        input: InputTryResolveUri,
        client: Client
    ) -> Awaitable[Union[UriResolver_MaybeUriOrManifest, None]]:
        if input.authority != "ens":
            return None
        
        try:
            cid = await self.ens_to_CID(input.path, client)

            if not cid:
                return None
            
            return {
                "uri": f"ipfs/{cid}",
                "manifest": None,
            }
        except Exception:
            # TODO: logging https://github.com/polywrap/monorepo/issues/33
            pass

        # Nothing found
        return { "uri": None, "manifest": None }

    def get_file(self, _input: InputGetFile, _client: Client) -> bytes:
        return None

    async def ens_to_CID(self, domain: str, client: Client) -> Awaitable[str]:
        ens_abi = {
            "resolver":
                "function resolver(bytes32 node) external view returns (address)",
        }
        resolverAbi = {
            "contenthash":
                "function contenthash(bytes32 nodehash) view returns (bytes)",
            "content": "function content(bytes32 nodehash) view returns (bytes32)",
        }
        ens_address = EnsPlugin.defaultAddress

        # Remove the ENS URI scheme & authority
        domain = domain.replace("wrap://", "")
        domain = domain.replace("ens/", "")

        # Check for non-default network
        network = "mainnet"
        has_network = re.findall(r"/^[A-Za-z0-9]+\//i", domain)
        if has_network:
            network = domain[0, domain.find("/")]

            # Remove the network from the domain URI's path
            domain = domain.replace(network + "/", "")

            # Lowercase only
            network = network.lower()

            # Check if we have a custom address configured for this network
            if self.config.addresses and self.config.addresses[network]:
                ens_address = self.config.addresses[network]
        
        domain_node = ethers.utils.namehash(domain)

        async def call_contract_view(
            address: str,
            method: str,
            args: List[str],
            network_name_or_chain_id = None
        ) -> Awaitable[str]:
            view_results = await Ethereum_Module.call_contract_view(
                {
                    address,
                    method,
                    args,
                    network_name_or_chain_id if network_name_or_chain_id else None
                },
                client
            )

            if view_results.error:
                raise view_results.error
            
            if view_results.data:
                if not isinstance(view_results.data, str):
                    raise ValueError(f"Malformed data returned from Ethereum.callContractView: {view_results.data}")
                
                return view_results.data
            
            raise ValueError(f"Ethereum.callContractView returned nothing.\nData: {view_results.data}\nError: {view_results.error}")

        # Get the node's resolver address
        resolver_address = await call_contract_view(
            ens_address,
            ens_abi.resolver,
            [domain_node],
            network
        )

        # Get the CID stored at this domain
        try:
            hash = await call_contract_view(
                resolver_address,
                resolverAbi.contenthash,
                [domain_node],
                network
            )
        except Exception as e:
            try:
                # Fallback, contenthash doesn't exist, try content
                hash = await call_contract_view(
                    resolver_address,
                    resolverAbi.content,
                    [domain_node],
                    network
                )
            except Exception as e:
                # The resolver contract is unknown...
                raise ValueError(f"Incompatible resolver ABI at address {resolver_address}")

        if hash == "0x":
            return ""
        
        if hash[0: 10] == "0xe3010170" and ethers.utils.is_hex_string(hash, 38):
            return Base58.encode(ethers.utils.hexDataSlice(hash, 4))
        else:
            raise ValueError(f"Unknown CID format, CID hash: {hash}")

    def _setAddresses(self, addresses: Addresses):
        self.config.addresses = {}

        for network in addresses:
            self.config.addresses[network] = get_address(addresses[network])


def ens_plugin(opts: EnsPluginConfig):
    return {
        EnsPlugin(opts),
        manifest
    }

plugin = ens_plugin
