# import pytest


# @pytest.fixture(autouse=True)
# async def setup():
#     await init_test_environment()

#     config = Partial(
#         plugins = [
#             PluginRegistration(
#                 uri = "wrap://ens/fs.polywrap.eth",
#                 plugin = filesystem_plugin()
#             ),
#             # IPFS is required for downloading Polywrap packages
#             PluginRegistration(
#                 uri = "wrap://ens/ipfs.polywrap.eth",
#                 plugin = ipfs_plugin(
#                     provider = providers.ipfs,
#                     fallback_providers = default_ipfs_providers
#                 )
#             ),
#             # ENS is required for resolving domain to IPFS hashes
#             PluginRegistration(
#                 uri = "wrap://ens/ens.polywrap.eth",
#                 plugin = ens_plugin(
#                     addresses = {
#                         "testnet": ens_addresses.ens_addresses
#                     }
#                 )
#             ),
#             PluginRegistration(
#                 uri = "wrap://ens/ethereum.polywrap.eth",
#                 plugin = ethereum_plugin(
#                     networks = {
#                         "testnet": {
#                             "provider": providers.ethereum
#                         }
#                     },
#                     default_network = "testnet"
#                 )
#             ),
#         ]
#     )

#     client = PolywrapClient(config)

#     yield

#     await stop_test_environment()


# async def test_invokes_simple_storage_wrapper_on_local_drive():
#     wrapper_path = path.resolve(f"{get_path_to_test_wrappers()}/wasm-as/simple-storage")
#     await build_wrapper(wrapper_path)

#     fs_path = f"{wrapper_path}/build"
#     fs_uri = f"fs/{fs_path}"

#     # query wrapper from filesystem
#     deploy = await client.query(
#         uri = fs_uri,
#         query = """mutation {
#           deployContract(
#             connection: {
#               networkNameOrChainId: "testnet"
#             }
#           )
#         }"""
#     )

#     assert not deploy.errors
#     assert deploy.data
#     assert "0x" in deploy.data.deploy_contract

#     # get the schema
#     schema = await client.get_schema(fs_uri)
#     expected_schema = await fs.promises.read_file(f"{fs_path}/schema.graphql", "utf-8")

#     # get a file
#     file = await client.get_file(fs_uri, { "path": "polywrap.json", "encoding": "utf-8" })
#     expected_file = await fs.promises.read_file(f"{fs_path}/polywrap.json", "utf-8")

#     assert file == expected_file
